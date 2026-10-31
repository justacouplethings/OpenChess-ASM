import React, { useState, useEffect } from 'react';
import { Search, X, Bot, BookOpen, Trophy, Zap, Palette, ArrowRight } from 'lucide-react';
import { CHESS_BOTS } from '../../data/bots';
import { OPENINGS_DATABASE } from '../../data/openings';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'play' | 'bots' | 'puzzles' | 'openings' | 'profile' | 'settings', payload?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search items
  const matchedBots = CHESS_BOTS.filter(
    (b) => b.name.toLowerCase().includes(q) || b.elo.toString().includes(q)
  );

  const matchedOpenings = OPENINGS_DATABASE.filter(
    (o) => o.name.toLowerCase().includes(q) || o.eco.toLowerCase().includes(q)
  );

  const gameModes = [
    { id: 'play', title: 'Play Peer-to-Peer / Solo', desc: 'Real-time chess with custom clocks', icon: Trophy },
    { id: 'bots', title: 'Play AI Bots', desc: 'Challenge 400 to 2850 ELO personality bots', icon: Bot },
    { id: 'puzzles', title: 'Tactical Puzzles & Puzzle Rush', desc: 'Unlimited tactical puzzle solver', icon: Zap },
    { id: 'openings', title: 'Openings Explorer', desc: 'Browse grandmaster opening databases', icon: BookOpen },
    { id: 'settings', title: 'Board Themes & Piece Styles', desc: 'Customize piece sets and board colors', icon: Palette },
  ].filter((m) => m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-xl bg-[#262522] border border-[#363431] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#363431] bg-[#21201d]">
          <Search size={18} className="text-chess-dim mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bots, openings, game modes, themes... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-white placeholder-chess-dim outline-none"
          />
          <button onClick={onClose} className="text-chess-dim hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Game Modes */}
          {gameModes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-chess-dim px-2 block mb-1">
                Navigation & Modes
              </span>
              <div className="space-y-1">
                {gameModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onNavigate(mode.id as any);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#312e2b] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#312e2b] flex items-center justify-center text-chess-green group-hover:bg-chess-green group-hover:text-white transition-colors">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            {mode.title}
                          </span>
                          <span className="text-chess-dim block text-[11px]">
                            {mode.desc}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-chess-dim group-hover:text-white" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bots */}
          {matchedBots.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-chess-dim px-2 block mb-1">
                AI Bots ({matchedBots.length})
              </span>
              <div className="space-y-1">
                {matchedBots.slice(0, 4).map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => {
                      onNavigate('bots', bot);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#312e2b] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-lg"
                        style={{ backgroundColor: bot.avatarBg }}
                      >
                        {bot.avatar}
                      </div>
                      <div>
                        <span className="font-bold text-white">{bot.name}</span>
                        <span className="text-chess-dim ml-2 font-mono">
                          ({bot.elo} ELO)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-chess-green font-medium">
                      Challenge
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Openings */}
          {matchedOpenings.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-chess-dim px-2 block mb-1">
                Opening Explorer ({matchedOpenings.length})
              </span>
              <div className="space-y-1">
                {matchedOpenings.slice(0, 4).map((op) => (
                  <button
                    key={op.id}
                    onClick={() => {
                      onNavigate('openings', op);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#312e2b] transition-colors text-left"
                  >
                    <div>
                      <span className="font-mono font-bold text-chess-green mr-2">
                        {op.eco}
                      </span>
                      <span className="font-bold text-white">{op.name}</span>
                    </div>
                    <span className="text-chess-dim font-mono text-[11px]">
                      {op.moves}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
