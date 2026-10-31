import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  Users,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Flag,
  Handshake,
  MessageSquare,
  Sparkles,
  Play,
  Share2,
} from 'lucide-react';
import { ChessBoard, MoveEvent } from '../board/ChessBoard';
import { ChessClock } from '../board/ChessClock';
import { MoveList } from '../board/MoveList';
import { EvalBar } from '../board/EvalBar';
import { GameReviewModal } from '../review/GameReviewModal';
import { p2pService, P2PMessage, ConnectionState } from '../../services/multiplayer/peerService';
import { stockfishEngine } from '../../services/stockfish/engine';
import { ReviewReport } from '../../services/stockfish/evaluator';
import { sound } from '../../utils/audio';
import { UserProfile, recordMatch } from '../../utils/storage';
import { CHESS_BOTS, ChessBot } from '../../data/bots';

interface PlayViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  selectedBotOverride?: ChessBot | null;
  onClearBotOverride?: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({
  userProfile,
  onUpdateProfile,
  selectedBotOverride,
  onClearBotOverride,
}) => {
  // Game instance & history
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [history, setHistory] = useState<{ from: string; to: string; san: string }[]>([]);
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Orientation
  const [orientation, setOrientation] = useState<'w' | 'b'>('w');

  // Opponent mode: 'bot' | 'p2p' | 'solo'
  const [playMode, setPlayMode] = useState<'bot' | 'p2p' | 'solo'>('bot');
  const [selectedBot, setSelectedBot] = useState<ChessBot>(
    selectedBotOverride || CHESS_BOTS[2] // Nelson by default
  );

  // Clocks
  const [timeControl, setTimeControl] = useState<{ baseSec: number; incSec: number }>({
    baseSec: 600,
    incSec: 0,
  }); // 10 min default
  const [whiteTime, setWhiteTime] = useState<number>(600 * 1000);
  const [blackTime, setBlackTime] = useState<number>(600 * 1000);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);

  // P2P Multiplayer state
  const [roomId, setRoomId] = useState<string>('');
  const [joinRoomInput, setJoinRoomInput] = useState<string>('');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Evaluation & Game Review
  const [scoreCp, setScoreCp] = useState<number>(0);
  const [mateIn, setMateIn] = useState<number | undefined>(undefined);
  const [reviewReport, setReviewReport] = useState<ReviewReport | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Game status
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [botChat, setBotChat] = useState<string>('');

  // Handle Bot Override prop
  useEffect(() => {
    if (selectedBotOverride) {
      setSelectedBot(selectedBotOverride);
      setPlayMode('bot');
      resetGame();
      onClearBotOverride?.();
    }
  }, [selectedBotOverride, onClearBotOverride]);

  // Check URL query for P2P room
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const params = new URLSearchParams(window.location.search || hash.split('?')[1]);
      const roomParam = params.get('room');
      if (roomParam) {
        setPlayMode('p2p');
        handleJoinRoom(roomParam);
      }
    }
  }, []);

  // Clocks countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockRunning && !gameOverReason) {
      interval = setInterval(() => {
        const turn = game.turn();
        if (turn === 'w') {
          setWhiteTime((prev) => {
            if (prev <= 100) {
              handleGameOver('b', 'Timeout');
              return 0;
            }
            if (prev <= 10000 && prev % 1000 < 100) sound.play('lowtime');
            return prev - 100;
          });
        } else {
          setBlackTime((prev) => {
            if (prev <= 100) {
              handleGameOver('w', 'Timeout');
              return 0;
            }
            if (prev <= 10000 && prev % 1000 < 100) sound.play('lowtime');
            return prev - 100;
          });
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isClockRunning, gameOverReason, game]);

  // Setup P2P event listeners
  useEffect(() => {
    p2pService.onStateChange((state, peerId) => {
      setConnectionState(state);
      if (peerId) setRoomId(peerId);
    });

    p2pService.onMessage((msg: P2PMessage) => {
      switch (msg.type) {
        case 'HELLO':
          // Acknowledge connection
          p2pService.sendMessage('START_GAME', { color: 'b' });
          setOrientation('w');
          resetGame();
          sound.play('start');
          break;
        case 'START_GAME':
          setOrientation(msg.payload?.color || 'b');
          resetGame();
          sound.play('start');
          break;
        case 'MOVE':
          applyMoveFromPeer(msg.payload);
          break;
        case 'RESIGN':
          handleGameOver(orientation, 'Opponent resigned');
          break;
        case 'DRAW_OFFER':
          if (confirm('Opponent offered a draw. Accept?')) {
            p2pService.sendMessage('DRAW_ACCEPT');
            handleGameOver('draw', 'Draw by agreement');
          } else {
            p2pService.sendMessage('DRAW_DECLINE');
          }
          break;
        case 'DRAW_ACCEPT':
          handleGameOver('draw', 'Draw agreed');
          break;
        case 'CHAT_MESSAGE':
          setChatMessages((prev) => [...prev, msg.payload]);
          break;
      }
    });

    return () => {
      p2pService.disconnect();
    };
  }, [orientation]);

  // Reset Game
  const resetGame = () => {
    const newG = new Chess();
    setGame(newG);
    setHistory([]);
    setCurrentMoveIdx(-1);
    setLastMove(null);
    setScoreCp(0);
    setMateIn(undefined);
    setGameOverReason(null);
    setReviewReport(null);
    setIsReviewOpen(false);
    setWhiteTime(timeControl.baseSec * 1000);
    setBlackTime(timeControl.baseSec * 1000);
    setIsClockRunning(false);
    if (playMode === 'bot') {
      setBotChat(selectedBot.quote);
    }
  };

  // Bot reaction & move logic
  const triggerBotMove = (currentGame: Chess) => {
    if (currentGame.isGameOver() || gameOverReason) return;

    // Small thinking delay for realistic human feeling
    setTimeout(() => {
      const fen = currentGame.fen();
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) return;

      let chosenMove = moves[0];

      // Check deliberate blunder injection based on bot rating
      const willBlunder = Math.random() < selectedBot.blunderRate;
      if (willBlunder && moves.length > 1) {
        // Pick a suboptimal or random move
        chosenMove = moves[Math.floor(Math.random() * moves.length)];
      } else {
        // Evaluate with Stockfish engine
        const evalRes = stockfishEngine.evaluatePosition(fen, selectedBot.depth);
        if (evalRes.bestMoveSan) {
          const matched = moves.find((m) => m.san === evalRes.bestMoveSan);
          if (matched) chosenMove = matched;
        }
      }

      try {
        const moveObj = currentGame.move(chosenMove);
        if (moveObj) {
          const nextChess = new Chess(currentGame.fen());
          setGame(nextChess);
          setLastMove({ from: moveObj.from, to: moveObj.to });

          const newHist = [
            ...history,
            { from: moveObj.from, to: moveObj.to, san: moveObj.san },
          ];
          setHistory(newHist);
          setCurrentMoveIdx(newHist.length - 1);

          // Bot comments
          if (moveObj.captured) {
            setBotChat(
              selectedBot.id === 'gotham'
                ? 'And he sacrificed... THE PIECE!'
                : `Got your piece! Let's see what you do next.`
            );
          } else if (moveObj.san.includes('+')) {
            setBotChat(`Check! Watch your king carefully.`);
          }

          // Evaluate new position
          const nextEval = stockfishEngine.evaluatePosition(nextChess.fen(), 2);
          setScoreCp(nextEval.cp);
          setMateIn(nextEval.mate);

          checkGameEndCondition(nextChess);
        }
      } catch (err) {
        console.error('Bot move failed:', err);
      }
    }, 450);
  };

  // Move handler from board
  const handlePlayerMove = (moveEv: MoveEvent) => {
    if (gameOverReason) return;

    setIsClockRunning(true);
    const updatedHistory = [
      ...history,
      { from: moveEv.from, to: moveEv.to, san: moveEv.san },
    ];
    setHistory(updatedHistory);
    setCurrentMoveIdx(updatedHistory.length - 1);
    setLastMove({ from: moveEv.from, to: moveEv.to });

    // P2P dispatch
    if (playMode === 'p2p' && connectionState === 'connected') {
      p2pService.sendMessage('MOVE', {
        from: moveEv.from,
        to: moveEv.to,
        promotion: moveEv.promotion,
        san: moveEv.san,
      });
    }

    // Centipawn evaluation update
    const currentChess = new Chess(game.fen());
    const evalRes = stockfishEngine.evaluatePosition(currentChess.fen(), 2);
    setScoreCp(evalRes.cp);
    setMateIn(evalRes.mate);

    const ended = checkGameEndCondition(currentChess);
    if (!ended && playMode === 'bot') {
      triggerBotMove(currentChess);
    }
  };

  // Peer move apply
  const applyMoveFromPeer = (moveData: { from: string; to: string; promotion?: string }) => {
    try {
      const move = game.move({
        from: moveData.from,
        to: moveData.to,
        promotion: (moveData.promotion || 'q') as any,
      });
      if (move) {
        sound.play(move.captured ? 'capture' : move.san.includes('+') ? 'check' : 'move');
        const nextChess = new Chess(game.fen());
        setGame(nextChess);
        setLastMove({ from: move.from, to: move.to });

        const updatedHistory = [
          ...history,
          { from: move.from, to: move.to, san: move.san },
        ];
        setHistory(updatedHistory);
        setCurrentMoveIdx(updatedHistory.length - 1);

        checkGameEndCondition(nextChess);
      }
    } catch (err) {
      console.warn('Failed to apply peer move:', err);
    }
  };

  // Check Game End Condition
  const checkGameEndCondition = (chess: Chess) => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'b' : 'w';
      handleGameOver(winner, 'Checkmate');
      return true;
    }
    if (chess.isDraw()) {
      handleGameOver('draw', 'Draw by Stalemate / Insufficient Material');
      return true;
    }
    return false;
  };

  // Handle Game Over
  const handleGameOver = (winner: 'w' | 'b' | 'draw', reason: string) => {
    setIsClockRunning(false);
    setGameOverReason(reason);
    sound.play('end');

    const didWin = winner === orientation;
    const resultType = winner === 'draw' ? 'draw' : didWin ? 'win' : 'loss';

    if (didWin) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    // Run 100% Free Unlocked Game Review automatically!
    const report = stockfishEngine.analyzeGame(history);
    setReviewReport(report);

    // Save to match history
    const opponentName =
      playMode === 'bot' ? `${selectedBot.name} (Bot)` : 'Online Peer';
    const opponentElo = playMode === 'bot' ? selectedBot.elo : 1200;

    const updatedProfile = recordMatch(userProfile, {
      opponent: opponentName,
      opponentElo,
      playerColor: orientation,
      result: resultType,
      reason,
      timeControl: `${Math.floor(timeControl.baseSec / 60)} min`,
      movesCount: history.length,
      accuracy: orientation === 'w' ? report.whiteAccuracy : report.blackAccuracy,
      moves: history,
    });
    onUpdateProfile(updatedProfile);
  };

  // P2P Room Creation
  const handleCreateRoom = async () => {
    try {
      const id = await p2pService.initialize();
      setRoomId(id);
      setPlayMode('p2p');
      setOrientation('w');
      resetGame();
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  // P2P Join Room
  const handleJoinRoom = async (targetId: string) => {
    try {
      await p2pService.initialize();
      p2pService.connectToRoom(targetId);
      setOrientation('b');
      setPlayMode('p2p');
      resetGame();
    } catch (err) {
      console.error('Failed to connect to room:', err);
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/play?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Move inspection (clicking move history)
  const handleSelectMove = (index: number) => {
    if (index < 0) {
      // Starting position
      setGame(new Chess());
      setCurrentMoveIdx(-1);
      setLastMove(null);
      return;
    }

    const replay = new Chess();
    for (let i = 0; i <= index; i++) {
      replay.move(history[i]);
    }
    setGame(replay);
    setCurrentMoveIdx(index);
    setLastMove({ from: history[index].from, to: history[index].to });
  };

  const isPlayerTurn =
    (orientation === 'w' && game.turn() === 'w') ||
    (orientation === 'b' && game.turn() === 'b');

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start max-w-7xl mx-auto p-3 sm:p-4 w-full">
      {/* Board & Clocks Column */}
      <div className="w-full lg:w-[560px] shrink-0 flex flex-col items-center">
        {/* Opponent Clock */}
        <div className="w-full mb-2">
          <ChessClock
            timeMs={orientation === 'w' ? blackTime : whiteTime}
            isActive={isClockRunning && game.turn() !== orientation}
            color={orientation === 'w' ? 'b' : 'w'}
            playerName={playMode === 'bot' ? selectedBot.name : 'Opponent'}
            playerAvatar={playMode === 'bot' ? selectedBot.avatar : '👤'}
            playerElo={playMode === 'bot' ? selectedBot.elo : 1200}
          />
        </div>

        {/* Board with side Eval Bar */}
        <div className="flex gap-2 w-full">
          {userProfile.preferences.showEvalBar && (
            <EvalBar
              scoreCp={scoreCp}
              mate={mateIn}
              orientation={orientation}
              height="100%"
            />
          )}

          <div className="flex-1">
            <ChessBoard
              game={game}
              orientation={orientation}
              theme={userProfile.preferences.theme}
              pieceStyle={userProfile.preferences.pieceStyle}
              showCoords={userProfile.preferences.showCoords}
              showLegalMoves={userProfile.preferences.showLegalMoves}
              allowPremoves={userProfile.preferences.allowPremoves}
              interactive={!gameOverReason && (playMode === 'solo' || isPlayerTurn)}
              lastMove={lastMove}
              onMove={handlePlayerMove}
            />
          </div>
        </div>

        {/* Player Clock */}
        <div className="w-full mt-2">
          <ChessClock
            timeMs={orientation === 'w' ? whiteTime : blackTime}
            isActive={isClockRunning && isPlayerTurn}
            color={orientation}
            playerName={userProfile.username}
            playerAvatar={userProfile.avatar}
            playerElo={userProfile.eloBlitz}
          />
        </div>

        {/* Game Over Banner */}
        {gameOverReason && (
          <div className="w-full mt-3 p-3.5 bg-[#262522] border-2 border-chess-green rounded-xl flex items-center justify-between shadow-xl animate-fade-in">
            <div>
              <span className="text-xs font-bold text-chess-green uppercase tracking-wider block">
                Game Finished
              </span>
              <span className="text-sm font-bold text-white">
                {gameOverReason}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsReviewOpen(true)}
                className="py-1.5 px-3 bg-chess-green hover:bg-chess-greenHover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow"
              >
                <Sparkles size={14} />
                Game Review
              </button>
              <button
                onClick={resetGame}
                className="py-1.5 px-3 bg-[#312e2b] hover:bg-[#3d3a36] text-white text-xs font-bold rounded-lg transition-colors border border-[#403d39]"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel & Moves Column */}
      <div className="flex-1 w-full flex flex-col h-[560px] space-y-3">
        {/* Mode Selector Header */}
        <div className="flex items-center justify-between bg-[#262522] p-1.5 rounded-lg border border-[#363431]">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setPlayMode('bot');
                resetGame();
              }}
              className={`py-1.5 px-3 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                playMode === 'bot'
                  ? 'bg-chess-green text-white shadow'
                  : 'text-chess-muted hover:text-white'
              }`}
            >
              <Bot size={14} />
              AI Bot
            </button>
            <button
              onClick={() => {
                setPlayMode('p2p');
                handleCreateRoom();
              }}
              className={`py-1.5 px-3 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                playMode === 'p2p'
                  ? 'bg-chess-green text-white shadow'
                  : 'text-chess-muted hover:text-white'
              }`}
            >
              <Users size={14} />
              Online P2P
            </button>
            <button
              onClick={() => {
                setPlayMode('solo');
                resetGame();
              }}
              className={`py-1.5 px-3 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                playMode === 'solo'
                  ? 'bg-chess-green text-white shadow'
                  : 'text-chess-muted hover:text-white'
              }`}
            >
              <Play size={14} />
              Solo Analysis
            </button>
          </div>

          <button
            onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
            className="p-1.5 rounded hover:bg-[#312e2b] text-chess-dim hover:text-white transition-colors"
            title="Flip board"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* P2P Multiplayer Room Share Widget */}
        {playMode === 'p2p' && (
          <div className="bg-[#262522] p-3 rounded-lg border border-[#363431] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Share2 size={14} className="text-chess-green" />
                P2P Room Invite
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  connectionState === 'connected'
                    ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                    : 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {connectionState === 'connected' ? 'Connected' : 'Waiting for Peer'}
              </span>
            </div>

            {roomId && (
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}${window.location.pathname}#/play?room=${roomId}`}
                  className="flex-1 bg-[#21201d] border border-[#363431] rounded px-2.5 py-1 text-xs text-chess-dim font-mono select-all outline-none"
                />
                <button
                  onClick={copyRoomLink}
                  className="py-1 px-3 bg-[#312e2b] hover:bg-chess-green text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors border border-[#403d39]"
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bot Dialogue Card */}
        {playMode === 'bot' && botChat && (
          <div className="bg-[#262522] p-2.5 rounded-lg border border-[#363431] flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0"
              style={{ backgroundColor: selectedBot.avatarBg }}
            >
              {selectedBot.avatar}
            </div>
            <p className="text-xs text-chess-muted italic line-clamp-1">
              "{botChat}"
            </p>
          </div>
        )}

        {/* Move History Component */}
        <div className="flex-1 min-h-0">
          <MoveList
            history={history}
            currentMoveIndex={currentMoveIdx}
            evaluatedMoves={reviewReport?.moves}
            onSelectMove={handleSelectMove}
            onFlipBoard={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
          />
        </div>

        {/* Game Control Actions: Resign, Draw, Review */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => handleGameOver(orientation === 'w' ? 'b' : 'w', 'Resignation')}
            disabled={history.length === 0 || !!gameOverReason}
            className="flex-1 py-2 bg-[#262522] hover:bg-[#312e2b] text-chess-dim hover:text-red-400 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#363431] disabled:opacity-40"
          >
            <Flag size={14} />
            Resign
          </button>
          <button
            onClick={() => {
              if (playMode === 'p2p') {
                p2pService.sendMessage('DRAW_OFFER');
              } else {
                handleGameOver('draw', 'Draw agreed');
              }
            }}
            disabled={history.length === 0 || !!gameOverReason}
            className="flex-1 py-2 bg-[#262522] hover:bg-[#312e2b] text-chess-dim hover:text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#363431] disabled:opacity-40"
          >
            <Handshake size={14} />
            Draw
          </button>
          <button
            onClick={() => {
              const report = stockfishEngine.analyzeGame(history);
              setReviewReport(report);
              setIsReviewOpen(true);
            }}
            disabled={history.length === 0}
            className="flex-1 py-2 bg-chess-green hover:bg-chess-greenHover text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow disabled:opacity-40"
          >
            <Sparkles size={14} />
            Review
          </button>
        </div>
      </div>

      {/* 100% Free Unlocked Game Review Modal */}
      {isReviewOpen && reviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-[90vh]">
            <GameReviewModal
              report={reviewReport}
              currentMoveIndex={currentMoveIdx}
              onSelectMove={(idx) => {
                handleSelectMove(idx);
                setIsReviewOpen(false);
              }}
              onClose={() => setIsReviewOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
