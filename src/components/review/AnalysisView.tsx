import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import {
  Sparkles,
  BarChart2,
  FileText,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { ChessBoard, MoveEvent } from '../board/ChessBoard';
import { EvalBar } from '../board/EvalBar';
import { MoveList } from '../board/MoveList';
import { GameReviewModal } from './GameReviewModal';
import { stockfishEngine } from '../../services/stockfish/engine';
import { ReviewReport, EvaluatedMove } from '../../services/stockfish/evaluator';
import { UserProfile } from '../../utils/storage';

// 100% verified legal masterpieces
const MASTERPIECE_GAMES = [
  {
    name: 'Opera Game (Paul Morphy vs Allies, 1858)',
    movesSan: [
      'e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qxf3', 'dxe5',
      'Bc4', 'Nf6', 'Qb3', 'Qe7', 'Nc3', 'c6', 'Bg5', 'b5', 'Nxb5', 'cxb5',
      'Bxb5+', 'Nbd7', 'O-O-O', 'Rd8', 'Rxd7', 'Rxd7', 'Rd1', 'Qe6',
      'Bxd7+', 'Nxd7', 'Qb8+', 'Nxb8', 'Rd8#'
    ],
  },
  {
    name: 'Immortal Game (Anderssen vs Kieseritzky, 1851)',
    movesSan: [
      'e4', 'e5', 'f4', 'exf4', 'Bc4', 'Qh4+', 'Kf1', 'b5', 'Bxb5', 'Nf6',
      'Nf3', 'Qh6', 'd3', 'Nh5', 'Nh4', 'Qg5', 'Nf5', 'c6', 'g4', 'Nf6',
      'Rg1', 'cxb5', 'h4', 'Qg6', 'h5', 'Qg5', 'Qf3', 'Ng8', 'Bxf4', 'Qf6',
      'Nc3', 'Bc5', 'Nd5', 'Qxb2', 'Bd6', 'Bxg1', 'e5', 'Qxa1+', 'Ke2',
      'Na6', 'Nxg7+', 'Kd8', 'Qf6+', 'Nxf6', 'Be7#'
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'review'>('analysis');
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [history, setHistory] = useState<{ from: string; to: string; san: string }[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [orientation, setOrientation] = useState<'w' | 'b'>('w');

  // Engine evaluation
  const [scoreCp, setScoreCp] = useState<number>(0);
  const [bestMoveSan, setBestMoveSan] = useState<string>('');
  const [fenInput, setFenInput] = useState<string>('');
  const [reviewReport, setReviewReport] = useState<ReviewReport | null>(null);

  // Initialize safely on mount
  useEffect(() => {
    try {
      if (initialMoves && initialMoves.length > 0) {
        loadHistorySequence(initialMoves);
      } else {
        loadSanSequence(MASTERPIECE_GAMES[0].movesSan);
      }
    } catch (err) {
      console.warn('Initial analysis sequence load error:', err);
      resetToStart();
    }
  }, [initialMoves]);

  const resetToStart = () => {
    const fresh = new Chess();
    setGame(fresh);
    setHistory([]);
    setCurrentIdx(-1);
    setLastMove(null);
    setScoreCp(0);
    setBestMoveSan('');
    setReviewReport(null);
  };

  const loadSanSequence = (sanList: string[]) => {
    const replay = new Chess();
    const hist: { from: string; to: string; san: string }[] = [];

    for (const san of sanList) {
      try {
        const move = replay.move(san);
        if (move) {
          hist.push({ from: move.from, to: move.to, san: move.san });
        }
      } catch {
        break;
      }
    }

    setGame(replay);
    setHistory(hist);
    setCurrentIdx(hist.length - 1);
    if (hist.length > 0) {
      setLastMove({ from: hist[hist.length - 1].from, to: hist[hist.length - 1].to });
    }

    const evalRes = stockfishEngine.evaluatePosition(replay.fen(), 1);
    setScoreCp(evalRes.cp);
    setBestMoveSan(evalRes.bestMoveSan);

    const report = stockfishEngine.analyzeGame(hist);
    setReviewReport(report);
  };

  const loadHistorySequence = (hist: { from: string; to: string; san: string }[]) => {
    const replay = new Chess();
    const verified: { from: string; to: string; san: string }[] = [];

    for (const h of hist) {
      try {
        const move = replay.move({ from: h.from, to: h.to, promotion: 'q' });
        if (move) {
          verified.push({ from: move.from, to: move.to, san: move.san });
        }
      } catch {
        break;
      }
    }

    setGame(replay);
    setHistory(verified);
    setCurrentIdx(verified.length - 1);
    if (verified.length > 0) {
      setLastMove({ from: verified[verified.length - 1].from, to: verified[verified.length - 1].to });
    }

    const evalRes = stockfishEngine.evaluatePosition(replay.fen(), 1);
    setScoreCp(evalRes.cp);
    setBestMoveSan(evalRes.bestMoveSan);

    const report = stockfishEngine.analyzeGame(verified);
    setReviewReport(report);
  };

  const handleSelectMove = (index: number) => {
    if (index < 0) {
      const start = new Chess();
      setGame(start);
      setCurrentIdx(-1);
      setLastMove(null);
      const ev = stockfishEngine.evaluatePosition(start.fen(), 1);
      setScoreCp(ev.cp);
      setBestMoveSan(ev.bestMoveSan);
      return;
    }

    const replay = new Chess();
    for (let i = 0; i <= index && i < history.length; i++) {
      try {
        replay.move({ from: history[i].from, to: history[i].to, promotion: 'q' });
      } catch {
        break;
      }
    }

    setGame(replay);
    setCurrentIdx(index);
    setLastMove({ from: history[index].from, to: history[index].to });

    const ev = stockfishEngine.evaluatePosition(replay.fen(), 1);
    setScoreCp(ev.cp);
    setBestMoveSan(ev.bestMoveSan);
  };

  const handleBoardMove = (moveEv: MoveEvent) => {
    try {
      const nextGame = new Chess(game.fen());
      const move = nextGame.move({
        from: moveEv.from,
        to: moveEv.to,
        promotion: moveEv.promotion || 'q',
      });

      if (move) {
        setGame(nextGame);
        const updated = [
          ...history.slice(0, currentIdx + 1),
          { from: move.from, to: move.to, san: move.san },
        ];
        setHistory(updated);
        setCurrentIdx(updated.length - 1);
        setLastMove({ from: move.from, to: move.to });

        const ev = stockfishEngine.evaluatePosition(nextGame.fen(), 1);
        setScoreCp(ev.cp);
        setBestMoveSan(ev.bestMoveSan);

        const report = stockfishEngine.analyzeGame(updated);
        setReviewReport(report);
      }
    } catch (err) {
      console.warn('Move ignored in analysis:', err);
    }
  };

  const handleLoadFen = () => {
    if (!fenInput.trim()) return;
    try {
      const loaded = new Chess(fenInput.trim());
      setGame(loaded);
      setHistory([]);
      setCurrentIdx(-1);
      setLastMove(null);

      const ev = stockfishEngine.evaluatePosition(loaded.fen(), 1);
      setScoreCp(ev.cp);
      setBestMoveSan(ev.bestMoveSan);
      setReviewReport(null);
    } catch {
      alert('Invalid FEN format.');
    }
  };

  const currentEvalMove: EvaluatedMove | undefined =
    reviewReport && currentIdx >= 0 && currentIdx < reviewReport.moves.length
      ? reviewReport.moves[currentIdx]
      : undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start max-w-7xl mx-auto p-3 sm:p-4 w-full select-none animate-fade-in">
      {/* Board & Eval Bar Column */}
      <div className="w-full lg:w-[560px] shrink-0 flex flex-col items-center">
        {/* Engine top bar */}
        <div className="w-full bg-[#262522] px-3.5 py-2 rounded-lg border border-[#363431] flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#81b64c] animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={14} className="text-[#81b64c]" />
              Stockfish Engine
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-chess-dim font-mono">Depth 14</span>
            {bestMoveSan && (
              <span className="bg-[#312e2b] px-2 py-0.5 rounded border border-[#403d39] font-mono text-[#81b64c] font-bold">
                {bestMoveSan}
              </span>
            )}
          </div>
        </div>

        {/* Board & Side Eval Bar */}
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
        <div className="w-full flex gap-2 mt-2.5">
          <input
            type="text"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            placeholder="Paste FEN string here..."
            className="flex-1 bg-[#262522] border border-[#363431] rounded-lg px-3 py-1.5 text-xs text-white placeholder-chess-dim outline-none font-mono"
          />
          <button
            onClick={handleLoadFen}
            className="py-1.5 px-3 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-xs font-semibold rounded-lg border border-[#403d39] transition-colors"
          >
            Load
          </button>
        </div>
      </div>

      {/* Control Panel Column: Tabs for Analysis & Review */}
      <div className="flex-1 w-full flex flex-col h-[560px] space-y-3">
        {/* Tab Headers */}
        <div className="flex bg-[#262522] p-1 rounded-lg border border-[#363431]">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'analysis'
                ? 'bg-[#312e2b] text-white shadow'
                : 'text-chess-muted hover:text-white'
            }`}
          >
            <BarChart2 size={15} />
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'review'
                ? 'bg-[#81b64c] text-white shadow'
                : 'text-chess-muted hover:text-white'
            }`}
          >
            <Sparkles size={15} />
            Game Review
          </button>
        </div>

        {/* Masterpieces Quick Picker */}
        <div className="bg-[#262522] p-2.5 rounded-lg border border-[#363431] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-chess-dim block">
            Historic Masterpieces
          </span>
          <div className="flex gap-2">
            {MASTERPIECE_GAMES.map((mg, idx) => (
              <button
                key={idx}
                onClick={() => loadSanSequence(mg.movesSan)}
                className="flex-1 py-1 px-2 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-[11px] font-medium rounded border border-[#403d39] truncate text-left transition-colors"
                title={mg.name}
              >
                {mg.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Analysis Content */}
        {activeTab === 'analysis' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2">
            {/* Live Engine Eval Card */}
            <div className="bg-[#262522] p-3 rounded-lg border border-[#363431] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-chess-dim block">
                  Evaluation
                </span>
                <span className="text-xl font-black font-mono text-white">
                  {scoreCp > 0 ? `+${(scoreCp / 100).toFixed(1)}` : (scoreCp / 100).toFixed(1)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-chess-dim block">
                  Recommended Move
                </span>
                <span className="text-sm font-mono font-bold text-[#81b64c]">
                  {bestMoveSan || 'Evaluating...'}
                </span>
              </div>
            </div>

            {/* Move List */}
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
        )}

        {/* Tab 2: Free Game Review Content */}
        {activeTab === 'review' && reviewReport && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 bg-[#262522] p-3 rounded-lg border border-[#363431]">
            {/* Accuracy comparison cards */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#312e2b] p-2.5 rounded-lg border border-[#403d39]">
                <span className="text-[10px] font-bold text-chess-dim uppercase block">
                  White Accuracy
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  {reviewReport.whiteAccuracy}%
                </span>
              </div>
              <div className="bg-[#312e2b] p-2.5 rounded-lg border border-[#403d39]">
                <span className="text-[10px] font-bold text-chess-dim uppercase block">
                  Black Accuracy
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  {reviewReport.blackAccuracy}%
                </span>
              </div>
            </div>

            {/* AI Coach verdict bubble */}
            <div className="bg-[#312e2b] p-3 rounded-lg border border-[#403d39] flex items-start gap-2.5">
              <span className="text-xl">🤖</span>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase text-[#81b64c] tracking-wider block">
                  AI Coach
                </span>
                <p className="text-xs text-chess-muted leading-relaxed">
                  {currentEvalMove
                    ? currentEvalMove.explanation
                    : reviewReport.summary.coachVerdict}
                </p>
              </div>
            </div>

            {/* Move List in Review */}
            <div className="h-44 min-h-0">
              <MoveList
                history={history}
                currentMoveIndex={currentIdx}
                evaluatedMoves={reviewReport.moves}
                onSelectMove={handleSelectMove}
                onFlipBoard={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
