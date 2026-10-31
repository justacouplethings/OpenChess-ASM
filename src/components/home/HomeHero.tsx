import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Swords, Bot, Zap, BarChart2, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { ChessBoard, MoveEvent } from '../board/ChessBoard';
import { UserProfile, BoardTheme } from '../../utils/storage';
import { PieceStyle } from '../pieces/PieceSet';

interface HomeHeroProps {
  onStartPlay: () => void;
  onPlayBots: () => void;
  onSolvePuzzles: () => void;
  onOpenAnalysis: () => void;
  onOpenLearn: () => void;
  userProfile: UserProfile;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartPlay,
  onPlayBots,
  onSolvePuzzles,
  onOpenAnalysis,
  onOpenLearn,
  userProfile,
}) => {
  // Replicate the exact position from the user's screenshot:
  // 1. e4 e5 2. Nf3
  const [heroGame, setHeroGame] = useState<Chess>(() => {
    const c = new Chess();
    c.move('e4');
    c.move('e5');
    c.move('Nf3');
    return c;
  });

  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>({
    from: 'g1',
    to: 'f3',
  });

  const handleHeroMove = (moveEv: MoveEvent) => {
    setLastMove({ from: moveEv.from, to: moveEv.to });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-12 select-none animate-fade-in">
      {/* Hero Section matching the user's uploaded screenshot */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left: Pixel-Perfect Board */}
        <div className="w-full max-w-[480px] lg:max-w-[500px] shrink-0">
          <ChessBoard
            game={heroGame}
            orientation="w"
            theme={userProfile.preferences.theme}
            pieceStyle={userProfile.preferences.pieceStyle}
            showCoords="inside"
            showLegalMoves={true}
            allowPremoves={false}
            interactive={true}
            lastMove={lastMove}
            onMove={handleHeroMove}
          />
        </div>

        {/* Right: Headline and Primary CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Play Chess Online
            <br />
            on the <span className="text-[#81b64c]">#1 Site!</span>
          </h1>

          <p className="text-sm sm:text-base text-chess-muted max-w-md font-medium">
            Join 250+ million players in the world’s largest chess community. 100% free with unlocked Stockfish reviews.
          </p>

          <button
            onClick={onStartPlay}
            className="w-full sm:w-auto px-10 py-4 bg-[#81b64c] hover:bg-[#a3d160] active:bg-[#6c9c3e] text-white text-lg font-black rounded-xl shadow-xl shadow-[#81b64c]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Swords size={22} />
            <span>Get Started</span>
          </button>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-chess-dim font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#81b64c]" />
              Zero Paywalls
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#81b64c] font-black text-sm">✓</span>
              Unlimited Deep Reviews
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#81b64c] font-black text-sm">✓</span>
              PeerJS WebRTC Multiplayer
            </span>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-2 gap-3 w-full pt-4">
            <button
              onClick={onPlayBots}
              className="p-3.5 bg-[#262522] hover:bg-[#312e2b] border border-[#363431] hover:border-[#4a4742] rounded-xl text-left transition-all group flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-[#81b64c] transition-colors">
                    Play AI Bots
                  </span>
                  <span className="text-[10px] text-chess-dim block">
                    400 to 2850 ELO
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-chess-dim group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={onSolvePuzzles}
              className="p-3.5 bg-[#262522] hover:bg-[#312e2b] border border-[#363431] hover:border-[#4a4742] rounded-xl text-left transition-all group flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                  🧩
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-[#81b64c] transition-colors">
                    Tactical Puzzles
                  </span>
                  <span className="text-[10px] text-chess-dim block">
                    Rated & Puzzle Rush
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-chess-dim group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={onOpenAnalysis}
              className="p-3.5 bg-[#262522] hover:bg-[#312e2b] border border-[#363431] hover:border-[#4a4742] rounded-xl text-left transition-all group flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-lg">
                  📊
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-[#81b64c] transition-colors">
                    Game Review
                  </span>
                  <span className="text-[10px] text-chess-dim block">
                    Stockfish AI Coach
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-chess-dim group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={onOpenLearn}
              className="p-3.5 bg-[#262522] hover:bg-[#312e2b] border border-[#363431] hover:border-[#4a4742] rounded-xl text-left transition-all group flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg">
                  🎓
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-[#81b64c] transition-colors">
                    Openings Library
                  </span>
                  <span className="text-[10px] text-chess-dim block">
                    ECO Master Database
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-chess-dim group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Section matching bottom of screenshot: Improve Your Game with Lessons */}
      <div className="pt-8 border-t border-[#363431] flex flex-col md:flex-row items-center justify-between gap-6 bg-[#262522]/40 p-6 rounded-2xl border">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Improve Your Game with Lessons
          </h2>
          <p className="text-xs text-chess-muted max-w-md">
            Learn with quick, fun lessons designed for players of all levels. Master pins, forks, discoveries, and endgame technique.
          </p>
        </div>

        <button
          onClick={onOpenLearn}
          className="px-6 py-2.5 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-xs font-bold rounded-lg border border-[#45423e] transition-colors flex items-center gap-2"
        >
          <span>Explore Openings & Tactics</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
