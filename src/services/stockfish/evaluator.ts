// Stockfish & Free Unlocked Game Review Evaluator
// Mathematical precision adhering to Chess.com CAPS2 Win Probability models & Centipawn Loss (CPL)

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
 * Maps Centipawns (cp) to Win Probability (W%) using CAPS2 sigmoid formula:
 * W = 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
 */
export function calculateWinPercentage(cp: number): number {
  const clampedCp = Math.max(-2000, Math.min(2000, cp));
  const expVal = Math.exp(-0.00368208 * clampedCp);
  const winProb = 50 + 50 * (2 / (1 + expVal) - 1);
  return Math.max(0, Math.min(100, winProb));
}

/**
 * Calculates material balance on board from FEN
 */
export function calculateMaterialCount(fen: string): { white: number; black: number } {
  const piecePlacement = fen.split(' ')[0] || '';
  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  let white = 0;
  let black = 0;

  for (const char of piecePlacement) {
    const lower = char.toLowerCase();
    if (pieceValues[lower] !== undefined) {
      if (char === char.toUpperCase()) {
        white += pieceValues[lower];
      } else {
        black += pieceValues[lower];
      }
    }
  }

  return { white, black };
}

/**
 * Checks if a move sacrificed material
 */
export function isMaterialSacrifice(
  fenBefore: string,
  fenAfter: string,
  color: 'w' | 'b'
): boolean {
  const before = calculateMaterialCount(fenBefore);
  const after = calculateMaterialCount(fenAfter);

  if (color === 'w') {
    const netChange = (after.white - after.black) - (before.white - before.black);
    return netChange <= -2; // Sacrificed at least 2 points (minor piece or exchange)
  } else {
    const netChange = (after.black - after.white) - (before.black - before.white);
    return netChange <= -2;
  }
}

/**
 * Classifies a move based on centipawn loss and CAPS2 win probability loss
 */
export function classifyMove(params: {
  winProbBefore: number;
  winProbAfter: number;
  centipawnsBefore: number;
  centipawnsAfter: number;
  color: 'w' | 'b';
  isBookMove?: boolean;
  isSacrifice?: boolean;
  isEngineBest?: boolean;
  opponentPreviousBlundered?: boolean;
}): { classification: MoveClassificationType; explanation: string } {
  const {
    winProbBefore,
    winProbAfter,
    color,
    isBookMove = false,
    isSacrifice = false,
    isEngineBest = false,
    opponentPreviousBlundered = false,
  } = params;

  // Win probability loss from perspective of current mover
  const currentWinProbBefore = color === 'w' ? winProbBefore : 100 - winProbBefore;
  const currentWinProbAfter = color === 'w' ? winProbAfter : 100 - winProbAfter;
  const winProbLoss = Math.max(0, currentWinProbBefore - currentWinProbAfter);

  // Centipawn loss from mover perspective
  const cpBefore = color === 'w' ? params.centipawnsBefore : -params.centipawnsBefore;
  const cpAfter = color === 'w' ? params.centipawnsAfter : -params.centipawnsAfter;
  const cpl = Math.max(0, cpBefore - cpAfter);

  // 1. Book Move check
  if (isBookMove && winProbLoss < 5) {
    return {
      classification: 'book',
      explanation: 'Established opening theory book move.',
    };
  }

  // 2. Brilliant move (!!)
  // Material sacrifice that retains or improves winning advantage
  if (isSacrifice && currentWinProbAfter >= 65 && winProbLoss <= 3) {
    return {
      classification: 'brilliant',
      explanation: 'A brilliant tactical sacrifice that retains a decisive advantage!',
    };
  }

  // 3. Great move (!)
  // Finding the singular top move in a complex or critical position
  if (isEngineBest && currentWinProbAfter >= 50 && winProbLoss <= 1 && currentWinProbBefore <= 55) {
    return {
      classification: 'great',
      explanation: 'A great find! Finding the only move that keeps the position equal or winning.',
    };
  }

  // 4. Best move
  if (isEngineBest || cpl <= 10 || winProbLoss <= 1.5) {
    return {
      classification: 'best',
      explanation: 'The best move according to deep engine analysis.',
    };
  }

  // 5. Miss: failing to punish an opponent's blunder
  if (opponentPreviousBlundered && cpl > 70) {
    return {
      classification: 'miss',
      explanation: 'Missed a winning opportunity to punish your opponent’s blunder.',
    };
  }

  // 6. Blunder (??)
  if (cpl > 200 || winProbLoss > 20) {
    return {
      classification: 'blunder',
      explanation: 'A blunder that drastically swings the evaluation in the opponent’s favor.',
    };
  }

  // 7. Mistake (?)
  if (cpl > 90 || winProbLoss > 10) {
    return {
      classification: 'mistake',
      explanation: 'A mistake that relinquishes significant positional control.',
    };
  }

  // 8. Inaccuracy (?!)
  if (cpl > 35 || winProbLoss > 4) {
    return {
      classification: 'inaccuracy',
      explanation: 'An inaccuracy that allows the opponent to equalize or gain ground.',
    };
  }

  // 9. Excellent
  if (cpl <= 25 || winProbLoss <= 2.5) {
    return {
      classification: 'excellent',
      explanation: 'An excellent choice maintaining strong initiative.',
    };
  }

  // 10. Good
  return {
    classification: 'good',
    explanation: 'A solid move keeping the position balanced.',
  };
}

/**
 * Calculates overall accuracy score (0 to 100%)
 */
export function calculateAccuracy(moves: EvaluatedMove[], color: 'w' | 'b'): number {
  const playerMoves = moves.filter((m) => m.color === color);
  if (playerMoves.length === 0) return 100;

  let totalScore = 0;
  for (const move of playerMoves) {
    const loss = move.winProbLoss;
    // Non-linear CAPS accuracy mapping:
    // Small losses yield high 90s, larger losses drop sharply
    const moveAccuracy = 100 * Math.exp(-0.045 * loss);
    totalScore += moveAccuracy;
  }

  const rawAcc = totalScore / playerMoves.length;
  return Math.round(Math.max(10, Math.min(100, rawAcc)) * 10) / 10;
}
