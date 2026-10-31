import React from 'react';
import { Sparkles, Trophy, AlertTriangle, X, Check, BookOpen } from 'lucide-react';
import { ReviewReport, EvaluatedMove } from '../../services/stockfish/evaluator';

interface GameReviewModalProps {
  report: ReviewReport;
  currentMoveIndex: number;
  onSelectMove: (idx: number) => void;
  onClose: () => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  report,
  currentMoveIndex,
  onSelectMove,
  onClose,
}) => {
  const currentMove: EvaluatedMove | undefined =
    currentMoveIndex >= 0 && currentMoveIndex < report.moves.length
      ? report.moves[currentMoveIndex]
      : report.moves[report.moves.length - 1];

  // Prepare graph points
  const graphWidth = 320;
  const graphHeight = 80;
  const moves = report.moves;

  const points = moves.map((m, idx) => {
    const x = moves.length > 1 ? (idx / (moves.length - 1)) * graphWidth : graphWidth / 2;
    // Map -1000 to +1000 centipawns to 0 to graphHeight
    const clamped = Math.max(-800, Math.min(800, m.centipawnsAfter));
    // 0 cp = graphHeight / 2
    const y = graphHeight / 2 - (clamped / 800) * (graphHeight / 2 - 6);
    return { x, y, idx, cp: m.centipawnsAfter };
  });

  const pathD =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
      : '';

  return (
    <div className="flex flex-col h-full bg-[#262522] rounded-lg border border-[#363431] overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#363431] bg-[#21201d]">
        <div className="flex items-center gap-2">
          <Sparkles className="text-chess-green" size={20} />
          <h2 className="text-base font-bold text-white tracking-tight">
            100% Free Game Review & Coach
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-chess-dim hover:text-white transition-colors p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Accuracy Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#312e2b] p-3 rounded-lg border border-[#403d39] flex flex-col items-center">
            <span className="text-xs text-chess-muted font-semibold uppercase tracking-wider">
              White Accuracy
            </span>
            <span className="text-2xl font-black text-white mt-1">
              {report.whiteAccuracy}%
            </span>
            <div className="w-full bg-[#21201d] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-chess-green h-full rounded-full transition-all duration-500"
                style={{ width: `${report.whiteAccuracy}%` }}
              />
            </div>
          </div>

          <div className="bg-[#312e2b] p-3 rounded-lg border border-[#403d39] flex flex-col items-center">
            <span className="text-xs text-chess-muted font-semibold uppercase tracking-wider">
              Black Accuracy
            </span>
            <span className="text-2xl font-black text-white mt-1">
              {report.blackAccuracy}%
            </span>
            <div className="w-full bg-[#21201d] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-chess-green h-full rounded-full transition-all duration-500"
                style={{ width: `${report.blackAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Evaluation Graph */}
        <div className="bg-[#1b1917] p-3 rounded-lg border border-[#363431]">
          <div className="flex items-center justify-between text-xs text-chess-dim mb-2 font-medium">
            <span>Advantage Graph</span>
            <span>0.0 Neutral Axis</span>
          </div>

          <div className="relative w-full overflow-hidden flex items-center justify-center">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="w-full h-24 overflow-visible"
            >
              {/* Zero baseline */}
              <line
                x1="0"
                y1={graphHeight / 2}
                x2={graphWidth}
                y2={graphHeight / 2}
                stroke="#403d39"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Eval curve */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#81b64c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Clickable points */}
              {points.map((p) => (
                <circle
                  key={p.idx}
                  cx={p.x}
                  cy={p.y}
                  r={currentMoveIndex === p.idx ? 5 : 2.5}
                  className={`cursor-pointer transition-all ${
                    currentMoveIndex === p.idx
                      ? 'fill-white stroke-2 stroke-chess-green'
                      : 'fill-[#81b64c] hover:scale-150'
                  }`}
                  onClick={() => onSelectMove(p.idx)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* AI Coach Card */}
        {currentMove && (
          <div className="bg-[#312e2b] p-3.5 rounded-lg border border-[#403d39] flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-chess-green/20 border border-chess-green flex items-center justify-center text-xl shrink-0">
              🤖
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-chess-green">
                  AI Coach
                </span>
                <span className="text-xs text-chess-dim font-mono">
                  Move {currentMove.moveNumber}: {currentMove.san}
                </span>
              </div>
              <p className="text-xs text-chess-muted leading-relaxed">
                {currentMove.explanation}
              </p>
              {currentMove.bestMoveSan && currentMove.bestMoveSan !== currentMove.san && (
                <p className="text-xs text-chess-accent font-medium mt-1">
                  Engine recommended: <span className="font-bold underline">{currentMove.bestMoveSan}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Move Classification Breakdown Table */}
        <div className="space-y-1.5 text-xs">
          <div className="text-xs font-bold text-chess-muted uppercase tracking-wider pb-1 border-b border-[#363431]">
            Move Breakdown
          </div>

          <div className="space-y-1 pt-1">
            <ClassificationRow
              title="Brilliant (!!)"
              color="#1baca6"
              badge="!!"
              whiteCount={report.counts.white.brilliant}
              blackCount={report.counts.black.brilliant}
            />
            <ClassificationRow
              title="Great (!)"
              color="#5c8bb0"
              badge="!"
              whiteCount={report.counts.white.great}
              blackCount={report.counts.black.great}
            />
            <ClassificationRow
              title="Best"
              color="#81b64c"
              badge="★"
              whiteCount={report.counts.white.best}
              blackCount={report.counts.black.best}
            />
            <ClassificationRow
              title="Excellent"
              color="#96bc4b"
              badge="✓"
              whiteCount={report.counts.white.excellent}
              blackCount={report.counts.black.excellent}
            />
            <ClassificationRow
              title="Book"
              color="#a88865"
              badge="📖"
              whiteCount={report.counts.white.book}
              blackCount={report.counts.black.book}
            />
            <ClassificationRow
              title="Inaccuracy (?!)"
              color="#e69e2c"
              badge="?!"
              whiteCount={report.counts.white.inaccuracy}
              blackCount={report.counts.black.inaccuracy}
            />
            <ClassificationRow
              title="Mistake (?)"
              color="#e67f22"
              badge="?"
              whiteCount={report.counts.white.mistake}
              blackCount={report.counts.black.mistake}
            />
            <ClassificationRow
              title="Blunder (??)"
              color="#fa412d"
              badge="??"
              whiteCount={report.counts.white.blunder}
              blackCount={report.counts.black.blunder}
            />
            <ClassificationRow
              title="Miss"
              color="#d64040"
              badge="✕"
              whiteCount={report.counts.white.miss}
              blackCount={report.counts.black.miss}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function ClassificationRow({
  title,
  color,
  badge,
  whiteCount,
  blackCount,
}: {
  title: string;
  color: string;
  badge: string;
  whiteCount: number;
  blackCount: number;
}) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#312e2b] transition-colors">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-black"
          style={{ backgroundColor: color }}
        >
          {badge}
        </span>
        <span className="font-medium text-chess-muted">{title}</span>
      </div>
      <div className="flex items-center gap-6 font-mono font-semibold">
        <span className="w-4 text-right text-white">{whiteCount}</span>
        <span className="w-4 text-right text-chess-dim">{blackCount}</span>
      </div>
    </div>
  );
}
