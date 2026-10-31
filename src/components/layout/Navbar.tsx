import React from 'react';
import {
  Gamepad2,
  Zap,
  GraduationCap,
  Target,
  Tv,
  Users,
  MoreHorizontal,
  Search,
  HelpCircle,
  Globe,
  Settings,
  BarChart2,
  Bot,
} from 'lucide-react';
import { UserProfile } from '../../utils/storage';

export type ActiveTab = 'home' | 'play' | 'bots' | 'puzzles' | 'openings' | 'review';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  userProfile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenSettings,
  onOpenProfile,
  userProfile,
}) => {
  return (
    <>
      {/* Desktop / Tablet Sidebar matching Chess.com exact layout */}
      <aside className="hidden md:flex flex-col w-40 lg:w-44 bg-[#262522] border-r border-[#363431] h-screen select-none shrink-0 justify-between py-3 px-2 z-30">
        <div className="space-y-4">
          {/* Logo matching Chess.com header */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center text-white shadow-md shadow-[#81b64c]/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 45 45" className="w-5 h-5 fill-white stroke-[#1e1c18] stroke-[1.5]">
                <path d="M22.5 9c-2.2 0-4 1.8-4 4 0 1.2.5 2.2 1.4 3-1.6 1-3.4 3.2-3.4 6 0 1.6.6 3 1.5 4h9c.9-1 1.5-2.4 1.5-4 0-2.8-1.8-5-3.4-6 .9-.8 1.4-1.8 1.4-3 0-2.2-1.8-4-4-4z" />
                <path d="M12 36c0-3.5 3-6 7-7h7c4 1 7 3.5 7 7v2H12v-2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white group-hover:text-[#81b64c] transition-colors leading-none">
                openchess<span className="text-[#81b64c]">.com</span>
              </span>
              <span className="text-[9px] font-bold text-chess-dim tracking-wider uppercase mt-0.5">
                100% Free
              </span>
            </div>
          </div>

          {/* Nav links matching Chess.com menu icons */}
          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('play')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'play'
                  ? 'bg-[#312e2b] text-white shadow-sm'
                  : 'text-chess-muted hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              <span className="text-base">♟️</span>
              <span>Play</span>
            </button>

            <button
              onClick={() => onSelectTab('puzzles')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'puzzles'
                  ? 'bg-[#312e2b] text-white shadow-sm'
                  : 'text-chess-muted hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              <span className="text-amber-500 font-black text-sm">🧩</span>
              <span>Puzzles</span>
            </button>

            <button
              onClick={() => onSelectTab('openings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'openings'
                  ? 'bg-[#312e2b] text-white shadow-sm'
                  : 'text-chess-muted hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              <span className="text-cyan-400 font-black text-sm">🎓</span>
              <span>Learn</span>
            </button>

            <button
              onClick={() => onSelectTab('review')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'review'
                  ? 'bg-[#312e2b] text-white shadow-sm'
                  : 'text-chess-muted hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              <span className="text-green-400 font-black text-sm">📊</span>
              <span>Analysis</span>
            </button>

            <button
              onClick={() => onSelectTab('bots')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bots'
                  ? 'bg-[#312e2b] text-white shadow-sm'
                  : 'text-chess-muted hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              <span className="text-indigo-400 font-black text-sm">🤖</span>
              <span>AI Bots</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-chess-muted hover:text-white hover:bg-[#312e2b] transition-all"
            >
              <span className="text-chess-dim font-black text-sm">•••</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom area matching screenshot: Search, Sign Up, Log In, Help, English */}
        <div className="space-y-2 pt-2 border-t border-[#363431]">
          {/* Search bar */}
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-chess-dim hover:text-white hover:bg-[#312e2b] transition-colors"
          >
            <Search size={14} />
            <span>Search</span>
          </button>

          {/* Sign Up green CTA button */}
          <button
            onClick={onOpenProfile}
            className="w-full py-2 bg-[#81b64c] hover:bg-[#a3d160] active:bg-[#6c9c3e] text-white text-xs font-bold rounded-lg shadow transition-colors text-center"
          >
            Sign Up
          </button>

          {/* Log In button */}
          <button
            onClick={onOpenProfile}
            className="w-full py-1.5 bg-[#363431] hover:bg-[#45423e] text-white text-xs font-semibold rounded-lg transition-colors text-center"
          >
            Log In
          </button>

          {/* Help & Support */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-3 py-1 text-[11px] text-chess-dim hover:text-white transition-colors"
          >
            <HelpCircle size={13} />
            <span>Help & Support</span>
          </button>

          {/* Language selector */}
          <div className="w-full flex items-center gap-2 px-3 py-1 text-[11px] text-chess-dim">
            <Globe size={13} />
            <span>English</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-[#262522] border-b border-[#363431] select-none sticky top-0 z-40">
        <div className="flex items-center gap-2" onClick={() => onSelectTab('home')}>
          <div className="w-7 h-7 rounded bg-[#81b64c] flex items-center justify-center text-white text-sm shadow">
            ♟️
          </div>
          <span className="text-sm font-black text-white">
            openchess<span className="text-[#81b64c]">.com</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-1.5 rounded bg-[#312e2b] text-chess-dim hover:text-white"
          >
            <Search size={15} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded bg-[#312e2b] text-chess-dim hover:text-white"
          >
            <Settings size={15} />
          </button>
          <button
            onClick={onOpenProfile}
            className="px-2.5 py-1 rounded bg-[#81b64c] text-white text-xs font-bold"
          >
            Account
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#262522] border-t border-[#363431] flex items-center justify-around py-1.5 px-1 select-none">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-[#81b64c]' : 'text-chess-dim'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => onSelectTab('play')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'play' ? 'text-[#81b64c]' : 'text-chess-dim'
          }`}
        >
          <span className="text-base">♟️</span>
          <span>Play</span>
        </button>
        <button
          onClick={() => onSelectTab('puzzles')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'puzzles' ? 'text-[#81b64c]' : 'text-chess-dim'
          }`}
        >
          <span className="text-base">🧩</span>
          <span>Puzzles</span>
        </button>
        <button
          onClick={() => onSelectTab('review')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'review' ? 'text-[#81b64c]' : 'text-chess-dim'
          }`}
        >
          <span className="text-base">📊</span>
          <span>Analysis</span>
        </button>
        <button
          onClick={() => onSelectTab('bots')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'bots' ? 'text-[#81b64c]' : 'text-chess-dim'
          }`}
        >
          <span className="text-base">🤖</span>
          <span>Bots</span>
        </button>
      </div>
    </>
  );
};
