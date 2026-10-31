import React from 'react';
import { X, Volume2, VolumeX, Check, Palette } from 'lucide-react';
import { UserPreferences, BoardTheme } from '../../utils/storage';
import { PieceStyle, ChessPiece } from '../pieces/PieceSet';
import { sound } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (pref: UserPreferences) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  const themes: { id: BoardTheme; name: string; light: string; dark: string }[] = [
    { id: 'green', name: 'Default Green', light: '#eeeed2', dark: '#769656' },
    { id: 'wood', name: 'Natural Wood', light: '#e8c39e', dark: '#9e6a38' },
    { id: 'glass', name: 'Frosted Glass', light: '#70a4a2', dark: '#3a6b68' },
    { id: 'marble', name: 'Slate Marble', light: '#e2e8f0', dark: '#64748b' },
    { id: 'neon', name: 'Cyber Neon', light: '#4deeea', dark: '#0f3854' },
    { id: 'gothic', name: 'Gothic Clay', light: '#c4b79b', dark: '#6b4c35' },
  ];

  const pieceStyles: { id: PieceStyle; name: string }[] = [
    { id: 'neo', name: 'Neo (Flagship)' },
    { id: 'classic', name: 'Classic Staunton' },
    { id: 'alpha', name: 'Alpha Minimal' },
    { id: 'wood', name: 'Wood Carved' },
    { id: '8bit', name: '8-Bit Retro' },
    { id: '3d', name: '3D Tactile' },
  ];

  const update = (patch: Partial<UserPreferences>) => {
    const next = { ...preferences, ...patch };
    onUpdatePreferences(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#262522] border border-[#363431] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#363431] bg-[#21201d]">
          <div className="flex items-center gap-2">
            <Palette className="text-chess-green" size={20} />
            <h2 className="text-base font-bold text-white tracking-tight">
              Settings & Customization
            </h2>
          </div>
          <button onClick={onClose} className="text-chess-dim hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Board Themes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-chess-muted block mb-3">
              Board Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ theme: t.id })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    preferences.theme === t.id
                      ? 'border-chess-green bg-[#312e2b] shadow-md ring-1 ring-chess-green'
                      : 'border-[#363431] bg-[#21201d] hover:border-[#4d4a46]'
                  }`}
                >
                  <div className="w-16 h-12 rounded overflow-hidden grid grid-cols-2 shadow-inner border border-black/20">
                    <div style={{ backgroundColor: t.light }} />
                    <div style={{ backgroundColor: t.dark }} />
                    <div style={{ backgroundColor: t.dark }} />
                    <div style={{ backgroundColor: t.light }} />
                  </div>
                  <span className="font-semibold text-white text-[11px]">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Piece Sets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-chess-muted block mb-3">
              Piece Set
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {pieceStyles.map((ps) => (
                <button
                  key={ps.id}
                  onClick={() => update({ pieceStyle: ps.id })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    preferences.pieceStyle === ps.id
                      ? 'border-chess-green bg-[#312e2b] shadow-md ring-1 ring-chess-green'
                      : 'border-[#363431] bg-[#21201d] hover:border-[#4d4a46]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ChessPiece type="n" color="w" style={ps.id} size={32} />
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ChessPiece type="k" color="b" style={ps.id} size={32} />
                    </div>
                  </div>
                  <span className="font-semibold text-white text-[11px]">
                    {ps.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-[#21201d] p-3.5 rounded-xl border border-[#363431] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Audio Effects</span>
              <button
                onClick={() => {
                  const nextSound = !preferences.soundEnabled;
                  update({ soundEnabled: nextSound });
                  sound.setEnabled(nextSound);
                  if (nextSound) sound.play('move');
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  preferences.soundEnabled
                    ? 'bg-chess-green text-white'
                    : 'bg-[#312e2b] text-chess-dim'
                }`}
              >
                {preferences.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            {preferences.soundEnabled && (
              <div className="flex items-center gap-3">
                <span className="text-chess-dim text-[11px] w-12">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={preferences.volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    update({ volume: vol });
                    sound.setVolume(vol);
                  }}
                  className="flex-1 accent-chess-green h-1.5 bg-[#363431] rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => sound.play('capture')}
                  className="px-2 py-1 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-[11px] font-semibold rounded border border-[#403d39]"
                >
                  Test
                </button>
              </div>
            )}
          </div>

          {/* Board Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-chess-muted block mb-1">
              Gameplay Options
            </label>

            {/* Coordinates */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#21201d] border border-[#363431]">
              <span className="text-white font-medium">Board Coordinates</span>
              <div className="flex gap-1 bg-[#262522] p-1 rounded-md border border-[#363431]">
                {(['inside', 'none'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update({ showCoords: opt })}
                    className={`px-2.5 py-0.5 rounded text-[11px] capitalize font-semibold transition-all ${
                      preferences.showCoords === opt
                        ? 'bg-chess-green text-white'
                        : 'text-chess-dim hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Premoves toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#21201d] border border-[#363431]">
              <div>
                <span className="text-white font-medium block">Allow Premoves</span>
                <span className="text-[11px] text-chess-dim block">
                  Queue moves before opponent responds
                </span>
              </div>
              <button
                onClick={() => update({ allowPremoves: !preferences.allowPremoves })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  preferences.allowPremoves ? 'bg-chess-green' : 'bg-[#363431]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.allowPremoves ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Legal move dots toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#21201d] border border-[#363431]">
              <span className="text-white font-medium">Show Legal Move Dots</span>
              <button
                onClick={() => update({ showLegalMoves: !preferences.showLegalMoves })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  preferences.showLegalMoves ? 'bg-chess-green' : 'bg-[#363431]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.showLegalMoves ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#363431] bg-[#21201d] flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-chess-green hover:bg-chess-greenHover text-white font-bold text-xs rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
