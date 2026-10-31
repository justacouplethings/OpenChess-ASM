import React, { useState } from 'react';
import { CHESS_BOTS, ChessBot } from '../../data/bots';
import { Bot, Swords, Sparkles, Filter } from 'lucide-react';

interface BotsViewProps {
  onSelectBot: (bot: ChessBot) => void;
}

export const BotsView: React.FC<BotsViewProps> = ({ onSelectBot }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Master'];

  const filteredBots = CHESS_BOTS.filter((bot) => {
    const matchesCategory = selectedCategory === 'All' || bot.category === selectedCategory;
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.opening.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.elo.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 w-full animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#363431]">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="text-chess-green" size={26} />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Play with AI Bots
            </h1>
          </div>
          <p className="text-xs text-chess-muted mt-1">
            Choose from an authentic array of personality bots ranging from friendly 400 ELO beginners to 2850 Grandmasters.
          </p>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bot by name or ELO..."
          className="bg-[#262522] border border-[#363431] focus:border-chess-green text-xs text-white rounded-lg px-3 py-2 outline-none w-full sm:w-64"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-chess-green text-white shadow'
                : 'bg-[#262522] text-chess-muted hover:text-white border border-[#363431]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBots.map((bot) => (
          <div
            key={bot.id}
            className="bg-[#262522] hover:bg-[#2d2b27] border border-[#363431] hover:border-[#4d4a46] rounded-xl p-4 flex flex-col justify-between transition-all group hover:-translate-y-0.5 shadow-lg"
          >
            <div>
              {/* Bot Avatar & Badges */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-white/10"
                  style={{ backgroundColor: bot.avatarBg }}
                >
                  {bot.avatar}
                </div>
                <div className="text-right">
                  {bot.title && (
                    <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded mr-1">
                      {bot.title}
                    </span>
                  )}
                  <span className="text-sm font-mono font-bold text-chess-green">
                    {bot.elo} ELO
                  </span>
                </div>
              </div>

              {/* Bot Info */}
              <h3 className="text-base font-bold text-white group-hover:text-chess-green transition-colors">
                {bot.name}
              </h3>
              <p className="text-xs text-chess-dim italic my-1">
                "{bot.quote}"
              </p>
              <p className="text-xs text-chess-muted leading-relaxed line-clamp-2 mt-2">
                {bot.bio}
              </p>

              <div className="mt-3 pt-3 border-t border-[#363431]/60">
                <span className="text-[10px] text-chess-dim uppercase tracking-wider block">
                  Favorite Opening
                </span>
                <span className="text-xs text-chess-muted font-medium truncate block">
                  {bot.opening}
                </span>
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => onSelectBot(bot)}
              className="mt-4 w-full py-2 bg-chess-green hover:bg-chess-greenHover text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-chess-green/15"
            >
              <Swords size={14} />
              Challenge {bot.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
