import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Sparkles, Sliders, Play, RotateCcw, FileText, Check } from 'lucide-react';
import { ChessBoard, MoveEvent } from '../board/ChessBoard';
import { EvalBar } from '../board/EvalBar';
import { MoveList } from '../board/MoveList';
import { GameReviewModal } from './GameReviewModal';
import { stockfishEngine } from '../../services/stockfish/engine';
import { ReviewReport } from '../../services/stockfish/evaluator';
import { BoardTheme, UserProfile } from '../../utils/storage';
import { PieceStyle } from '../pieces/PieceSet';

const FAMOUS_GAMES = [
  {
    name: 'Game of the Century (Byrne vs Fischer, 1956)',
    moves: [
      { from: 'g1', to: 'f3', san: 'Nf3' },
      { from: 'g8', to: 'f6', san: 'Nf6' },
      { from: 'c2', to: 'c4', san: 'c4' },
      { from: 'g7', to: 'g6', san: 'g6' },
      { from: 'b1', to: 'c3', san: 'Nc3' },
      { from: 'f8', to: 'g7', san: 'Bg7' },
      { from: 'd2', to: 'd4', san: 'd4' },
      { from: 'e8', to: 'g8', san: 'O-O' },
      { from: 'c1', to: 'f4', san: 'Bf4' },
      { from: 'd7', to: 'd5', san: 'd5' },
      { from: 'd1', to: 'b3', san: 'Qb3' },
      { from: 'd5', to: 'c4', san: 'dxc4' },
      { from: 'b3', to: 'c4', san: 'Qxc4' },
      { from: 'c7', to: 'c6', san: 'c6' },
      { from: 'e2', to: 'e4', san: 'e4' },
      { from: 'b8', to: 'd7', san: 'Nbd7' },
      { from: 'a1', to: 'd1', san: 'Rad1' },
      { from: 'd7', to: 'b6', san: 'Nb6' },
      { from: 'c4', to: 'c5', san: 'Qc5' },
      { from: 'c8', to: 'g4', san: 'Bg4' },
      { from: 'f4', to: 'g5', san: 'Bg5' },
      { from: 'b6', to: 'a4', san: 'Na4' },
    ],
  },
  {
    name: 'Opera Game (Paul Morphy vs Allies, 1858)',
    moves: [
      { from: 'e2', to: 'e4', san: 'e4' },
      { from: 'e7', to: 'e5', san: 'e5' },
      { from: 'g1', to: 'f3', san: 'Nf3' },
      { from: 'd7', to: 'd6', san: 'd6' },
      { from: 'd2', to: 'd4', san: 'd4' },
      { from: 'c8', to: 'g4', san: 'Bg4' },
      { from: 'd4', to: 'e5', san: 'dxe5' },
      { from: 'g4', to: 'f3', san: 'Bxf3' },
      { from: 'd1', to: 'f3', san: 'Qxf3' },
      { from: 'd6', to: 'e5', san: 'dxe5' },
      { from: 'f1', to: 'c4', san: 'Bc4' },
      { from: 'g8', to: 'f6', san: 'Nf6' },
      { from: 'f3', to: 'b3', san: 'Qb3' },
      { from: 'd8', to: 'e7', san: 'Qe7' },
      { from: 'b1', to: 'c3', san: 'Nc3' },
      { from: 'c7', to: 'c6', san: 'c6' },
      { from: 'c1', to: 'g5', san: 'Bg5' },
      { from: 'b7', to: 'b5', san: 'b5' },
      { from: 'c3', to: 'b5', san: 'Nxb5' },
    ],
  },
];

interface AnalysisViewProps {
  userProfile: UserProfile;
  initialMoves?: { from: string; to: string; san: string }[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  userProfile,
  initialMoves,
}) => {
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [history, setHistory] = useState<{ from: string; to: string; san: string }[]>(
    initialMoves || FAMOUS_GAMES[0].moves
  );
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [orientation, setOrientation] = useState<'w' | 'b'>('w');

  const [scoreCp, setScoreCp] = useState<number>(0);
  const [bestEngineMove, setBestEngineMove] = useState<string>('');
  const [depth, setDepth] = useState<number>(14);
  const [fenInput, setFenInput] = useState<string>('');

  const [reviewReport, setReviewReport] = useState<ReviewReport | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Initialize with initial moves or default famous game
  React.useEffect(() => {
    if (initialMoves && initialMoves.length > 0) {
      loadMoveSequence(initialMoves);
    } else {
      loadMoveSequence(FAMOUS_GAMES[0].moves);
    }
  }, [initialMoves]);

  const loadMoveSequence = (seq: { from: string; to: string; san: string }[]) => {
    const replay = new Chess();
    for (const m of seq) {
      replay.move(m);
    }
    setGame(replay);
    setHistory(seq);
    setCurrentIdx(seq.length - 1);
    if (seq.length > 0) {
      setLastMove({ from: seq[seq.length - 1].from, to: seq[seq.length - 1].to });
    }

    // Engine eval
    const evalRes = stockfishEngine.evaluatePosition(replay.fen(), 3);
    setScoreCp(evalRes.cp);
    setBestEngineMove(evalRes.bestMoveSan);

    // Auto-generate full review report
    const report = stockfishEngine.analyzeGame(seq);
    setReviewReport(report);
  };

  const handleSelectMove = (index: number) => {
    if (index < 0) {
      const g = new Chess();
      setGame(g);
      setCurrentIdx(-1);
      setLastMove(null);
      const ev = stockfishEngine.evaluatePosition(g.fen(), 2);
      setScoreCp(ev.cp);
      setBestEngineMove(ev.bestMoveSan);
      return;
    }

    const replay = new Chess();
    for (let i = 0; i <= index; i++) {
      replay.move(history[i]);
    }
    setGame(replay);
    setCurrentIdx(index);
    setLastMove({ from: history[index].from, to: history[index].to });

    const ev = stockfishEngine.evaluatePosition(replay.fen(), 3);
    setScoreCp(ev.cp);
    setBestEngineMove(ev.bestMoveSan);
  };

  const handleBoardMove = (moveEv: MoveEvent) => {
    const updated = [
      ...history.slice(0, currentIdx + 1),
      { from: moveEv.from, to: moveEv.to, san: moveEv.san },
    ];
    setHistory(updated);
    setCurrentIdx(updated.length - 1);
    setLastMove({ from: moveEv.from, to: moveEv.to });

    const ev = stockfishEngine.evaluatePosition(game.fen(), 3);
    setScoreCp(ev.cp);
    setBestEngineMove(ev.bestMoveSan);

    const report = stockfishEngine.analyzeGame(updated);
    setReviewReport(report);
  };

  const handleLoadFen = () => {
    try {
      const g = new Chess(fenInput.trim());
      setGame(g);
      setHistory([]);
      setCurrentIdx(-1);
      setLastMove(null);
      const ev = stockfishEngine.evaluatePosition(g.fen(), 3);
      setScoreCp(ev.cp);
      setBestEngineMove(ev.bestMoveSan);
    } catch {
      alert('Invalid FEN string');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start max-w-7xl mx-auto p-4 w-full animate-fade-in select-none">
      {/* Board & Eval Bar Column */}
      <div className="w-full lg:w-[560px] shrink-0 flex flex-col items-center">
        {/* Engine top stats bar */}
        <div className="w-full bg-[#262522] px-3.5 py-2 rounded-lg border border-[#363431] flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-chess-green uppercase tracking-wider">
              Stockfish Engine
            </span>
            <span className="text-xs text-chess-dim font-mono">
              Depth {depth}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {bestEngineMove && (
              <span className="text-xs text-chess-muted">
                Best move: <strong className="text-white font-mono">{bestEngineMove}</strong>
              </span>
            )}
            <button
              onClick={() => setIsReviewOpen(true)}
              className="py-1 px-3 bg-chess-green hover:bg-chess-greenHover text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow"
            >
              <Sparkles size={14} />
              Full Review
            </button>
          </div>
        </div>

        {/* Board with EvalBar */}
        <div className="flex gap-2 w-full">
          <EvalBar scoreCp={scoreCp} orientation={orientation} height="100%" />

          <div className="flex-1">
            <ChessBoard
              game={game}
              orientation={orientation}
              theme={userProfile.preferences.theme}
              pieceStyle={userProfile.preferences.pieceStyle}
              showCoords={userProfile.preferences.showCoords}
              showLegalMoves={true}
              interactive={true}
              lastMove={lastMove}
              onMove={handleBoardMove}
            />
          </div>
        </div>

        {/* Load FEN Bar */}
        <div className="w-full flex gap-2 mt-3">
          <input
            type="text"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            placeholder="Paste FEN position here..."
            className="flex-1 bg-[#262522] border border-[#363431] rounded-lg px-3 py-1.5 text-xs text-white placeholder-chess-dim outline-none font-mono"
          />
          <button
            onClick={handleLoadFen}
            className="py-1.5 px-3 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-xs font-semibold rounded-lg border border-[#403d39] transition-colors"
          >
            Load FEN
          </button>
        </div>
      </div>

      {/* Sidebar: Move List & Famous Games */}
      <div className="flex-1 w-full flex flex-col h-[560px] space-y-3">
        {/* Famous Games Presets */}
        <div className="bg-[#262522] p-3 rounded-lg border border-[#363431] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-chess-dim block">
            Famous Masterpieces
          </span>
          <div className="flex gap-2">
            {FAMOUS_GAMES.map((fg, idx) => (
              <button
                key={idx}
                onClick={() => loadMoveSequence(fg.moves)}
                className="flex-1 py-1.5 px-2 bg-[#312e2b] hover:bg-[#3d3a36] text-chess-muted hover:text-white rounded text-xs font-medium truncate text-left border border-[#403d39] transition-colors"
                title={fg.name}
              >
                {fg.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Move History */}
        <div className="flex-1 min-h-0">
          <MoveList
            history={history}
            currentMoveIndex={currentIdx}
            evaluatedMoves={reviewReport?.moves}
            onSelectMove={handleSelectMove}
            onFlipBoard={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
          />
        </div>
      </div>

      {/* Game Review Modal */}
      {isReviewOpen && reviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-[90vh]">
            <GameReviewModal
              report={reviewReport}
              currentMoveIndex={currentIdx}
              onSelectMove={(idx) => {
                handleSelectMove(idx);
                setIsReviewOpen(false);
              }}
              onClose={() => setIsReviewOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
