import { PieceStyle } from '../components/pieces/PieceSet';

export type BoardTheme = 'green' | 'wood' | 'glass' | 'marble' | 'neon' | 'gothic';

export interface MatchHistoryItem {
  id: string;
  date: string;
  opponent: string;
  opponentElo: number;
  playerColor: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  reason: string;
  timeControl: string;
  movesCount: number;
  accuracy: number;
  moves: { from: string; to: string; san: string }[];
}

export interface UserPreferences {
  theme: BoardTheme;
  pieceStyle: PieceStyle;
  soundEnabled: boolean;
  volume: number;
  autoQueen: boolean;
  showCoords: 'inside' | 'outside' | 'none';
  showEvalBar: boolean;
  showLegalMoves: boolean;
  allowPremoves: boolean;
}

export interface UserProfile {
  username: string;
  avatar: string;
  eloBlitz: number;
  eloRapid: number;
  eloBullet: number;
  eloPuzzles: number;
  puzzleRushHighscore3m: number;
  puzzleRushHighscore5m: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  history: MatchHistoryItem[];
  preferences: UserPreferences;
}

const STORAGE_KEY = 'openchess_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  username: 'GrandmasterGuest',
  avatar: '♟️',
  eloBlitz: 1200,
  eloRapid: 1200,
  eloBullet: 1200,
  eloPuzzles: 1250,
  puzzleRushHighscore3m: 14,
  puzzleRushHighscore5m: 21,
  gamesPlayed: 5,
  wins: 3,
  losses: 1,
  draws: 1,
  history: [
    {
      id: 'hist-1',
      date: 'Today',
      opponent: 'Nelson (Bot)',
      opponentElo: 1300,
      playerColor: 'w',
      result: 'win',
      reason: 'Checkmate',
      timeControl: '10 min',
      movesCount: 28,
      accuracy: 89.4,
      moves: [
        { from: 'e2', to: 'e4', san: 'e4' },
        { from: 'e7', to: 'e5', san: 'e5' },
        { from: 'g1', to: 'f3', san: 'Nf3' },
        { from: 'b8', to: 'c6', san: 'Nc6' },
        { from: 'f1', to: 'c4', san: 'Bc4' },
        { from: 'd8', to: 'h4', san: 'Qh4' },
        { from: 'e1', to: 'g1', san: 'O-O' },
        { from: 'h4', to: 'e4', san: 'Qxe4' },
        { from: 'f1', to: 'e1', san: 'Re1' },
      ],
    },
    {
      id: 'hist-2',
      date: 'Yesterday',
      opponent: 'Antonio (Bot)',
      opponentElo: 1500,
      playerColor: 'b',
      result: 'draw',
      reason: 'Stalemate',
      timeControl: '5 min',
      movesCount: 42,
      accuracy: 83.1,
      moves: [
        { from: 'e2', to: 'e4', san: 'e4' },
        { from: 'e7', to: 'e5', san: 'e5' },
        { from: 'g1', to: 'f3', san: 'Nf3' },
      ],
    },
  ],
  preferences: {
    theme: 'green',
    pieceStyle: 'neo',
    soundEnabled: true,
    volume: 0.8,
    autoQueen: true,
    showCoords: 'inside',
    showEvalBar: true,
    showLegalMoves: true,
    allowPremoves: true,
  },
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function recordMatch(
  profile: UserProfile,
  match: Omit<MatchHistoryItem, 'id' | 'date'>
): UserProfile {
  const newMatch: MatchHistoryItem = {
    ...match,
    id: `hist-${Date.now()}`,
    date: new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  const updated: UserProfile = {
    ...profile,
    gamesPlayed: profile.gamesPlayed + 1,
    wins: match.result === 'win' ? profile.wins + 1 : profile.wins,
    losses: match.result === 'loss' ? profile.losses + 1 : profile.losses,
    draws: match.result === 'draw' ? profile.draws + 1 : profile.draws,
    history: [newMatch, ...profile.history],
  };

  saveUserProfile(updated);
  return updated;
}
