import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { HomeHero } from './components/home/HomeHero';
import { PlayView } from './components/play/PlayView';
import { BotsView } from './components/bots/BotsView';
import { PuzzlesView } from './components/puzzles/PuzzlesView';
import { OpeningExplorerView } from './components/learn/OpeningExplorerView';
import { AnalysisView } from './components/review/AnalysisView';
import { SearchModal } from './components/modals/SearchModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import {
  UserProfile,
  UserPreferences,
  loadUserProfile,
  saveUserProfile,
  MatchHistoryItem,
} from './utils/storage';
import { sound } from './utils/audio';
import { ChessBot } from './data/bots';
import { OpeningData } from './data/openings';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Overrides for cross-navigation
  const [selectedBotOverride, setSelectedBotOverride] = useState<ChessBot | null>(null);
  const [analysisMovesOverride, setAnalysisMovesOverride] = useState<
    { from: string; to: string; san: string }[] | undefined
  >(undefined);

  // Sync sound settings
  useEffect(() => {
    sound.setEnabled(userProfile.preferences.soundEnabled);
    sound.setVolume(userProfile.preferences.volume);
  }, [userProfile.preferences]);

  // Page title sync
  useEffect(() => {
    const titles: Record<ActiveTab, string> = {
      home: 'openchess.com - Play Chess Online on the #1 Free Site',
      play: 'Play Chess Online - openchess.com',
      bots: 'Play vs AI Bots - openchess.com',
      puzzles: 'Chess Puzzles & Puzzle Rush - openchess.com',
      openings: 'Opening Explorer - openchess.com',
      review: 'Stockfish Analysis & Game Review - openchess.com',
    };
    document.title = titles[activeTab] || 'openchess.com - Play Chess Online';
  }, [activeTab]);

  const handleUpdatePreferences = (pref: UserPreferences) => {
    const updated = { ...userProfile, preferences: pref };
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  const handleSelectBot = (bot: ChessBot) => {
    setSelectedBotOverride(bot);
    setActiveTab('play');
  };

  const handlePlayOpening = (opening: OpeningData) => {
    setActiveTab('play');
  };

  const handleReviewMatch = (match: MatchHistoryItem) => {
    setAnalysisMovesOverride(match.moves);
    setActiveTab('review');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#312e2b] text-white font-sans antialiased overflow-x-hidden select-none">
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-16 md:pb-6 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeHero
            onStartPlay={() => setActiveTab('play')}
            onPlayBots={() => setActiveTab('bots')}
            onSolvePuzzles={() => setActiveTab('puzzles')}
            onOpenAnalysis={() => setActiveTab('review')}
            onOpenLearn={() => setActiveTab('openings')}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'play' && (
          <PlayView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            selectedBotOverride={selectedBotOverride}
            onClearBotOverride={() => setSelectedBotOverride(null)}
          />
        )}

        {activeTab === 'bots' && <BotsView onSelectBot={handleSelectBot} />}

        {activeTab === 'puzzles' && (
          <PuzzlesView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            theme={userProfile.preferences.theme}
            pieceStyle={userProfile.preferences.pieceStyle}
          />
        )}

        {activeTab === 'openings' && (
          <OpeningExplorerView
            theme={userProfile.preferences.theme}
            pieceStyle={userProfile.preferences.pieceStyle}
            onPlayOpening={handlePlayOpening}
          />
        )}

        {activeTab === 'review' && (
          <AnalysisView
            userProfile={userProfile}
            initialMoves={analysisMovesOverride}
          />
        )}
      </main>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab, payload) => {
          if (tab === 'bots' && payload) {
            handleSelectBot(payload);
          } else if (tab === 'openings') {
            setActiveTab('openings');
          } else if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setActiveTab(tab as ActiveTab);
          }
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={userProfile.preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onReviewMatch={handleReviewMatch}
      />
    </div>
  );
};
