// OpenChess Move Classification and CAPS Evaluation Model
// Clean-room implementation for accurate move accuracy and CPL metrics

export type MoveClassificationType =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'miss';

export interface EvaluatedMove {
  moveNumber: number;
  color: 'w' | 'b';
  san: string;
  from: string;
  to: string;
  fenBefore: string;
  fenAfter: string;
  centipawnsBefore: number;
  centipawnsAfter: number;
  winProbBefore: number;
  winProbAfter: number;
  winProbLoss: number;
  bestMoveSan: string;
  classification: MoveClassificationType;
  depth: number;
  explanation: string;
}

export interface ReviewReport {
  whiteAccuracy: number;
  blackAccuracy: number;
  moves: EvaluatedMove[];
  counts: {
    white: Record<MoveClassificationType, number>;
    black: Record<MoveClassificationType, number>;
  };
  summary: {
    brilliantCount: number;
    blunderCount: number;
    coachVerdict: string;
  };
}

/**
 * Maps centipawns to win percentage (0 to 100%) using CAPS2 sigmoid
 */
export function calculateWinPercentage(cp: number): number {
  if (isNaN(cp)) return 50;
  const clamped = Math.max(-1500, Math.min(1500, cp));
  const expVal = Math.exp(-0.003682 * clamped);
  const prob = 50 + 50 * (2 / (1 + expVal) - 1);
  return Math.max(0, Math.min(100, Math.round(prob * 10) / 10));
}

/**
 * Counts material from piece placement in FEN string
 */
export function getMaterialPoints(fen: string): { white: number; black: number } {
  const [placement] = fen.split(' ');
  if (!placement) return { white: 0, black: 0 };

  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  let white = 0;
  let black = 0;

  for (const char of placement) {
    const val = values[char.toLowerCase()];
    if (val !== undefined) {
      if (char === char.toUpperCase()) {
        white += val;
      } else {
        black += val;
      }
    }
  }

  return { white, black };
}

/**
 * Evaluates move classification based on centipawn loss and tactical criteria
 */
export function classifyMove(params: {
  cpBefore: number;
  cpAfter: number;
  color: 'w' | 'b';
  isEngineBest: boolean;
  isBook: boolean;
  materialSacrifice: boolean;
  opponentBlunderedBefore: boolean;
}): { classification: MoveClassificationType; explanation: string } {
  const {
    cpBefore,
    cpAfter,
    color,
    isEngineBest,
    isBook,
    materialSacrifice,
    opponentBlunderedBefore,
  } = params;

  // Normalized mover perspective
  const moverCpBefore = color === 'w' ? cpBefore : -cpBefore;
  const moverCpAfter = color === 'w' ? cpAfter : -cpAfter;
  const cpl = Math.max(0, moverCpBefore - moverCpAfter);

  const winBefore = calculateWinPercentage(moverCpBefore);
  const winAfter = calculateWinPercentage(moverCpAfter);
  const winLoss = Math.max(0, winBefore - winAfter);

  // Book move
  if (isBook && winLoss < 4) {
    return {
      classification: 'book',
      explanation: 'Established opening theory book move.',
    };
  }

  // Brilliant (!!) - tactical sacrifice retaining strong advantage
  if (materialSacrifice && winAfter >= 60 && winLoss <= 2) {
    return {
      classification: 'brilliant',
      explanation: 'A brilliant tactical piece sacrifice that maintains a winning initiative!',
    };
  }

  // Great (!) - finding a critical resource
  if (isEngineBest && winAfter >= 48 && winLoss <= 1 && winBefore <= 52) {
    return {
      classification: 'great',
      explanation: 'A great find! Finding the critical defensive or attacking continuation.',
    };
  }

  // Best move
  if (isEngineBest || cpl <= 10) {
    return {
      classification: 'best',
      explanation: 'The best move recommended by the engine.',
    };
  }

  // Miss
  if (opponentBlunderedBefore && cpl >= 70) {
    return {
      classification: 'miss',
      explanation: 'A missed opportunity to punish the opponent’s previous tactical blunder.',
    };
  }

  // Blunder (??)
  if (cpl >= 200 || winLoss >= 20) {
    return {
      classification: 'blunder',
      explanation: 'A blunder that drastically shifts the evaluation in your opponent’s favor.',
    };
  }

  // Mistake (?)
  if (cpl >= 90 || winLoss >= 10) {
    return {
      classification: 'mistake',
      explanation: 'A mistake that surrenders significant positional control.',
    };
  }

  // Inaccuracy (?!)
  if (cpl >= 35 || winLoss >= 4) {
    return {
      classification: 'inaccuracy',
      explanation: 'An inaccuracy that lets the opponent equalize or gain activity.',
    };
  }

  // Excellent
  if (cpl <= 25) {
    return {
      classification: 'excellent',
      explanation: 'An excellent choice maintaining active pressure.',
    };
  }

  // Good
  return {
    classification: 'good',
    explanation: 'A solid move keeping the position balanced.',
  };
}

/**
 * CAPS Accuracy formula
 */
export function calculateAccuracy(moves: EvaluatedMove[], color: 'w' | 'b'): number {
  const moverMoves = moves.filter((m) => m.color === color);
  if (moverMoves.length === 0) return 100;

  let totalAcc = 0;
  for (const m of moverMoves) {
    // Non-linear loss decay curve
    const moveScore = 100 * Math.exp(-0.04 * m.winProbLoss);
    totalAcc += moveScore;
  }

  const result = totalAcc / moverMoves.length;
  return Math.round(Math.max(15, Math.min(100, result)) * 10) / 10;
}
