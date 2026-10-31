import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import { Flame, RefreshCw, Eye, CheckCircle2, XCircle, Trophy, ArrowRight, Zap } from 'lucide-react';
import { ChessBoard, MoveEvent } from '../board/ChessBoard';
import { PUZZLES_DATABASE, ChessPuzzle } from '../../data/puzzles';
import { sound } from '../../utils/audio';
import { BoardTheme, UserProfile, saveUserProfile } from '../../utils/storage';
import { PieceStyle } from '../pieces/PieceSet';

interface PuzzlesViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  theme: BoardTheme;
  pieceStyle: PieceStyle;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({
  userProfile,
  onUpdateProfile,
  theme,
  pieceStyle,
}) => {
  const [mode, setMode] = useState<'standard' | 'rush'>('standard');

  // Standard Puzzle state
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle: ChessPuzzle = PUZZLES_DATABASE[puzzleIndex] || PUZZLES_DATABASE[0];
  const [game, setGame] = useState<Chess>(() => new Chess(currentPuzzle.fen));
  const [stepIndex, setStepIndex] = useState(0); // index in currentPuzzle.solution
  const [status, setStatus] = useState<'solving' | 'correct' | 'wrong' | 'completed'>('solving');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Puzzle Rush state
  const [rushTimeLeft, setRushTimeLeft] = useState(180); // 3 minutes default
  const [rushScore, setRushScore] = useState(0);
  const [rushStrikes, setRushStrikes] = useState(0);
  const [isRushActive, setIsRushActive] = useState(false);
  const [rushModeType, setRushModeType] = useState<'3m' | '5m' | 'survival'>('3m');
  const [rushOver, setRushOver] = useState(false);

  // Load puzzle
  const loadPuzzle = (index: number) => {
    const pz = PUZZLES_DATABASE[index % PUZZLES_DATABASE.length];
    setPuzzleIndex(index % PUZZLES_DATABASE.length);
    setGame(new Chess(pz.fen));
    setStepIndex(0);
    setStatus('solving');
    setLastMove(null);
  };

  // Puzzle Rush timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRushActive && !rushOver && rushModeType !== 'survival') {
      timer = setInterval(() => {
        setRushTimeLeft((prev) => {
          if (prev <= 1) {
            handleRushEnd();
            return 0;
          }
          if (prev === 10) sound.play('lowtime');
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRushActive, rushOver, rushModeType]);

  const startRush = (type: '3m' | '5m' | 'survival') => {
    setRushModeType(type);
    setRushScore(0);
    setRushStrikes(0);
    setRushTimeLeft(type === '3m' ? 180 : type === '5m' ? 300 : 999999);
    setIsRushActive(true);
    setRushOver(false);
    loadPuzzle(0);
    sound.play('start');
  };

  const handleRushEnd = () => {
    setIsRushActive(false);
    setRushOver(true);
    sound.play('end');

    // Update high score
    if (rushScore > userProfile.puzzleRushHighscore3m) {
      const updated = {
        ...userProfile,
        puzzleRushHighscore3m: Math.max(userProfile.puzzleRushHighscore3m, rushScore),
      };
      onUpdateProfile(updated);
      saveUserProfile(updated);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Puzzle Move handler
  const handleMove = (moveEv: MoveEvent) => {
    if (status === 'completed' || (isRushActive && rushOver)) return;

    const expectedSan = currentPuzzle.solution[stepIndex];

    if (moveEv.san === expectedSan) {
      // Correct move
      const nextStep = stepIndex + 1;

      if (nextStep >= currentPuzzle.solution.length) {
        // Puzzle fully completed!
        setStatus('completed');
        sound.play('promote');

        if (mode === 'rush') {
          setRushScore((s) => s + 1);
          // Advance to next puzzle immediately
          setTimeout(() => {
            loadPuzzle(puzzleIndex + 1);
          }, 350);
        } else {
          // Increase user puzzle ELO rating
          const updatedElo = userProfile.eloPuzzles + 12;
          const updated = { ...userProfile, eloPuzzles: updatedElo };
          onUpdateProfile(updated);
          saveUserProfile(updated);
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
        }
      } else {
        // Play opponent response
        setStepIndex(nextStep);
        setStatus('solving');

        setTimeout(() => {
          const opponentMoveSan = currentPuzzle.solution[nextStep];
          try {
            const reply = game.move(opponentMoveSan);
            if (reply) {
              setGame(new Chess(game.fen()));
              setLastMove({ from: reply.from, to: reply.to });
              sound.play(reply.captured ? 'capture' : 'move');
              setStepIndex(nextStep + 1);
            }
          } catch {
            // Completed
            setStatus('completed');
          }
        }, 400);
      }
    } else {
      // Incorrect move
      sound.play('illegal');
      setStatus('wrong');

      if (mode === 'rush') {
        const nextStrikes = rushStrikes + 1;
        setRushStrikes(nextStrikes);
        if (nextStrikes >= 3) {
          handleRushEnd();
        } else {
          // Skip to next puzzle
          setTimeout(() => {
            loadPuzzle(puzzleIndex + 1);
          }, 450);
        }
      }
    }
  };

  const handleRetry = () => {
    setGame(new Chess(currentPuzzle.fen));
    setStepIndex(0);
    setStatus('solving');
    setLastMove(null);
  };

  const handleNextPuzzle = () => {
    loadPuzzle(puzzleIndex + 1);
  };

  const puzzleTurn = game.turn();
  const orientation = currentPuzzle.fen.includes(' w ') ? 'w' : 'b';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start max-w-6xl mx-auto p-4 w-full">
      {/* Chessboard Column */}
      <div className="w-full lg:w-[560px] shrink-0 flex flex-col items-center">
        {/* Puzzle status header */}
        <div className="w-full flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              {orientation === 'w' ? 'White to move' : 'Black to move'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#363431] text-chess-dim font-mono">
              Rating: {currentPuzzle.rating}
            </span>
          </div>

          {mode === 'rush' && isRushActive && (
            <div className="flex items-center gap-4">
              {/* Strikes */}
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((idx) => (
                  <span
                    key={idx}
                    className={`text-sm font-black ${
                      idx < rushStrikes ? 'text-red-500' : 'text-chess-border'
                    }`}
                  >
                    ✕
                  </span>
                ))}
              </div>

              {/* Timer */}
              {rushModeType !== 'survival' && (
                <span className="text-sm font-mono font-bold text-amber-400">
                  {Math.floor(rushTimeLeft / 60)}:
                  {String(rushTimeLeft % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          )}
        </div>

        <ChessBoard
          game={game}
          orientation={orientation}
          theme={theme}
          pieceStyle={pieceStyle}
          interactive={status === 'solving' && (!isRushActive || !rushOver)}
          lastMove={lastMove}
          onMove={handleMove}
        />
      </div>

      {/* Control & Mode Sidebar Column */}
      <div className="flex-1 w-full space-y-4">
        {/* Mode Selector Tabs */}
        <div className="flex bg-[#262522] p-1 rounded-lg border border-[#363431]">
          <button
            onClick={() => {
              setMode('standard');
              setIsRushActive(false);
              loadPuzzle(puzzleIndex);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              mode === 'standard'
                ? 'bg-chess-green text-white shadow'
                : 'text-chess-muted hover:text-white'
            }`}
          >
            <Trophy size={16} />
            Rated Puzzles
          </button>
          <button
            onClick={() => {
              setMode('rush');
              setIsRushActive(false);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
              mode === 'rush'
                ? 'bg-amber-600 text-white shadow'
                : 'text-chess-muted hover:text-white'
            }`}
          >
            <Zap size={16} />
            Puzzle Rush
          </button>
        </div>

        {/* Standard Puzzle Mode Card */}
        {mode === 'standard' && (
          <div className="bg-[#262522] rounded-xl p-5 border border-[#363431] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-chess-green uppercase tracking-wider">
                  {currentPuzzle.theme}
                </span>
                <span className="text-xs text-chess-dim font-mono">
                  Your Rating: {userProfile.eloPuzzles}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {currentPuzzle.title}
              </h2>
              <p className="text-xs text-chess-muted leading-relaxed">
                {currentPuzzle.description}
              </p>
            </div>

            {/* Status alerts */}
            {status === 'completed' && (
              <div className="p-3 bg-green-950/60 border border-green-600/40 rounded-lg flex items-center gap-2 text-green-300 text-sm font-semibold animate-fade-in">
                <CheckCircle2 size={18} />
                <span>Solved! +12 Rating points awarded.</span>
              </div>
            )}

            {status === 'wrong' && (
              <div className="p-3 bg-red-950/60 border border-red-600/40 rounded-lg flex items-center gap-2 text-red-300 text-sm font-semibold animate-fade-in">
                <XCircle size={18} />
                <span>That is not the winning move. Try again!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {status === 'wrong' && (
                <button
                  onClick={handleRetry}
                  className="flex-1 py-2.5 px-4 bg-[#312e2b] hover:bg-[#3d3a36] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#403d39]"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              )}

              <button
                onClick={handleNextPuzzle}
                className="flex-1 py-2.5 px-4 bg-chess-green hover:bg-chess-greenHover text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-chess-green/20"
              >
                Next Puzzle
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Puzzle Rush Mode Card */}
        {mode === 'rush' && (
          <div className="bg-[#262522] rounded-xl p-5 border border-[#363431] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="text-amber-500" size={24} />
                <h2 className="text-lg font-bold text-white">Puzzle Rush</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-chess-dim block">Personal Best</span>
                <span className="text-sm font-mono font-bold text-white">
                  {userProfile.puzzleRushHighscore3m} solved
                </span>
              </div>
            </div>

            {!isRushActive && !rushOver ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-chess-muted leading-relaxed">
                  Solve as many tactical puzzles as you can before time expires or you receive 3 strikes!
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => startRush('3m')}
                    className="py-3 px-2 bg-[#312e2b] hover:bg-amber-600 text-white font-bold text-xs rounded-lg border border-[#403d39] hover:border-amber-500 transition-all text-center"
                  >
                    3 Minutes
                  </button>
                  <button
                    onClick={() => startRush('5m')}
                    className="py-3 px-2 bg-[#312e2b] hover:bg-amber-600 text-white font-bold text-xs rounded-lg border border-[#403d39] hover:border-amber-500 transition-all text-center"
                  >
                    5 Minutes
                  </button>
                  <button
                    onClick={() => startRush('survival')}
                    className="py-3 px-2 bg-[#312e2b] hover:bg-amber-600 text-white font-bold text-xs rounded-lg border border-[#403d39] hover:border-amber-500 transition-all text-center"
                  >
                    Survival
                  </button>
                </div>
              </div>
            ) : rushOver ? (
              <div className="text-center py-6 space-y-3 animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <h3 className="text-xl font-black text-white">Run Complete!</h3>
                <p className="text-2xl font-mono font-bold text-amber-400">
                  {rushScore} Puzzles Solved
                </p>
                <button
                  onClick={() => startRush(rushModeType)}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-lg transition-colors shadow"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#312e2b] border border-[#403d39]">
                  <span className="text-xs text-chess-muted font-semibold">Current Score</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {rushScore}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
