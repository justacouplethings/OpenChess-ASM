export interface OpeningData {
  id: string;
  name: string;
  eco: string;
  moves: string;
  fen: string;
  description: string;
  stats: {
    whiteWin: number;
    draw: number;
    blackWin: number;
  };
  topMoves: {
    move: string;
    san: string;
    games: string;
    whitePct: number;
    drawPct: number;
    blackPct: number;
  }[];
}

export const OPENINGS_DATABASE: OpeningData[] = [
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    eco: 'B20',
    moves: '1. e4 c5',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    description: 'The most popular and aggressive response to 1. e4. Black fights for central d4 asymmetry immediately.',
    stats: { whiteWin: 37, draw: 32, blackWin: 31 },
    topMoves: [
      { move: 'Nf3', san: 'Nf3', games: '850K', whitePct: 38, drawPct: 34, blackPct: 28 },
      { move: 'Nc3', san: 'Nc3', games: '210K', whitePct: 37, drawPct: 32, blackPct: 31 },
      { move: 'c3', san: 'c3', games: '145K', whitePct: 36, drawPct: 35, blackPct: 29 },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Spanish Game)',
    eco: 'C60',
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description: 'One of the oldest and most deeply analyzed openings in chess history. White targets the knight defending e5.',
    stats: { whiteWin: 39, draw: 35, blackWin: 26 },
    topMoves: [
      { move: 'a6', san: 'a6', games: '620K', whitePct: 38, drawPct: 36, blackPct: 26 },
      { move: 'Nf6', san: 'Nf6', games: '190K', whitePct: 39, drawPct: 35, blackPct: 26 },
      { move: 'd6', san: 'd6', games: '45K', whitePct: 41, drawPct: 33, blackPct: 26 },
    ],
  },
  {
    id: 'italian-game',
    name: 'Italian Game (Giuoco Piano)',
    eco: 'C50',
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description: 'A romantic classical opening focusing on rapid kingside development and immediate pressure on f7.',
    stats: { whiteWin: 38, draw: 33, blackWin: 29 },
    topMoves: [
      { move: 'Bc5', san: 'Bc5', games: '430K', whitePct: 38, drawPct: 34, blackPct: 28 },
      { move: 'Nf6', san: 'Nf6', games: '380K', whitePct: 37, drawPct: 33, blackPct: 30 },
      { move: 'Be7', san: 'Be7', games: '25K', whitePct: 40, drawPct: 32, blackPct: 28 },
    ],
  },
  {
    id: 'queens-gambit',
    name: 'Queen’s Gambit',
    eco: 'D06',
    moves: '1. d4 d5 2. c4',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    description: 'White offers a flank wing pawn to obtain superior central domination. Black can accept (QGA) or decline (QGD).',
    stats: { whiteWin: 40, draw: 36, blackWin: 24 },
    topMoves: [
      { move: 'e6', san: 'e6', games: '540K', whitePct: 39, drawPct: 38, blackPct: 23 },
      { move: 'c6', san: 'c6', games: '380K', whitePct: 38, drawPct: 37, blackPct: 25 },
      { move: 'dxc4', san: 'dxc4', games: '190K', whitePct: 42, drawPct: 34, blackPct: 24 },
    ],
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    eco: 'B10',
    moves: '1. e4 c6',
    fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    description: 'A solid, resilient defensive weapon. Black prepares d5 while keeping the c8 bishop completely unblocked.',
    stats: { whiteWin: 37, draw: 36, blackWin: 27 },
    topMoves: [
      { move: 'd4', san: 'd4', games: '490K', whitePct: 38, drawPct: 35, blackPct: 27 },
      { move: 'Nc3', san: 'Nc3', games: '95K', whitePct: 36, drawPct: 34, blackPct: 30 },
      { move: 'd3', san: 'd3', games: '40K', whitePct: 35, drawPct: 36, blackPct: 29 },
    ],
  },
  {
    id: 'french-defense',
    name: 'French Defense',
    eco: 'C00',
    moves: '1. e4 e6',
    fen: 'rnbqkbnr/pppp1ppp/4p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    description: 'A counter-attacking stronghold. Black builds a solid pawn chain and counterpunches with c5.',
    stats: { whiteWin: 39, draw: 31, blackWin: 30 },
    topMoves: [
      { move: 'd4', san: 'd4', games: '580K', whitePct: 39, drawPct: 31, blackPct: 30 },
      { move: 'd3', san: 'd3', games: '45K', whitePct: 36, drawPct: 32, blackPct: 32 },
    ],
  },
  {
    id: 'kings-indian',
    name: 'King’s Indian Defense (KID)',
    eco: 'E60',
    moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7',
    fen: 'rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
    description: 'Hypermodern masterpiece. Black cedes the center early to launch a savage kingside onslaught later.',
    stats: { whiteWin: 41, draw: 31, blackWin: 28 },
    topMoves: [
      { move: 'e4', san: 'e4', games: '380K', whitePct: 41, drawPct: 31, blackPct: 28 },
      { move: 'Nf3', san: 'Nf3', games: '140K', whitePct: 40, drawPct: 33, blackPct: 27 },
    ],
  },
  {
    id: 'london-system',
    name: 'London System',
    eco: 'D02',
    moves: '1. d4 d5 2. Bf4',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2',
    description: 'An impenetrable, universal setup for White. Develops the dark-squared bishop early outside the pawn chain.',
    stats: { whiteWin: 38, draw: 35, blackWin: 27 },
    topMoves: [
      { move: 'Nf6', san: 'Nf6', games: '310K', whitePct: 38, drawPct: 35, blackPct: 27 },
      { move: 'c5', san: 'c5', games: '120K', whitePct: 37, drawPct: 34, blackPct: 29 },
    ],
  },
];
