import React from 'react';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type PieceStyle = 'neo' | 'classic' | 'alpha' | 'wood' | '8bit' | '3d';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  style?: PieceStyle;
  className?: string;
  size?: number | string;
}

export const ChessPiece: React.FC<PieceProps> = ({
  type,
  color,
  style = 'neo',
  className = '',
  size = '100%',
}) => {
  const isWhite = color === 'w';

  switch (style) {
    case 'classic':
      return renderClassic(type, isWhite, className, size);
    case 'alpha':
      return renderAlpha(type, isWhite, className, size);
    case 'wood':
      return renderWood(type, isWhite, className, size);
    case '8bit':
      return render8Bit(type, isWhite, className, size);
    case '3d':
      return render3D(type, isWhite, className, size);
    case 'neo':
    default:
      return renderNeo(type, isWhite, className, size);
  }
};

/* =========================================================================
   1. AUTHENTIC CHESS.COM "NEO" VECTOR PIECES
   Clean, curved, modern vectors matching Chess.com's exact signature set
   ========================================================================= */
function renderNeo(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const body = isWhite ? '#ffffff' : '#3a3835';
  const stroke = isWhite ? '#1e1c18' : '#141312';
  const sheen = isWhite ? '#ffffff' : '#4f4c47';
  const innerLine = isWhite ? '#e5e5e5' : '#524e47';

  return (
    <svg
      viewBox="0 0 45 45"
      width={size}
      height={size}
      className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    >
      {type === 'p' && (
        <g>
          {/* Head */}
          <circle cx="22.5" cy="12" r="5" fill={body} stroke={stroke} strokeWidth="1.6" />
          {/* Neck ring */}
          <path d="M19 18.5 h7" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          {/* Waist & Skirt */}
          <path
            d="M18.5 19.5 C18.5 24 15 28 14.5 32.5 h16 C30 28 26.5 24 26.5 19.5 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Base */}
          <rect x="11" y="32.5" width="23" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
          {/* Subtle inner highlight */}
          <path d="M16.5 31 C17 27 20 23 20 20" stroke={sheen} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {type === 'n' && (
        <g>
          {/* Horse body & head */}
          <path
            d="M22 8 C18 8 15 11 14 15 C13 19 11 21 8.5 24 C11 24.5 13.5 23.5 15.5 22.5 C14 26 14 30 17 33 C19 33.5 23 33.5 25 32 C27 30 29.5 25 30.5 21 C31.5 17 30 12.5 27 9.5 C25 8.5 23.5 8 22 8 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Nostril & eye */}
          <circle cx="15.5" cy="15.5" r="1.5" fill={stroke} />
          {/* Mane line */}
          <path d="M22 10 C25 13 26 17 25 21" stroke={innerLine} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Base */}
          <rect x="11" y="33" width="23" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
        </g>
      )}

      {type === 'b' && (
        <g>
          {/* Small finial ball */}
          <circle cx="22.5" cy="6" r="1.7" fill={body} stroke={stroke} strokeWidth="1.2" />
          {/* Miter body */}
          <path
            d="M22.5 8 C19 8 15.5 12.5 15.5 18 C15.5 22 17.5 25 19 27 C17.5 28.5 16 30 16 32.5 h13 C29 30 27.5 28.5 26 27 C27.5 25 29.5 22 29.5 18 C29.5 12.5 26 8 22.5 8 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Miter cut / slash */}
          <path d="M22.5 12.5 v6 M19.5 15.5 h6" stroke={innerLine} strokeWidth="1.4" strokeLinecap="round" />
          {/* Base */}
          <rect x="11" y="32.5" width="23" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
        </g>
      )}

      {type === 'r' && (
        <g>
          {/* Castle parapet / battlements */}
          <path
            d="M12 11 h21 v6 h-2 v14 h2 v2 h-21 v-2 h2 v-14 h-2 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Crenel notches */}
          <path d="M16.5 11 v4 M22.5 11 v4 M28.5 11 v4" stroke={stroke} strokeWidth="1.5" />
          {/* Base */}
          <rect x="10" y="33" width="25" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
          <path d="M15 17 h15" stroke={innerLine} strokeWidth="1.2" />
        </g>
      )}

      {type === 'q' && (
        <g>
          {/* Crown points */}
          <path
            d="M12 17 L15 28 h15 L33 17 L27.5 22.5 L22.5 11 L17.5 22.5 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Crown jewels */}
          <circle cx="12" cy="15.5" r="1.6" fill={body} stroke={stroke} strokeWidth="1.2" />
          <circle cx="17.2" cy="11.5" r="1.6" fill={body} stroke={stroke} strokeWidth="1.2" />
          <circle cx="22.5" cy="9.5" r="1.8" fill={body} stroke={stroke} strokeWidth="1.2" />
          <circle cx="27.8" cy="11.5" r="1.6" fill={body} stroke={stroke} strokeWidth="1.2" />
          <circle cx="33" cy="15.5" r="1.6" fill={body} stroke={stroke} strokeWidth="1.2" />
          {/* Base */}
          <rect x="10" y="33" width="25" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
          {/* Waist ring */}
          <path d="M15 28 h15" stroke={innerLine} strokeWidth="1.4" />
        </g>
      )}

      {type === 'k' && (
        <g>
          {/* Cross finial */}
          <path d="M22.5 5 v6 M19.5 8 h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          {/* Crown dome */}
          <path
            d="M15 14.5 C13 18 15 22 18 24.5 C16 26.5 14 29 14 32.5 h17 C31 29 29 26.5 27 24.5 C30 22 32 18 30 14.5 C28 17 25 18 22.5 18 C20 18 17 17 15 14.5 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Base */}
          <rect x="10" y="32.5" width="25" height="4.5" rx="1.5" fill={body} stroke={stroke} strokeWidth="1.6" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   2. CLASSIC STAUNTON PIECE SET
   ========================================================================= */
function renderClassic(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const body = isWhite ? '#f7f6f2' : '#23211f';
  const stroke = isWhite ? '#2e2a25' : '#0c0b0a';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${className}`}>
      {type === 'p' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <circle cx="22.5" cy="13" r="5" />
          <path d="M18.5 18 L15 32 h15 L26.5 18 Z" />
          <rect x="12" y="32" width="21" height="5" rx="1.5" />
        </g>
      )}
      {type === 'n' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <path d="M22 9 C18 9 15 12 14 16 C12 17 10 20 10 24 C13 23 15 23 16 22 C15 26 16 29 19 32 h8 C28 29 30 24 31 19 C31 15 28 9 22 9 Z" />
          <circle cx="16" cy="17" r="1.5" fill={stroke} />
          <rect x="11" y="32" width="23" height="5" rx="1.5" />
        </g>
      )}
      {type === 'b' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <circle cx="22.5" cy="6.5" r="1.6" />
          <path d="M22.5 8.5 C19 8.5 16 12 16 18 C16 22 18 25 19 27 L17 32 h11 L26 27 C27 25 29 22 29 18 C29 12 26 8.5 22.5 8.5 Z" />
          <rect x="11" y="32" width="23" height="5" rx="1.5" />
        </g>
      )}
      {type === 'r' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <path d="M13 12 h19 v6 h-2 v14 h2 v2 h-19 v-2 h2 v-14 h-2 Z" />
          <path d="M17 12 v4 M22.5 12 v4 M28 12 v4" />
          <rect x="10" y="32" width="25" height="5" rx="1.5" />
        </g>
      )}
      {type === 'q' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <path d="M13 16 L16 28 h13 L32 16 L27 21 L22.5 10 L18 21 Z" />
          <circle cx="13" cy="14" r="1.5" />
          <circle cx="18" cy="10" r="1.5" />
          <circle cx="22.5" cy="8" r="1.5" />
          <circle cx="27" cy="10" r="1.5" />
          <circle cx="32" cy="14" r="1.5" />
          <rect x="10" y="32" width="25" height="5" rx="1.5" />
        </g>
      )}
      {type === 'k' && (
        <g fill={body} stroke={stroke} strokeWidth="1.5">
          <path d="M22.5 5 v5 M20 7.5 h5" strokeWidth="1.8" />
          <path d="M15 14 C13 18 15 22 18 24 L16 32 h13 L27 24 C30 22 32 18 30 14 C27 16 25 17 22.5 17 C20 17 18 16 15 14 Z" />
          <rect x="10" y="32" width="25" height="5" rx="1.5" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   3. ALPHA MINIMALIST PIECE SET
   ========================================================================= */
function renderAlpha(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const fill = isWhite ? '#f8fafc' : '#1e293b';
  const stroke = isWhite ? '#0f172a' : '#020617';
  const accent = isWhite ? '#38bdf8' : '#64748b';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}>
      {type === 'p' && (
        <g>
          <circle cx="22.5" cy="13" r="4.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M18 19 L15 33 h15 L27 19 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="13" y="33" width="19" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 10 L16 16 L17 22 L13 26 L16 28 L23 27 L26 22 L27 14 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="17" cy="16" r="1.2" fill={stroke} />
          <rect x="12" y="33" width="21" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <circle cx="22.5" cy="7" r="1.4" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M22.5 9 C19.5 9 17.5 12.5 17.5 17 C17.5 20 19 22 20.5 23.5 L18 33 h9 L24.5 23.5 C26 22 27.5 20 27.5 17 C27.5 12.5 25.5 9 22.5 9 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="12" y="33" width="21" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <rect x="14" y="13" width="17" height="18" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M14 13 v3 M19.6 13 v3 M25.3 13 v3 M31 13 v3" stroke={stroke} strokeWidth="1.2" />
          <rect x="11" y="33" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <path d="M13 16 L16.5 28 h12 L32 16 L26.5 21 L22.5 12 L18.5 21 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="22.5" cy="9.5" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <rect x="11" y="33" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 6 v4 M20.5 8 h4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15 15 L17 26 h11 L30 15 L26 18 L22.5 14 L19 18 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="11" y="33" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   4. WOOD CARVED PIECE SET
   ========================================================================= */
function renderWood(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const fill = isWhite ? '#d7a15c' : '#573312';
  const stroke = isWhite ? '#784c19' : '#291404';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] ${className}`}>
      {type === 'p' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <circle cx="22.5" cy="13" r="5" />
          <path d="M19 18 L16 31 h13 L26 18 Z" />
          <rect x="12" y="31" width="21" height="5" rx="2" />
        </g>
      )}
      {type === 'n' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <path d="M22 9 C19 9 17 11 16 14 C14 16 12 18 11 21 C13 21 15 20 17 20 C16 23 16 26 18 29 C20 30 24 30 26 28 C28 26 29 22 30 19 C31 16 30 13 28 10 C26 9 24 9 22 9 Z" />
          <circle cx="16" cy="16" r="1.5" fill={stroke} />
          <rect x="11" y="31" width="23" height="5" rx="2" />
        </g>
      )}
      {type === 'b' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <circle cx="22.5" cy="7" r="1.5" />
          <path d="M22.5 9 C19.5 9 16.5 13 16.5 18 C16.5 21 18 23.5 20 25 C18.5 26.5 17 28.5 17 31 h11 C28 28.5 26.5 26.5 25 25 C27 23.5 28.5 21 28.5 18 C28.5 13 25.5 9 22.5 9 Z" />
          <rect x="11" y="31" width="23" height="5" rx="2" />
        </g>
      )}
      {type === 'r' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <path d="M13 13 h19 v5 h-2 v9 h2 v3 h-19 v-3 h2 v-9 h-2 Z" />
          <rect x="10" y="31" width="25" height="5" rx="2" />
        </g>
      )}
      {type === 'q' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <path d="M12 17 L15.2 28 h14.6 L33 17 L27.4 22.2 L22.5 11.8 L17.6 22.2 Z" />
          <circle cx="22.5" cy="10" r="1.6" />
          <rect x="10" y="31" width="25" height="5" rx="2" />
        </g>
      )}
      {type === 'k' && (
        <g fill={fill} stroke={stroke} strokeWidth="1.5">
          <path d="M22.5 5 v5 M20 7.5 h5" strokeWidth="1.8" />
          <path d="M15 14 C14 17 16 21 19 23 C17 25 15 27 15 29 h15 C30 27 28 25 26 23 C29 21 31 17 30 14 C28 16 25 17 22.5 17 C20 17 17 16 15 14 Z" />
          <rect x="10" y="31" width="25" height="5" rx="2" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   5. 8-BIT RETRO PIECE SET
   ========================================================================= */
function render8Bit(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const fill = isWhite ? '#5eead4' : '#f43f5e';

  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_0px_#000] shape-rendering-crispEdges ${className}`}>
      {type === 'p' && (
        <g fill={fill}>
          <rect x="7" y="2" width="2" height="2" />
          <rect x="6" y="4" width="4" height="2" />
          <rect x="7" y="6" width="2" height="4" />
          <rect x="5" y="10" width="6" height="2" />
          <rect x="4" y="12" width="8" height="2" />
        </g>
      )}
      {type === 'n' && (
        <g fill={fill}>
          <rect x="6" y="2" width="4" height="2" />
          <rect x="4" y="4" width="7" height="2" />
          <rect x="3" y="6" width="7" height="2" />
          <rect x="5" y="8" width="6" height="2" />
          <rect x="7" y="10" width="4" height="2" />
          <rect x="4" y="12" width="8" height="2" />
        </g>
      )}
      {type === 'b' && (
        <g fill={fill}>
          <rect x="7" y="2" width="2" height="1" />
          <rect x="6" y="3" width="4" height="4" />
          <rect x="7" y="7" width="2" height="3" />
          <rect x="5" y="10" width="6" height="2" />
          <rect x="4" y="12" width="8" height="2" />
        </g>
      )}
      {type === 'r' && (
        <g fill={fill}>
          <rect x="4" y="3" width="2" height="2" />
          <rect x="7" y="3" width="2" height="2" />
          <rect x="10" y="3" width="2" height="2" />
          <rect x="4" y="5" width="8" height="2" />
          <rect x="5" y="7" width="6" height="4" />
          <rect x="3" y="11" width="10" height="3" />
        </g>
      )}
      {type === 'q' && (
        <g fill={fill}>
          <rect x="4" y="3" width="1" height="1" />
          <rect x="7.5" y="2" width="1" height="1" />
          <rect x="11" y="3" width="1" height="1" />
          <rect x="4" y="5" width="8" height="2" />
          <rect x="5" y="7" width="6" height="3" />
          <rect x="4" y="10" width="8" height="2" />
          <rect x="3" y="12" width="10" height="2" />
        </g>
      )}
      {type === 'k' && (
        <g fill={fill}>
          <rect x="7" y="1" width="2" height="3" />
          <rect x="6" y="2" width="4" height="1" />
          <rect x="5" y="4" width="6" height="3" />
          <rect x="6" y="7" width="4" height="3" />
          <rect x="4" y="10" width="8" height="2" />
          <rect x="3" y="12" width="10" height="2" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   6. 3D TACTILE BEVELED PIECE SET
   ========================================================================= */
function render3D(type: PieceType, isWhite: boolean, className: string, size: number | string) {
  const baseGrad = isWhite ? '#e2e8f0' : '#334155';
  const gloss = isWhite ? '#ffffff' : '#475569';
  const shadow = isWhite ? '#94a3b8' : '#0f172a';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] ${className}`}>
      <defs>
        <linearGradient id={`g3d-${isWhite ? 'w' : 'b'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={gloss} />
          <stop offset="50%" stopColor={baseGrad} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>
      </defs>
      {type === 'p' && (
        <g>
          <ellipse cx="22.5" cy="13" rx="5.5" ry="5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <path d="M18 17 L15 31 h15 L27 17 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="10" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 9 C19 9 17 11 16 14 C14 16 12 18 11 21 C13 21 15 20 17 20 C16 23 16 26 18 29 C20 30 24 30 26 28 C28 26 29 22 30 19 C31 16 30 13 28 10 C26 9 24 9 22 9 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="16.5" r="1.5" fill="#000" />
          <ellipse cx="22.5" cy="33" rx="11" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <circle cx="22.5" cy="6.5" r="1.8" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <path d="M22.5 8 C19.5 8 16.5 12 16.5 17.5 C16.5 20.5 18 23 19.5 24.5 L17.5 32 h10 L25.5 24.5 C27 23 28.5 20.5 28.5 17.5 C28.5 12 25.5 8 22.5 8 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="11" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <path d="M12 12 h21 v5.5 h-2 v9 h3 v3 h-23 v-3 h3 v-9 h-2 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <path d="M12 18 L15.2 28.5 h14.6 L33 18 L27.4 23.2 L22.5 12.8 L17.6 23.2 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <circle cx="22.5" cy="10" r="1.8" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 5.5 v5 M20 8 h5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15 14.5 C14 17.5 16 21.5 19 23.5 L17 31 h11 L26 23.5 C29 21.5 31 17.5 30 14.5 C28 16.5 25 17.5 22.5 17.5 C20 17.5 17 16.5 15 14.5 Z" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#g3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}
