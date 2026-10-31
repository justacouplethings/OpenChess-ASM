import React from 'react';
import { Clock } from 'lucide-react';

interface ChessClockProps {
  timeMs: number;
  isActive: boolean;
  color: 'w' | 'b';
  playerName: string;
  playerAvatar: string;
  playerElo?: number;
}

export const ChessClock: React.FC<ChessClockProps> = ({
  timeMs,
  isActive,
  playerName,
  playerAvatar,
  playerElo,
}) => {
  const totalSeconds = Math.max(0, Math.floor(timeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((timeMs % 1000) / 100);

  const isLowTime = totalSeconds < 20;
  const isCriticalTime = totalSeconds < 10;

  // Formatting: e.g. "05:00" or "00:08.4"
  const formattedTime =
    isCriticalTime && timeMs > 0
      ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-[#262522] border border-[#363431]">
      {/* Player info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-[#312e2b] flex items-center justify-center text-lg border border-[#454340] shadow-sm">
          {playerAvatar}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white tracking-tight">
              {playerName}
            </span>
            {playerElo && (
              <span className="text-xs text-chess-dim font-medium">
                ({playerElo})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clock display */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-base font-bold transition-all ${
          isActive
            ? isCriticalTime
              ? 'bg-red-600/25 text-red-400 border border-red-500 animate-pulse'
              : isLowTime
              ? 'bg-amber-600/25 text-amber-300 border border-amber-500'
              : 'bg-[#ffffff] text-[#1b1917] shadow'
            : 'bg-[#1b1917] text-chess-muted border border-[#363431]'
        }`}
      >
        <Clock size={14} className={isActive ? 'animate-spin' : 'opacity-40'} />
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
