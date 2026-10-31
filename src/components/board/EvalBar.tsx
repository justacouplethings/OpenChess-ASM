import React from 'react';
import { calculateWinPercentage } from '../../services/stockfish/evaluator';

interface EvalBarProps {
  scoreCp: number; // centipawns (from White perspective)
  mate?: number;   // mate in N moves
  orientation?: 'w' | 'b';
  height?: number | string;
}

export const EvalBar: React.FC<EvalBarProps> = ({
  scoreCp,
  mate,
  orientation = 'w',
  height = '100%',
}) => {
  // Convert centipawns to percentage (0% = Black winning, 100% = White winning)
  let whitePercent: number;

  if (mate !== undefined) {
    whitePercent = mate > 0 ? 100 : 0;
  } else {
    // CAPS2 win probability gives exact visual height distribution
    whitePercent = calculateWinPercentage(scoreCp);
  }

  // If orientation is Black, flip visually
  const displayedWhiteHeight = orientation === 'w' ? whitePercent : 100 - whitePercent;

  // Formatted score label
  let scoreLabel = '';
  if (mate !== undefined) {
    scoreLabel = `M${Math.abs(mate)}`;
  } else {
    const pawns = Math.abs(scoreCp) / 100;
    const formatted = pawns >= 10 ? pawns.toFixed(0) : pawns.toFixed(1);
    scoreLabel = scoreCp > 0 ? `+${formatted}` : scoreCp < 0 ? `-${formatted}` : '0.0';
  }

  const isWhiteWinning = (mate !== undefined && mate > 0) || scoreCp >= 0;

  return (
    <div
      className="relative w-7 bg-[#21201d] rounded overflow-hidden flex flex-col select-none shadow-md border border-[#363431]"
      style={{ height }}
      title={`Engine Evaluation: ${scoreLabel}`}
    >
      {/* Black section (top if White orientation) */}
      <div
        className="w-full bg-[#1b1917] transition-all duration-300 ease-out flex items-start justify-center pt-1"
        style={{ height: `${100 - displayedWhiteHeight}%` }}
      >
        {!isWhiteWinning && (
          <span className="text-[10px] font-bold text-white tracking-tighter">
            {scoreLabel}
          </span>
        )}
      </div>

      {/* White section (bottom if White orientation) */}
      <div
        className="w-full bg-[#ffffff] transition-all duration-300 ease-out flex items-end justify-center pb-1"
        style={{ height: `${displayedWhiteHeight}%` }}
      >
        {isWhiteWinning && (
          <span className="text-[10px] font-bold text-black tracking-tighter">
            {scoreLabel}
          </span>
        )}
      </div>
    </div>
  );
};
