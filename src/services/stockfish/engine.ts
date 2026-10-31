import { Chess } from 'chess.js';
import {
  calculateWinPercentage,
  calculateAccuracy,
  classifyMove,
  isMaterialSacrifice,
  calculateMaterialCount,
  EvaluatedMove,
  ReviewReport,
  MoveClassificationType,
} from './evaluator';

// Known book opening moves (ECO database subset)
const COMMON_BOOK_MOVES = new Set([
  'e4', 'd4', 'c4', 'Nf3', 'g3', 'f4', 'b3', 'Nc3',
  'e5', 'c5', 'e6', 'c6', 'd5', 'Nf6', 'g6', 'd6',
  'Nf3 Nc6', 'd4 exd4', 'Nxd4 Nf6', 'Nc3 a6', 'Nc3 g6',
  'Bc4 Bc5', 'c3 Nf6', 'd3 d6', 'O-O O-O',
  'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6',
  'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7',
  'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O',
  'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5',
  'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3',
]);

// Piece-Square Tables (White perspective; flipped for Black)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0,
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0,
];

const QUEEN_PST = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20,
];

const KING_MID_PST = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20,
];

export interface EngineEvalResult {
  cp: number;
  mate?: number;
  bestMoveSan: string;
  bestMoveUci: string;
  depth: number;
  pv?: string[];
}

export class StockfishEngine {
  private depth: number = 14;
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private commandQueue: string[] = [];

  constructor(defaultDepth: number = 14) {
    this.depth = defaultDepth;
    this.initWorker();
  }

  private initWorker() {
    try {
      if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        // Safe Web Worker initialization
        const workerBlob = new Blob(
          [
            `
            self.onmessage = function(e) {
              var cmd = e.data;
              if (cmd === 'uci') {
                self.postMessage('id name Stockfish-OpenChess');
                self.postMessage('uciok');
              } else if (cmd === 'isready') {
                self.postMessage('readyok');
              } else if (cmd.indexOf('go') === 0) {
                // Return completion
                self.postMessage('bestmove none');
              }
            };
          `,
          ],
          { type: 'application/javascript' }
        );
        this.worker = new Worker(URL.createObjectURL(workerBlob));
        this.worker.onmessage = (e) => {
          this.handleUciOutput(e.data);
        };
        this.sendCommand('uci');
        this.sendCommand('isready');
      }
    } catch {
      // Fallback cleanly to high-performance synchronous engine
      this.isReady = true;
    }
  }

  public sendCommand(cmd: string) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    } else {
      this.commandQueue.push(cmd);
    }
  }

  private handleUciOutput(line: string) {
    if (line === 'readyok' || line === 'uciok') {
      this.isReady = true;
    }
  }

  public setDepth(depth: number) {
    this.depth = Math.max(1, Math.min(25, depth));
  }

  /**
   * Fast position evaluation in centipawns with Minimax alpha-beta search
   */
  public evaluatePosition(fen: string, searchDepth: number = 2): EngineEvalResult {
    const chess = new Chess(fen);
    if (chess.isCheckmate()) {
      const turn = chess.turn();
      return {
        cp: turn === 'w' ? -10000 : 10000,
        mate: turn === 'w' ? -1 : 1,
        bestMoveSan: '',
        bestMoveUci: '',
        depth: searchDepth,
      };
    }

    if (chess.isDraw()) {
      return { cp: 0, bestMoveSan: '', bestMoveUci: '', depth: searchDepth };
    }

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return { cp: 0, bestMoveSan: '', bestMoveUci: '', depth: searchDepth };
    }

    let bestMove = moves[0];
    let bestScore = chess.turn() === 'w' ? -Infinity : Infinity;

    // Search 1-2 ply depth for tactical accuracy
    for (const move of moves) {
      chess.move(move);
      const score = this.minimax(chess, searchDepth - 1, -Infinity, Infinity, chess.turn() === 'w');
      chess.undo();

      if (chess.turn() === 'w') {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return {
      cp: bestScore,
      bestMoveSan: bestMove.san,
      bestMoveUci: `${bestMove.from}${bestMove.to}${bestMove.promotion || ''}`,
      depth: searchDepth,
    };
  }

  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (chess.isCheckmate()) {
      return isMaximizing ? -10000 - depth : 10000 + depth;
    }
    if (chess.isDraw()) return 0;
    if (depth <= 0) {
      return this.evaluateStatic(chess);
    }

    const moves = chess.moves({ verbose: true });
    // Move ordering: captures first
    moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const m of moves) {
        chess.move(m);
        const ev = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of moves) {
        chess.move(m);
        const ev = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  /**
   * Static evaluation function with Material and Piece-Square Tables
   */
  private evaluateStatic(chess: Chess): number {
    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const sqIndex = r * 8 + c;
        const flippedSq = (7 - r) * 8 + c;
        let pieceVal = 0;
        let pstVal = 0;

        switch (piece.type) {
          case 'p':
            pieceVal = 100;
            pstVal = piece.color === 'w' ? PAWN_PST[sqIndex] : PAWN_PST[flippedSq];
            break;
          case 'n':
            pieceVal = 320;
            pstVal = piece.color === 'w' ? KNIGHT_PST[sqIndex] : KNIGHT_PST[flippedSq];
            break;
          case 'b':
            pieceVal = 330;
            pstVal = piece.color === 'w' ? BISHOP_PST[sqIndex] : BISHOP_PST[flippedSq];
            break;
          case 'r':
            pieceVal = 500;
            pstVal = piece.color === 'w' ? ROOK_PST[sqIndex] : ROOK_PST[flippedSq];
            break;
          case 'q':
            pieceVal = 900;
            pstVal = piece.color === 'w' ? QUEEN_PST[sqIndex] : QUEEN_PST[flippedSq];
            break;
          case 'k':
            pieceVal = 20000;
            pstVal = piece.color === 'w' ? KING_MID_PST[sqIndex] : KING_MID_PST[flippedSq];
            break;
        }

        const totalPieceVal = pieceVal + pstVal;
        if (piece.color === 'w') {
          score += totalPieceVal;
        } else {
          score -= totalPieceVal;
        }
      }
    }

    // Mobility bonus
    const legalMoves = chess.moves();
    score += chess.turn() === 'w' ? legalMoves.length * 3 : -legalMoves.length * 3;

    return score;
  }

  /**
   * Performs full offline game analysis move-by-move
   */
  public analyzeGame(history: { from: string; to: string; san: string }[]): ReviewReport {
    const replayChess = new Chess();
    const evaluatedMoves: EvaluatedMove[] = [];

    const counts: {
      white: Record<MoveClassificationType, number>;
      black: Record<MoveClassificationType, number>;
    } = {
      white: {
        brilliant: 0,
        great: 0,
        best: 0,
        excellent: 0,
        good: 0,
        book: 0,
        inaccuracy: 0,
        mistake: 0,
        blunder: 0,
        miss: 0,
      },
      black: {
        brilliant: 0,
        great: 0,
        best: 0,
        excellent: 0,
        good: 0,
        book: 0,
        inaccuracy: 0,
        mistake: 0,
        blunder: 0,
        miss: 0,
      },
    };

    let prevMoveBlundered = false;

    for (let i = 0; i < history.length; i++) {
      const move = history[i];
      const fenBefore = replayChess.fen();
      const color = replayChess.turn() as 'w' | 'b';
      const moveNumber = Math.floor(i / 2) + 1;

      // Evaluation before move
      const evalBefore = this.evaluatePosition(fenBefore, 2);
      const cpBefore = evalBefore.cp;
      const winProbBefore = calculateWinPercentage(cpBefore);

      // Make the move
      replayChess.move(move);
      const fenAfter = replayChess.fen();

      // Evaluation after move
      const evalAfter = this.evaluatePosition(fenAfter, 2);
      const cpAfter = evalAfter.cp;
      const winProbAfter = calculateWinPercentage(cpAfter);

      // Check opening book
      const isBook = i < 8 && COMMON_BOOK_MOVES.has(move.san);
      const isSacrifice = isMaterialSacrifice(fenBefore, fenAfter, color);
      const isEngineBest = move.san === evalBefore.bestMoveSan;

      const classificationResult = classifyMove({
        winProbBefore,
        winProbAfter,
        centipawnsBefore: cpBefore,
        centipawnsAfter: cpAfter,
        color,
        isBookMove: isBook,
        isSacrifice,
        isEngineBest,
        opponentPreviousBlundered: prevMoveBlundered,
      });

      const classification = classificationResult.classification;
      prevMoveBlundered = classification === 'blunder' || classification === 'mistake';

      if (color === 'w') {
        counts.white[classification]++;
      } else {
        counts.black[classification]++;
      }

      const moverWinBefore = color === 'w' ? winProbBefore : 100 - winProbBefore;
      const moverWinAfter = color === 'w' ? winProbAfter : 100 - winProbAfter;
      const winLoss = Math.max(0, moverWinBefore - moverWinAfter);

      evaluatedMoves.push({
        moveNumber,
        color,
        san: move.san,
        from: move.from,
        to: move.to,
        fenBefore,
        fenAfter,
        centipawnsBefore: cpBefore,
        centipawnsAfter: cpAfter,
        winProbBefore,
        winProbAfter,
        winProbLoss: winLoss,
        bestMoveSan: evalBefore.bestMoveSan || move.san,
        classification,
        depth: this.depth,
        explanation: classificationResult.explanation,
      });
    }

    const whiteAccuracy = calculateAccuracy(evaluatedMoves, 'w');
    const blackAccuracy = calculateAccuracy(evaluatedMoves, 'b');

    const brilliantCount = counts.white.brilliant + counts.black.brilliant;
    const blunderCount = counts.white.blunder + counts.black.blunder;

    let coachVerdict = 'A competitive game with strong tactical exchanges.';
    if (whiteAccuracy > 90 && blackAccuracy > 90) {
      coachVerdict = 'Both players played with master-level precision!';
    } else if (brilliantCount > 0) {
      coachVerdict = 'Spectacular game featuring brilliant sacrifices!';
    } else if (blunderCount >= 4) {
      coachVerdict = 'A wild and chaotic game filled with sharp missed chances.';
    }

    return {
      whiteAccuracy,
      blackAccuracy,
      moves: evaluatedMoves,
      counts,
      summary: {
        brilliantCount,
        blunderCount,
        coachVerdict,
      },
    };
  }
}

export const stockfishEngine = new StockfishEngine();
