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

  // Render by selected style
  switch (style) {
    case '8bit':
      return render8BitPiece(type, isWhite, className, size);
    case 'wood':
      return renderWoodPiece(type, isWhite, className, size);
    case '3d':
      return render3DPiece(type, isWhite, className, size);
    case 'alpha':
      return renderAlphaPiece(type, isWhite, className, size);
    case 'classic':
      return renderClassicPiece(type, isWhite, className, size);
    case 'neo':
    default:
      return renderNeoPiece(type, isWhite, className, size);
  }
};

/* =========================================================================
   1. NEO PIECE SET (Chess.com Signature Vector Style)
   ========================================================================= */
function renderNeoPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const fill = isWhite ? '#ffffff' : '#262421';
  const stroke = isWhite ? '#1e1c18' : '#11100e';
  const highlight = isWhite ? '#f7f7f7' : '#3d3934';
  const lineStroke = isWhite ? '#403d39' : '#ffffff';

  return (
    <svg
      viewBox="0 0 45 45"
      width={size}
      height={size}
      className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${className}`}
    >
      {type === 'p' && (
        <g>
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 1.25.57 2.37 1.47 3.1-1.63 1.05-3.47 3.3-3.47 6.1 0 1.62.65 3.05 1.5 4.1h9c.85-1.05 1.5-2.48 1.5-4.1 0-2.8-1.84-5.05-3.47-6.1.9-.73 1.47-1.85 1.47-3.1 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 36.5c0-3.5 3-6 7-6.5h7c4 .5 7 3 7 6.5v2H12v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M15 33.5c3-1.5 12-1.5 15 0"
            stroke={highlight}
            strokeWidth="1.2"
            fill="none"
          />
        </g>
      )}

      {type === 'n' && (
        <g>
          <path
            d="M22 10c-3.2 0-5.4 2.2-6.3 5.3s.8 7.2-2.1 9.2c-2.1 1.4-4.2 2.1-5.1 5.2 2.1 0 4.2-1.1 6.3-1.1-1.1 3.2-1.1 6.3 2.1 7.4 2.1 1.1 6.3 1.1 8.4-1.1 2.1-2.1 3.2-6.3 4.2-9.5 1.1-3.2 1.1-6.3-1.1-9.5-1.5-2.6-3.6-3.7-6.4-5.9z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16.5" r="1.6" fill={stroke} />
          <path
            d="M11 36.5c1-4 4-6 9-6h5c5 0 8 2 9 6v2H11v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18 20c1.5-2 3.5-3 5-3"
            stroke={lineStroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {type === 'b' && (
        <g>
          <path
            d="M22.5 8c-3.1 0-6.2 4.1-6.2 9.3 0 3.1 1.5 5.7 3.6 7.2-1.5 1.5-3.1 3.6-3.1 6.2h11.4c0-2.6-1.6-4.7-3.1-6.2 2.1-1.5 3.6-4.1 3.6-7.2 0-5.2-3.1-9.3-6.2-9.3z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="22.5" cy="6" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path
            d="M22.5 12.5v6M19.5 15.5h6"
            stroke={lineStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 36.5c1-3.5 4-6 8-6h5c4 0 7 2.5 8 6v2H12v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}

      {type === 'r' && (
        <g>
          <path
            d="M12 12h21v5.5h-2v9h3v3H11v-3h3v-9h-2V12z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16 12v3.5M22.5 12v3.5M29 12v3.5" stroke={stroke} strokeWidth="1.5" />
          <path
            d="M10 36.5c1-3 3-5 8-5h9c5 0 7 2 8 5v2H10v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}

      {type === 'q' && (
        <g>
          <path
            d="M12 18l3.2 10.5h14.6L33 18l-5.6 5.2-4.9-10.4-4.9 10.4L12 18z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="16" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="17.2" cy="12" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="22.5" cy="10" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="27.8" cy="12" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="33" cy="16" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path
            d="M11 36.5c1-3.5 4-6 9-6h5c5 0 8 2.5 9 6v2H11v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}

      {type === 'k' && (
        <g>
          <path
            d="M22.5 5.5v5M20 8h5"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M15 14.5c-1 3.1 1 7.2 4 9.3 0 2.1-2 4.1-4 6.2h15c-2-2.1-4-4.1-4-6.2 3-2.1 5-6.2 4-9.3-2 2.1-5 3.1-7.5 3.1s-5.5-1-7.5-3.1z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M10 36.5c1-3.5 4-6 9-6h7c5 0 8 2.5 9 6v2H10v-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   2. CLASSIC PIECE SET (Traditional Staunton Carved Wood Details)
   ========================================================================= */
function renderClassicPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const fill = isWhite ? '#fdf8ea' : '#1e1c18';
  const stroke = isWhite ? '#3a352d' : '#080706';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${className}`}>
      {type === 'p' && (
        <g>
          <circle cx="22.5" cy="14" r="5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M19 19c-3 3-4 8-3 12h13c1-4 0-9-3-12" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="13" y="33" width="19" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 9c-4 0-7 3-8 7-2 1-4 4-4 8 2-1 4-1 6 0-1 4 0 7 4 8 2 1 6 0 8-2 2-3 3-7 4-10 1-4 0-7-2-9-2-2-5-2-8-2z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="16" cy="17" r="1.5" fill={stroke} />
          <rect x="12" y="33" width="21" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <circle cx="22.5" cy="7" r="1.5" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M22.5 9c-4 0-7 4-7 10 0 3 2 6 4 8-2 1-3 3-3 5h12c0-2-1-4-3-5 2-2 4-5 4-8 0-6-3-10-7-10z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M22.5 13v6M20 16h5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="12" y="33" width="21" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <path d="M13 13h19v5h-2v12h2v3H13v-3h2V18h-2z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M17 13v4M22.5 13v4M28 13v4" stroke={stroke} strokeWidth="1.2" />
          <rect x="11" y="33" width="23" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <circle cx="22.5" cy="8" r="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="13" cy="12" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="32" cy="12" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M14 14l3 12h11l3-12-5 6-4.5-9-4.5 9z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="11" y="33" width="23" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 6v5M20 8.5h5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 14c-2 3 0 7 3 9 0 2-2 4-4 6h15c-2-2-4-4-4-6 3-2 5-6 3-9-2 2-5 3-6.5 3s-4.5-1-6.5-3z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="11" y="33" width="23" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   3. ALPHA PIECE SET (Clean Modern Minimalist Flat Outline)
   ========================================================================= */
function renderAlphaPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const fill = isWhite ? '#f0f3f6' : '#1e293b';
  const stroke = isWhite ? '#0f172a' : '#020617';
  const accent = isWhite ? '#38bdf8' : '#64748b';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}>
      {type === 'p' && (
        <g>
          <circle cx="22.5" cy="13" r="4.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M18 19l-3 14h15l-3-14z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="13" y="33.5" width="19" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 10l-6 6 1 6-4 4 3 2 7-1 3-5 1-8z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="17" cy="16" r="1.2" fill={stroke} />
          <rect x="12" y="33.5" width="21" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <path d="M22.5 9c-3 0-5 3.5-5 8 0 3 1.5 5 3 6.5l-2.5 8h9l-2.5-8c1.5-1.5 3-3.5 3-6.5 0-4.5-2-8-5-8z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="22.5" cy="7" r="1.3" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <rect x="12" y="33.5" width="21" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <rect x="14" y="13" width="17" height="18" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M14 13v3M19.6 13v3M25.3 13v3M31 13v3" stroke={stroke} strokeWidth="1.2" />
          <rect x="11" y="33.5" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <path d="M13 16l3.5 12h12l3.5-12-5.5 5-4-9-4 9z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <circle cx="22.5" cy="9.5" r="1.6" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <rect x="11" y="33.5" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 6v4M20.5 8h4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15 15l2 11h11l2-11-4 3-3.5-4-3.5 4z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="11" y="33.5" width="23" height="3.5" rx="1" fill={accent} stroke={stroke} strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   4. WOOD PIECE SET (Warm Oak & Walnut Grain Tones)
   ========================================================================= */
function renderWoodPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const fill = isWhite ? '#d7a15c' : '#573312';
  const stroke = isWhite ? '#784c19' : '#291404';
  const highlight = isWhite ? '#ecc48f' : '#7b4b1e';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${className}`}>
      <defs>
        <linearGradient id={`wood-grad-${isWhite ? 'w' : 'b'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="100%" stopColor={fill} />
        </linearGradient>
      </defs>
      {type === 'p' && (
        <g>
          <circle cx="22.5" cy="13" r="5" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <path d="M19 18l-3 13h13l-3-13z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <rect x="12" y="32" width="21" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 9c-3 0-5 2-6 5s1 6-2 8c-2 1-3 2-4 5 2 0 4-1 6-1-1 3-1 6 2 7 2 1 6 1 8-1 2-2 3-6 4-9 1-3 1-6-1-9-1.5-2.5-3.5-3.5-6-6z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="1.5" fill={stroke} />
          <rect x="11" y="32" width="23" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <circle cx="22.5" cy="7" r="1.5" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.2" />
          <path d="M22.5 9c-3 0-6 4-6 9 0 3 1.5 5.5 3.5 7-1.5 1.5-3 3.5-3 6h11c0-2.5-1.5-4.5-3-6 2-1.5 3.5-4 3.5-7 0-5-3-9-6-9z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <path d="M22.5 13v5M20 15.5h5" stroke={stroke} strokeWidth="1.4" />
          <rect x="11" y="32" width="23" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <path d="M13 13h19v5h-2v9h2v3H13v-3h2v-9h-2z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <rect x="10" y="32" width="25" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <path d="M12 17l3.2 11h14.6L33 17l-5.6 5.2-4.9-10.4-4.9 10.4L12 17z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <circle cx="22.5" cy="10" r="1.6" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.2" />
          <rect x="10" y="32" width="25" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 5v5M20 7.5h5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15 14c-1 3 1 7 4 9 0 2-2 4-4 6h15c-2-2-4-4-4-6 3-2 5-6 4-9-2 2-5 3-7.5 3S17 16 15 14z" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
          <rect x="10" y="32" width="25" height="5" rx="2" fill={`url(#wood-grad-${isWhite ? 'w' : 'b'})`} stroke={stroke} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================================
   5. 8-BIT RETRO PIECE SET (Pixel Art Arcade Style)
   ========================================================================= */
function render8BitPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const fill = isWhite ? '#5eead4' : '#f43f5e';
  const border = isWhite ? '#042f2e' : '#4c0519';

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
   6. 3D ISOMETRIC PIECE SET (Tactile Beveled Depth & Gloss)
   ========================================================================= */
function render3DPiece(
  type: PieceType,
  isWhite: boolean,
  className: string,
  size: number | string
) {
  const baseGrad = isWhite ? '#e2e8f0' : '#334155';
  const gloss = isWhite ? '#ffffff' : '#475569';
  const shadow = isWhite ? '#94a3b8' : '#0f172a';

  return (
    <svg viewBox="0 0 45 45" width={size} height={size} className={`select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${className}`}>
      <defs>
        <linearGradient id={`grad3d-${isWhite ? 'w' : 'b'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={gloss} />
          <stop offset="50%" stopColor={baseGrad} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>
      </defs>
      {type === 'p' && (
        <g>
          <ellipse cx="22.5" cy="13" rx="5.5" ry="5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <path d="M18 17l-3 14h15l-3-14z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="10" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'n' && (
        <g>
          <path d="M22 9c-3.2 0-5.4 2.2-6.3 5.3s.8 7.2-2.1 9.2c-2.1 1.4-4.2 2.1-5.1 5.2 2.1 0 4.2-1.1 6.3-1.1-1.1 3.2-1.1 6.3 2.1 7.4 2.1 1.1 6.3 1.1 8.4-1.1 2.1-2.1 3.2-6.3 4.2-9.5 1.1-3.2 1.1-6.3-1.1-9.5-1.5-2.6-3.6-3.7-6.4-5.9z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="16.5" r="1.5" fill="#000" />
          <ellipse cx="22.5" cy="33" rx="11" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'b' && (
        <g>
          <circle cx="22.5" cy="6.5" r="1.8" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <path d="M22.5 8c-3.1 0-6.2 4.1-6.2 9.3 0 3.1 1.5 5.7 3.6 7.2-1.5 1.5-3.1 3.6-3.1 6.2h11.4c0-2.6-1.6-4.7-3.1-6.2 2.1-1.5 3.6-4.1 3.6-7.2 0-5.2-3.1-9.3-6.2-9.3z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <path d="M22.5 12.5v5M20 15h5" stroke="#000" strokeWidth="1.2" />
          <ellipse cx="22.5" cy="33" rx="11" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'r' && (
        <g>
          <path d="M12 12h21v5.5h-2v9h3v3H11v-3h3v-9h-2V12z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'q' && (
        <g>
          <path d="M12 18l3.2 10.5h14.6L33 18l-5.6 5.2-4.9-10.4-4.9 10.4L12 18z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <circle cx="22.5" cy="10" r="1.8" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
      {type === 'k' && (
        <g>
          <path d="M22.5 5.5v5M20 8h5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15 14.5c-1 3.1 1 7.2 4 9.3 0 2.1-2 4.1-4 6.2h15c-2-2.1-4-4.1-4-6.2 3-2.1 5-6.2 4-9.3-2 2.1-5 3.1-7.5 3.1s-5.5-1-7.5-3.1z" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
          <ellipse cx="22.5" cy="33" rx="12" ry="3.5" fill={`url(#grad3d-${isWhite ? 'w' : 'b'})`} stroke="#000" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}
