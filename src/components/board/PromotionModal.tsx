import React from 'react';
import { ChessPiece, PieceType, PieceColor, PieceStyle } from '../pieces/PieceSet';

interface PromotionModalProps {
  color: PieceColor;
  pieceStyle: PieceStyle;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  pieceStyle,
  onSelect,
  onCancel,
}) => {
  const options: { type: 'q' | 'r' | 'b' | 'n'; label: string }[] = [
    { type: 'q', label: 'Queen' },
    { type: 'n', label: 'Knight' },
    { type: 'r', label: 'Rook' },
    { type: 'b', label: 'Bishop' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#262522] border border-[#363431] rounded-xl p-4 shadow-2xl flex flex-col items-center gap-3">
        <h3 className="text-sm font-bold text-chess-muted tracking-wide uppercase">
          Promote Pawn
        </h3>
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="w-16 h-16 bg-[#312e2b] hover:bg-[#81b64c] hover:scale-105 transition-all rounded-lg p-2 flex items-center justify-center border border-[#403d39] hover:border-[#81b64c] shadow"
              title={opt.label}
            >
              <ChessPiece type={opt.type} color={color} style={pieceStyle} size={48} />
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-chess-dim hover:text-white transition-colors mt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
