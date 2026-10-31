import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw } from 'lucide-react';
import { EvaluatedMove, MoveClassificationType } from '../../services/stockfish/evaluator';

interface MoveListProps {
  history: { san: string; from: string; to: string }[];
  currentMoveIndex: number;
  evaluatedMoves?: EvaluatedMove[];
  onSelectMove: (index: number) => void;
  onFlipBoard?: () => void;
}

export const MoveList: React.FC<MoveListProps> = ({
  history,
  currentMoveIndex,
  evaluatedMoves = [],
  onSelectMove,
  onFlipBoard,
}) => {
  // Group moves into pairs (White & Black)
  const movePairs: { num: number; white: string; black?: string; whiteIdx: number; blackIdx?: number }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i].san,
      black: history[i + 1]?.san,
      whiteIdx: i,
      blackIdx: i + 1 < history.length ? i + 1 : undefined,
    });
  }

  const renderBadge = (index: number) => {
    if (!evaluatedMoves || !evaluatedMoves[index]) return null;
    const item = evaluatedMoves[index];
    const type = item.classification;

    switch (type) {
      case 'brilliant':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1baca6] text-white text-[10px] font-black" title="Brilliant (!!)">
            !!
          </span>
        );
      case 'great':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#5c8bb0] text-white text-[10px] font-black" title="Great (!)">
            !
          </span>
        );
      case 'best':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#81b64c] text-white text-[10px] font-black" title="Best">
            ★
          </span>
        );
      case 'excellent':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#96bc4b] text-white text-[10px] font-bold" title="Excellent">
            ✓
          </span>
        );
      case 'book':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#a88865] text-white text-[9px] font-bold" title="Book move">
            📖
          </span>
        );
      case 'inaccuracy':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#e69e2c] text-white text-[10px] font-black" title="Inaccuracy (?!)">
            ?!
          </span>
        );
      case 'mistake':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#e67f22] text-white text-[10px] font-black" title="Mistake (?)">
            ?
          </span>
        );
      case 'blunder':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#fa412d] text-white text-[10px] font-black" title="Blunder (??)">
            ??
          </span>
        );
      case 'miss':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#d64040] text-white text-[10px] font-black" title="Miss">
            ✕
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#262522] rounded-lg border border-[#363431] overflow-hidden select-none">
      {/* Move list scrollable container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-28 text-chess-dim italic text-center">
            No moves played yet. Make your first move!
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.num}
              className={`flex items-center py-1 px-2 rounded hover:bg-[#312e2b] transition-colors ${
                currentMoveIndex === pair.whiteIdx || currentMoveIndex === pair.blackIdx
                  ? 'bg-[#312e2b]'
                  : ''
              }`}
            >
              {/* Move number */}
              <span className="w-8 text-chess-dim font-mono font-medium">
                {pair.num}.
              </span>

              {/* White move */}
              <button
                onClick={() => onSelectMove(pair.whiteIdx)}
                className={`flex-1 flex items-center justify-between px-2 py-0.5 rounded font-medium text-left transition-colors ${
                  currentMoveIndex === pair.whiteIdx
                    ? 'bg-[#403d39] text-white font-bold'
                    : 'text-chess-muted hover:text-white'
                }`}
              >
                <span>{pair.white}</span>
                {renderBadge(pair.whiteIdx)}
              </button>

              {/* Black move */}
              {pair.black && pair.blackIdx !== undefined ? (
                <button
                  onClick={() => onSelectMove(pair.blackIdx!)}
                  className={`flex-1 flex items-center justify-between px-2 py-0.5 rounded font-medium text-left transition-colors ${
                    currentMoveIndex === pair.blackIdx
                      ? 'bg-[#403d39] text-white font-bold'
                      : 'text-chess-muted hover:text-white'
                  }`}
                >
                  <span>{pair.black}</span>
                  {renderBadge(pair.blackIdx)}
                </button>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between p-2 bg-[#21201d] border-t border-[#363431]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectMove(-1)}
            disabled={currentMoveIndex < 0}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Start of game"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => onSelectMove(Math.max(-1, currentMoveIndex - 1))}
            disabled={currentMoveIndex < 0}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Previous move"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onSelectMove(Math.min(history.length - 1, currentMoveIndex + 1))}
            disabled={currentMoveIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Next move"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => onSelectMove(history.length - 1)}
            disabled={currentMoveIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Latest move"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        {onFlipBoard && (
          <button
            onClick={onFlipBoard}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-muted hover:text-white transition-colors"
            title="Flip board"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
