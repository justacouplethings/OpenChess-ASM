import React, { useRef, useEffect } from 'react';

export interface Arrow {
  from: string; // e.g. "e2"
  to: string;   // e.g. "e4"
  color: string;
}

export interface SquareHighlight {
  square: string;
  color: string;
}

interface CanvasOverlayProps {
  arrows: Arrow[];
  highlights: SquareHighlight[];
  orientation: 'w' | 'b';
  boardSize: number;
}

export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  arrows,
  highlights,
  orientation,
  boardSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || boardSize <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = boardSize * dpr;
    canvas.height = boardSize * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, boardSize, boardSize);
    const sqSize = boardSize / 8;

    // Helper: convert square name (e.g. "e4") to center coordinate
    const getSquareCoords = (sq: string) => {
      const file = sq.charCodeAt(0) - 97; // 0 for 'a', 7 for 'h'
      const rank = parseInt(sq[1], 10) - 1; // 0 for '1', 7 for '8'

      const col = orientation === 'w' ? file : 7 - file;
      const row = orientation === 'w' ? 7 - rank : rank;

      return {
        x: col * sqSize + sqSize / 2,
        y: row * sqSize + sqSize / 2,
        left: col * sqSize,
        top: row * sqSize,
      };
    };

    // 1. Render Square Highlights
    highlights.forEach((h) => {
      const coords = getSquareCoords(h.square);
      ctx.fillStyle = h.color;
      ctx.fillRect(coords.left, coords.top, sqSize, sqSize);
    });

    // 2. Render Arrows
    arrows.forEach((arr) => {
      const start = getSquareCoords(arr.from);
      const end = getSquareCoords(arr.to);

      drawArrow(ctx, start.x, start.y, end.x, end.y, arr.color, sqSize);
    });
  }, [arrows, highlights, orientation, boardSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: boardSize, height: boardSize }}
    />
  );
};

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  sqSize: number
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 5) return;

  const headLength = sqSize * 0.42;
  const headWidth = sqSize * 0.45;
  const shaftWidth = sqSize * 0.18;

  // Shorten arrow end slightly so it doesn't overlap the piece center completely
  const stopOffset = sqSize * 0.22;
  const targetX = toX - Math.cos(angle) * stopOffset;
  const targetY = toY - Math.sin(angle) * stopOffset;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.translate(fromX, fromY);
  ctx.rotate(angle);

  const drawLength = Math.hypot(targetX - fromX, targetY - fromY);
  const shaftLength = Math.max(0, drawLength - headLength);

  // Draw shaft
  ctx.beginPath();
  ctx.moveTo(0, -shaftWidth / 2);
  ctx.lineTo(shaftLength, -shaftWidth / 2);
  ctx.lineTo(shaftLength, -headWidth / 2);
  // Arrow tip
  ctx.lineTo(drawLength, 0);
  ctx.lineTo(shaftLength, headWidth / 2);
  ctx.lineTo(shaftLength, shaftWidth / 2);
  ctx.lineTo(0, shaftWidth / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
