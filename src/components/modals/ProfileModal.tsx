import React from 'react';
import { X, Trophy, Swords, Zap, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { UserProfile, MatchHistoryItem } from '../../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onReviewMatch: (match: MatchHistoryItem) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onReviewMatch,
}) => {
  if (!isOpen) return null;

  const winRate =
    profile.gamesPlayed > 0
      ? Math.round((profile.wins / profile.gamesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-xl bg-[#262522] border border-[#363431] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#21201d] via-[#2a2824] to-[#1e1d1a] border-b border-[#363431]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-chess-dim hover:text-white p-1"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-chess-green/20 border-2 border-chess-green flex items-center justify-center text-3xl shadow-lg">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {profile.username}
                </h2>
                <span className="px-2 py-0.5 rounded bg-chess-green text-white text-[10px] font-black uppercase tracking-wider">
                  Unlocked Free
                </span>
              </div>
              <p className="text-xs text-chess-dim mt-0.5">
                Member of openchess.com • Paywall-Free Chess Experience
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Rating Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <RatingCard label="Blitz" elo={profile.eloBlitz} icon="⚡" />
            <RatingCard label="Rapid" elo={profile.eloRapid} icon="⏱️" />
            <RatingCard label="Bullet" elo={profile.eloBullet} icon="🚀" />
            <RatingCard label="Puzzles" elo={profile.eloPuzzles} icon="🧩" />
          </div>

          {/* Record & Stats */}
          <div className="bg-[#21201d] p-4 rounded-xl border border-[#363431] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Lifetime Record
              </span>
              <span className="text-chess-green font-mono font-bold text-xs">
                {winRate}% Win Rate
              </span>
            </div>

            <div className="grid grid-cols-4 text-center divide-x divide-[#363431] py-1">
              <div>
                <span className="text-chess-dim block text-[10px] uppercase">Games</span>
                <span className="text-base font-bold text-white font-mono">
                  {profile.gamesPlayed}
                </span>
              </div>
              <div>
                <span className="text-green-400 block text-[10px] uppercase">Won</span>
                <span className="text-base font-bold text-white font-mono">
                  {profile.wins}
                </span>
              </div>
              <div>
                <span className="text-red-400 block text-[10px] uppercase">Lost</span>
                <span className="text-base font-bold text-white font-mono">
                  {profile.losses}
                </span>
              </div>
              <div>
                <span className="text-chess-dim block text-[10px] uppercase">Drawn</span>
                <span className="text-base font-bold text-white font-mono">
                  {profile.draws}
                </span>
              </div>
            </div>
          </div>

          {/* Match History */}
          <div className="space-y-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              Match History & Free Reviews
            </span>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {profile.history.length === 0 ? (
                <div className="text-center py-6 text-chess-dim italic bg-[#21201d] rounded-lg border border-[#363431]">
                  No recorded matches yet. Play your first match!
                </div>
              ) : (
                profile.history.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#21201d] hover:bg-[#282723] rounded-lg border border-[#363431] flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs ${
                          m.result === 'win'
                            ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                            : m.result === 'loss'
                            ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                            : 'bg-neutral-600/20 text-neutral-300 border border-neutral-500/40'
                        }`}
                      >
                        {m.result === 'win' ? 'W' : m.result === 'loss' ? 'L' : 'D'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.opponent}</span>
                          <span className="text-chess-dim font-mono text-[11px]">
                            ({m.opponentElo})
                          </span>
                        </div>
                        <span className="text-[10px] text-chess-dim block mt-0.5">
                          {m.date} • {m.timeControl} • {m.movesCount} moves • {m.accuracy}% Acc
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onReviewMatch(m);
                        onClose();
                      }}
                      className="py-1 px-2.5 bg-chess-green/20 hover:bg-chess-green text-chess-green hover:text-white font-bold text-[11px] rounded transition-all flex items-center gap-1 border border-chess-green/40 hover:border-chess-green"
                    >
                      <Sparkles size={12} />
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function RatingCard({ label, elo, icon }: { label: string; elo: number; icon: string }) {
  return (
    <div className="bg-[#21201d] p-3 rounded-xl border border-[#363431] flex flex-col items-center">
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] font-bold uppercase text-chess-dim mt-1">
        {label}
      </span>
      <span className="text-base font-black text-white font-mono mt-0.5">
        {elo}
      </span>
    </div>
  );
}
