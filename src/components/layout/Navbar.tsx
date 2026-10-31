import React from 'react';
import {
  Gamepad2,
  Trophy,
  Zap,
  BookOpen,
  Bot,
  Settings,
  Search,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { UserProfile } from '../../utils/storage';

export type ActiveTab = 'play' | 'bots' | 'puzzles' | 'openings' | 'review';

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
  const navItems: { id: ActiveTab; label: string; icon: React.FC<any> }[] = [
    { id: 'play', label: 'Play', icon: Gamepad2 },
    { id: 'puzzles', label: 'Puzzles', icon: Zap },
    { id: 'bots', label: 'AI Bots', icon: Bot },
    { id: 'review', label: 'Analysis', icon: BarChart2 },
    { id: 'openings', label: 'Openings', icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-[#262522] border-r border-[#363431] h-screen select-none shrink-0 justify-between p-3">
        <div className="space-y-4">
          {/* Brand Logo matching Chess.com layout */}
          <div
            onClick={() => onSelectTab('play')}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-chess-green flex items-center justify-center text-white shadow-md shadow-chess-green/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 45 45" className="w-6 h-6 fill-white stroke-black stroke-[1.5]">
                <path d="M22.5 9c-2.2 0-4 1.8-4 4 0 1.2.5 2.2 1.4 3-1.6 1-3.4 3.2-3.4 6 0 1.6.6 3 1.5 4h9c.9-1 1.5-2.4 1.5-4 0-2.8-1.8-5-3.4-6 .9-.8 1.4-1.8 1.4-3 0-2.2-1.8-4-4-4z" />
                <path d="M12 36c0-3.5 3-6 7-7h7c4 1 7 3.5 7 7v2H12v-2z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block group-hover:text-chess-green transition-colors">
                openchess<span className="text-chess-green">.com</span>
              </span>
              <span className="text-[10px] text-chess-dim font-bold uppercase tracking-wider block -mt-0.5">
                100% Unlocked
              </span>
            </div>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#21201d] hover:bg-[#312e2b] rounded-lg border border-[#363431] text-xs text-chess-dim transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="group-hover:text-white" />
              <span className="group-hover:text-white">Search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#312e2b] text-[10px] font-mono border border-[#403d39] text-chess-dim">
              Ctrl+K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#312e2b] text-white border-l-4 border-chess-green shadow-sm'
                      : 'text-chess-muted hover:text-white hover:bg-[#2e2c28]'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-chess-green' : 'text-chess-dim'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & User Profile */}
        <div className="space-y-2 pt-3 border-t border-[#363431]">
          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-chess-dim hover:text-white hover:bg-[#2e2c28] transition-colors"
          >
            <Settings size={18} />
            <span>Theme & Settings</span>
          </button>

          {/* User profile widget */}
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#21201d] hover:bg-[#2b2a26] border border-[#363431] transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-chess-green/20 border border-chess-green flex items-center justify-center text-lg shrink-0">
              {userProfile.avatar}
            </div>
            <div className="overflow-hidden flex-1">
              <span className="text-xs font-bold text-white block truncate group-hover:text-chess-green transition-colors">
                {userProfile.username}
              </span>
              <span className="text-[10px] text-chess-dim font-mono block">
                Blitz: {userProfile.eloBlitz}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[#262522] border-b border-[#363431] select-none">
        <div className="flex items-center gap-2" onClick={() => onSelectTab('play')}>
          <div className="w-7 h-7 rounded bg-chess-green flex items-center justify-center text-white">
            ♟️
          </div>
          <span className="text-sm font-black text-white">
            openchess<span className="text-chess-green">.com</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-1.5 rounded-lg bg-[#312e2b] text-chess-dim hover:text-white"
          >
            <Search size={16} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-[#312e2b] text-chess-dim hover:text-white"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onOpenProfile}
            className="w-7 h-7 rounded-full bg-[#312e2b] border border-[#403d39] flex items-center justify-center text-sm"
          >
            {userProfile.avatar}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#262522] border-t border-[#363431] flex items-center justify-around py-1.5 px-2 select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
                isActive ? 'text-chess-green' : 'text-chess-dim'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
