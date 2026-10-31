import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { BookOpen, BarChart3, ChevronRight, Play } from 'lucide-react';
import { OPENINGS_DATABASE, OpeningData } from '../../data/openings';
import { ChessBoard } from '../board/ChessBoard';
import { BoardTheme } from '../../utils/storage';
import { PieceStyle } from '../pieces/PieceSet';

interface OpeningExplorerViewProps {
  theme: BoardTheme;
  pieceStyle: PieceStyle;
  onPlayOpening?: (opening: OpeningData) => void;
}

export const OpeningExplorerView: React.FC<OpeningExplorerViewProps> = ({
  theme,
  pieceStyle,
  onPlayOpening,
}) => {
  const [selectedOpening, setSelectedOpening] = useState<OpeningData>(OPENINGS_DATABASE[0]);
  const [boardGame, setBoardGame] = useState<Chess>(() => new Chess(OPENINGS_DATABASE[0].fen));

  const handleSelectOpening = (opening: OpeningData) => {
    setSelectedOpening(opening);
    setBoardGame(new Chess(opening.fen));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-6 w-full animate-fade-in select-none">
      {/* Board Column */}
      <div className="w-full lg:w-[500px] shrink-0 space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <span className="text-xs font-mono font-bold text-chess-green mr-2">
              {selectedOpening.eco}
            </span>
            <span className="text-sm font-bold text-white">
              {selectedOpening.name}
            </span>
          </div>
          <span className="text-xs text-chess-dim font-mono">
            {selectedOpening.moves}
          </span>
        </div>

        <ChessBoard
          game={boardGame}
          orientation="w"
          theme={theme}
          pieceStyle={pieceStyle}
          interactive={false}
        />

        {onPlayOpening && (
          <button
            onClick={() => onPlayOpening(selectedOpening)}
            className="w-full py-2.5 bg-chess-green hover:bg-chess-greenHover text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
          >
            <Play size={14} />
            Practice this Opening Against Bot
          </button>
        )}
      </div>

      {/* Opening Details & Roster Column */}
      <div className="flex-1 space-y-4">
        {/* Statistics Bar */}
        <div className="bg-[#262522] p-4 rounded-xl border border-[#363431] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-chess-green" />
              Master Database Win Rates
            </h3>
            <span className="text-xs text-chess-dim">Over 2,000,000 games</span>
          </div>

          {/* Tri-color win rate bar */}
          <div className="w-full h-4 rounded-md overflow-hidden flex text-[10px] font-bold">
            <div
              className="bg-white text-black flex items-center justify-center transition-all"
              style={{ width: `${selectedOpening.stats.whiteWin}%` }}
              title={`White win: ${selectedOpening.stats.whiteWin}%`}
            >
              {selectedOpening.stats.whiteWin}%
            </div>
            <div
              className="bg-neutral-500 text-white flex items-center justify-center transition-all"
              style={{ width: `${selectedOpening.stats.draw}%` }}
              title={`Draw: ${selectedOpening.stats.draw}%`}
            >
              {selectedOpening.stats.draw}%
            </div>
            <div
              className="bg-neutral-900 text-white flex items-center justify-center transition-all"
              style={{ width: `${selectedOpening.stats.blackWin}%` }}
              title={`Black win: ${selectedOpening.stats.blackWin}%`}
            >
              {selectedOpening.stats.blackWin}%
            </div>
          </div>

          <p className="text-xs text-chess-muted leading-relaxed pt-1">
            {selectedOpening.description}
          </p>

          {/* Top continuations */}
          <div className="space-y-1.5 pt-2 border-t border-[#363431]">
            <span className="text-[10px] text-chess-dim uppercase tracking-wider font-bold block">
              Top Engine & Grandmaster Continuations
            </span>
            <div className="space-y-1">
              {selectedOpening.topMoves.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-[#312e2b] text-xs hover:bg-[#3d3a36] transition-colors"
                >
                  <span className="font-bold font-mono text-white">{m.san}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-chess-dim font-mono">{m.games}</span>
                    <div className="w-24 h-2.5 rounded overflow-hidden flex">
                      <div className="bg-white" style={{ width: `${m.whitePct}%` }} />
                      <div className="bg-neutral-500" style={{ width: `${m.drawPct}%` }} />
                      <div className="bg-neutral-900" style={{ width: `${m.blackPct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Openings Catalog List */}
        <div className="bg-[#262522] rounded-xl border border-[#363431] overflow-hidden">
          <div className="p-3 border-b border-[#363431] bg-[#21201d] flex items-center gap-2">
            <BookOpen size={16} className="text-chess-green" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Openings Library
            </h4>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-[#363431]">
            {OPENINGS_DATABASE.map((op) => (
              <button
                key={op.id}
                onClick={() => handleSelectOpening(op)}
                className={`w-full p-3 flex items-center justify-between text-left transition-colors ${
                  selectedOpening.id === op.id ? 'bg-[#312e2b]' : 'hover:bg-[#2c2a27]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-chess-green">
                      {op.eco}
                    </span>
                    <span className="text-xs font-bold text-white">{op.name}</span>
                  </div>
                  <span className="text-[11px] text-chess-dim font-mono block mt-0.5">
                    {op.moves}
                  </span>
                </div>
                <ChevronRight size={16} className="text-chess-dim" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
