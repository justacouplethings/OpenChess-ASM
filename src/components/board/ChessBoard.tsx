import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPiece, PieceType, PieceColor, PieceStyle } from '../pieces/PieceSet';
import { CanvasOverlay, Arrow, SquareHighlight } from './CanvasOverlay';
import { PromotionModal } from './PromotionModal';
import { sound } from '../../utils/audio';
import { BoardTheme } from '../../utils/storage';

export interface MoveEvent {
  from: string;
  to: string;
  promotion?: string;
  san: string;
}

interface ChessBoardProps {
  game: Chess;
  orientation?: 'w' | 'b';
  theme?: BoardTheme;
  pieceStyle?: PieceStyle;
  showCoords?: 'inside' | 'outside' | 'none';
  showLegalMoves?: boolean;
  allowPremoves?: boolean;
  interactive?: boolean;
  lastMove?: { from: string; to: string } | null;
  onMove?: (move: MoveEvent) => void;
  onPremoveQueued?: (premove: { from: string; to: string } | null) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  orientation = 'w',
  theme = 'green',
  pieceStyle = 'neo',
  showCoords = 'inside',
  showLegalMoves = true,
  allowPremoves = true,
  interactive = true,
  lastMove = null,
  onMove,
  onPremoveQueued,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Premoves
  const [premove, setPremove] = useState<{ from: string; to: string } | null>(null);

  // Right-click drawings
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [squareHighlights, setSquareHighlights] = useState<SquareHighlight[]>([]);
  const rightClickStartRef = useRef<{ square: string; x: number; y: number } | null>(null);

  // Drag and drop state
  const [dragSquare, setDragSquare] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(560);

  // Update board dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        setBoardWidth(boardRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute legal moves for a square
  const getMovesForSquare = useCallback(
    (sq: string) => {
      try {
        const moves = game.moves({ square: sq as Square, verbose: true });
        return moves.map((m) => m.to);
      } catch {
        return [];
      }
    },
    [game]
  );

  // Find king in check
  const inCheck = game.inCheck();
  let checkKingSquare: string | null = null;
  if (inCheck) {
    const board = game.board();
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          const file = String.fromCharCode(97 + c);
          const rank = (8 - r).toString();
          checkKingSquare = `${file}${rank}`;
          break;
        }
      }
    }
  }

  // Handle Premoves trigger when turn changes
  useEffect(() => {
    if (premove && interactive) {
      const isMyTurn =
        (orientation === 'w' && game.turn() === 'w') ||
        (orientation === 'b' && game.turn() === 'b');

      if (isMyTurn) {
        // Attempt premove
        try {
          const move = game.move({
            from: premove.from,
            to: premove.to,
            promotion: 'q',
          });
          if (move) {
            sound.play(move.captured ? 'capture' : move.san.includes('+') ? 'check' : 'move');
            onMove?.({
              from: move.from,
              to: move.to,
              promotion: move.promotion,
              san: move.san,
            });
          }
        } catch {
          // Illegal premove, cancel
          sound.play('illegal');
        }
        setPremove(null);
        onPremoveQueued?.(null);
      }
    }
  }, [game.fen(), premove, interactive, orientation, onMove, onPremoveQueued]);

  // Execute or stage a move
  const executeMove = (from: string, to: string, promotionChoice?: string) => {
    const piece = game.get(from as Square);
    if (!piece) return false;

    // Check pawn promotion requirement
    const isPawn = piece.type === 'p';
    const isPromotionRank = (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');

    if (isPawn && isPromotionRank && !promotionChoice) {
      setPendingPromotion({ from, to });
      return true;
    }

    try {
      const move = game.move({
        from: from as Square,
        to: to as Square,
        promotion: (promotionChoice || 'q') as 'q' | 'r' | 'b' | 'n',
      });

      if (move) {
        // Sound dispatch
        if (move.san.includes('#')) {
          sound.play('end');
        } else if (move.san.includes('+')) {
          sound.play('check');
        } else if (move.flags.includes('k') || move.flags.includes('q')) {
          sound.play('castle');
        } else if (move.promotion) {
          sound.play('promote');
        } else if (move.captured) {
          sound.play('capture');
        } else {
          sound.play('move');
        }

        setSelectedSquare(null);
        setLegalMoves([]);
        setArrows([]);
        setSquareHighlights([]);

        onMove?.({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
          san: move.san,
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  // Click on a square
  const handleSquareClick = (sq: string) => {
    if (!interactive) return;

    // Clear right-click annotations on left click
    if (arrows.length > 0 || squareHighlights.length > 0) {
      setArrows([]);
      setSquareHighlights([]);
    }

    const piece = game.get(sq as Square);
    const isTurn =
      (orientation === 'w' && game.turn() === 'w') ||
      (orientation === 'b' && game.turn() === 'b');

    // If already selected and clicking another square
    if (selectedSquare) {
      if (selectedSquare === sq) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // If it is the player's turn, attempt move
      if (isTurn) {
        const success = executeMove(selectedSquare, sq);
        if (success) return;
      } else if (allowPremoves) {
        // Queue premove
        setPremove({ from: selectedSquare, to: sq });
        sound.play('premove');
        onPremoveQueued?.({ from: selectedSquare, to: sq });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Select piece if matching player color
    if (piece && piece.color === orientation) {
      setSelectedSquare(sq);
      if (showLegalMoves && isTurn) {
        setLegalMoves(getMovesForSquare(sq));
      } else {
        setLegalMoves([]);
      }
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent, sq: string) => {
    if (!interactive || e.button !== 0) return; // Left button only

    const piece = game.get(sq as Square);
    if (!piece || piece.color !== orientation) return;

    setDragSquare(sq);
    setDragPos({ x: e.clientX, y: e.clientY });
    setSelectedSquare(sq);

    const isTurn =
      (orientation === 'w' && game.turn() === 'w') ||
      (orientation === 'b' && game.turn() === 'b');

    if (showLegalMoves && isTurn) {
      setLegalMoves(getMovesForSquare(sq));
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragSquare) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragSquare || !boardRef.current) {
      setDragSquare(null);
      setDragPos(null);
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const sqSize = rect.width / 8;
      const col = Math.floor(x / sqSize);
      const row = Math.floor(y / sqSize);

      const fileIdx = orientation === 'w' ? col : 7 - col;
      const rankIdx = orientation === 'w' ? 7 - row : row;

      const targetSq = `${String.fromCharCode(97 + fileIdx)}${rankIdx + 1}`;

      if (targetSq !== dragSquare) {
        const isTurn =
          (orientation === 'w' && game.turn() === 'w') ||
          (orientation === 'b' && game.turn() === 'b');

        if (isTurn) {
          executeMove(dragSquare, targetSq);
        } else if (allowPremoves) {
          setPremove({ from: dragSquare, to: targetSq });
          sound.play('premove');
          onPremoveQueued?.({ from: dragSquare, to: targetSq });
        }
      }
    }

    setDragSquare(null);
    setDragPos(null);
  };

  // Right Click Canvas Annotation Handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent, sq: string) => {
    if (e.button === 2) {
      // Right-click down
      rightClickStartRef.current = { square: sq, x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = (e: React.MouseEvent, sq: string) => {
    if (e.button === 2 && rightClickStartRef.current) {
      const startSq = rightClickStartRef.current.square;
      rightClickStartRef.current = null;

      // Color selection based on modifier keys
      let color = 'rgba(74, 222, 128, 0.8)'; // green default
      if (e.altKey) color = 'rgba(251, 146, 60, 0.85)'; // orange
      else if (e.shiftKey) color = 'rgba(239, 68, 68, 0.85)'; // red
      else if (e.ctrlKey || e.metaKey) color = 'rgba(56, 189, 248, 0.85)'; // blue

      if (startSq === sq) {
        // Toggle square highlight
        setSquareHighlights((prev) => {
          const exists = prev.some((h) => h.square === sq);
          if (exists) {
            return prev.filter((h) => h.square !== sq);
          }
          return [...prev, { square: sq, color: color.replace('0.85', '0.4').replace('0.8', '0.4') }];
        });
      } else {
        // Toggle arrow
        setArrows((prev) => {
          const exists = prev.some((a) => a.from === startSq && a.to === sq);
          if (exists) {
            return prev.filter((a) => !(a.from === startSq && a.to === sq));
          }
          return [...prev, { from: startSq, to: sq, color }];
        });
      }
    }
  };

  // Render board squares
  const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  return (
    <div
      ref={boardRef}
      onContextMenu={handleContextMenu}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`theme-${theme} relative w-full aspect-square rounded-md overflow-hidden shadow-2xl select-none touch-none border-2 border-[#363431]`}
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* 8x8 Grid of Squares */}
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rowIdx) =>
          files.map((file, colIdx) => {
            const sq = `${file}${rank}`;
            const isLight = (rowIdx + colIdx) % 2 === 0;
            const piece = game.get(sq as Square);

            const isSelected = selectedSquare === sq;
            const isLegalMove = legalMoves.includes(sq);
            const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);
            const isPremove = premove && (premove.from === sq || premove.to === sq);
            const isChecked = checkKingSquare === sq;
            const isBeingDragged = dragSquare === sq;

            // Background color computation
            let bgClass = isLight ? 'bg-[var(--square-light)]' : 'bg-[var(--square-dark)]';
            let overlayColor = '';

            if (isChecked) {
              bgClass = 'king-check';
            } else if (isPremove) {
              overlayColor = 'bg-red-500/40';
            } else if (isLastMove) {
              overlayColor = isLight ? 'bg-[var(--highlight-last-light)]/60' : 'bg-[var(--highlight-last-dark)]/60';
            }

            return (
              <div
                key={sq}
                data-square={sq}
                onClick={() => handleSquareClick(sq)}
                onPointerDown={(e) => handlePointerDown(e, sq)}
                onMouseDown={(e) => handleMouseDown(e, sq)}
                onMouseUp={(e) => handleMouseUp(e, sq)}
                className={`relative w-full h-full ${bgClass} cursor-pointer flex items-center justify-center`}
              >
                {/* Last move / premove overlay */}
                {overlayColor && <div className={`absolute inset-0 ${overlayColor} pointer-events-none`} />}

                {/* Selected square highlight */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/35 ring-2 ring-blue-500 pointer-events-none z-10" />
                )}

                {/* Rank & File coordinate labels */}
                {showCoords === 'inside' && (
                  <>
                    {colIdx === 0 && (
                      <span
                        className={`coord-label top-1 left-1.5 ${
                          isLight ? 'text-[var(--square-dark)]' : 'text-[var(--square-light)]'
                        }`}
                      >
                        {rank}
                      </span>
                    )}
                    {rowIdx === 7 && (
                      <span
                        className={`coord-label bottom-1 right-1.5 ${
                          isLight ? 'text-[var(--square-dark)]' : 'text-[var(--square-light)]'
                        }`}
                      >
                        {file}
                      </span>
                    )}
                  </>
                )}

                {/* Legal destination indicator */}
                {isLegalMove && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    {piece ? (
                      // Capturable piece: circular ring indicator
                      <div className="w-full h-full border-[6px] border-black/25 rounded-full scale-95 transition-transform hover:scale-100" />
                    ) : (
                      // Empty destination square: small dot
                      <div className="w-3.5 h-3.5 bg-black/25 rounded-full transition-transform hover:scale-125" />
                    )}
                  </div>
                )}

                {/* Chess Piece */}
                {piece && !isBeingDragged && (
                  <div className="w-[88%] h-[88%] flex items-center justify-center piece-transition z-10">
                    <ChessPiece
                      type={piece.type as PieceType}
                      color={piece.color as PieceColor}
                      style={pieceStyle}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Dragged Piece */}
      {dragSquare && dragPos && (
        <div
          className="fixed pointer-events-none z-50 piece-dragging"
          style={{
            left: dragPos.x - boardWidth / 16,
            top: dragPos.y - boardWidth / 16,
            width: boardWidth / 8,
            height: boardWidth / 8,
          }}
        >
          {(() => {
            const piece = game.get(dragSquare as Square);
            if (!piece) return null;
            return (
              <ChessPiece
                type={piece.type as PieceType}
                color={piece.color as PieceColor}
                style={pieceStyle}
                size="100%"
              />
            );
          })()}
        </div>
      )}

      {/* Canvas Layer for Arrows & Highlights */}
      <CanvasOverlay
        arrows={arrows}
        highlights={squareHighlights}
        orientation={orientation}
        boardSize={boardWidth}
      />

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={orientation}
          pieceStyle={pieceStyle}
          onSelect={(choice) => {
            executeMove(pendingPromotion.from, pendingPromotion.to, choice);
            setPendingPromotion(null);
          }}
          onCancel={() => setPendingPromotion(null)}
        />
      )}
    </div>
  );
};
