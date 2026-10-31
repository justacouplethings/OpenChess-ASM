export interface ChessPuzzle {
  id: string;
  title: string;
  theme: string;
  rating: number;
  fen: string;
  // Moves in standard SAN or UCI: [playerMove, opponentReply, playerNextMove...]
  solution: string[];
  description: string;
}

export const PUZZLES_DATABASE: ChessPuzzle[] = [
  {
    id: 'pz-01',
    title: 'Classic Back-Rank Mate',
    theme: 'Back Rank Mate',
    rating: 800,
    fen: '6k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1',
    solution: ['Qe8#'],
    description: 'Black’s king is trapped behind a wall of pawns. Deliver checkmate on the back rank!',
  },
  {
    id: 'pz-02',
    title: 'Smothered Mate Legacy',
    theme: 'Smothered Mate',
    rating: 1350,
    fen: '6k1/5ppp/8/8/8/5N2/5PPP/4Q1K1 w - - 0 1',
    solution: ['Qe8#'],
    description: 'Capitalize on the restricted back rank to seal the king.',
  },
  {
    id: 'pz-03',
    title: 'Royal Fork',
    theme: 'Fork',
    rating: 1100,
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 1 5',
    solution: ['a3', 'Bxc3+', 'bxc3'],
    description: 'Defend and consolidate piece control.',
  },
  {
    id: 'pz-04',
    title: 'Deadly Knight Fork on c7',
    theme: 'Fork',
    rating: 1250,
    fen: 'r1bqk2r/pp1p1ppp/2n1pn2/2b5/2P5/2N2NP1/PP2PPBP/R1BQK2R w KQkq - 0 7',
    solution: ['O-O', 'O-O'],
    description: 'Ensure king safety before launching central pressure.',
  },
  {
    id: 'pz-05',
    title: 'Deflection of the Guard',
    theme: 'Deflection',
    rating: 1450,
    fen: '3r2k1/p4ppp/1p6/8/8/1Q2B3/PP3PPP/3r2K1 w - - 0 1',
    solution: ['Qxd1', 'Rxd1'],
    description: 'Deflect the defender and simplify to a winning endgame.',
  },
  {
    id: 'pz-06',
    title: 'Queen Sacrifice for Smothered Mate',
    theme: 'Smothered Mate',
    rating: 1650,
    fen: 'r1b2rk1/pp3ppp/8/8/2B5/5Q2/P4PPP/4R1K1 w - - 0 1',
    solution: ['Qxf7+', 'Rxf7', 'Re8#'],
    description: 'Sacrifice the queen to exploit the pinned rook on the back rank!',
  },
  {
    id: 'pz-07',
    title: 'Anastasia’s Mate',
    theme: 'Mating Net',
    rating: 1550,
    fen: '5rk1/1p3ppp/p7/4N3/8/8/PPr2PPP/3R2K1 w - - 0 1',
    solution: ['Nd7', 'Re8'],
    description: 'Trap the opponent king against the edge of the board.',
  },
  {
    id: 'pz-08',
    title: 'Skewer the Heavy Pieces',
    theme: 'Skewer',
    rating: 1200,
    fen: '4k3/8/8/8/8/8/4R3/4K1q1 w - - 0 1',
    solution: ['Kd2+', 'Kf8'],
    description: 'Escape check and set up discovery opportunities.',
  },
  {
    id: 'pz-09',
    title: 'Pin and Win the Queen',
    theme: 'Pin',
    rating: 1300,
    fen: 'r1b1k2r/ppppqppp/2n5/4P3/2B5/5N2/PPP2PPP/RN1QK2R w KQkq - 0 8',
    solution: ['O-O', 'O-O'],
    description: 'Break the pin against your king.',
  },
  {
    id: 'pz-10',
    title: 'Greek Gift Sacrifice (Bxh7+)',
    theme: 'Sacrifice',
    rating: 1750,
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7',
    solution: ['O-O', 'h6'],
    description: 'Prepare king-side piece bombardment.',
  },
  {
    id: 'pz-11',
    title: 'Boden’s Mate with Bishop Pair',
    theme: 'Checkmate Pattern',
    rating: 1600,
    fen: '2kr3r/pp1n1ppp/2p1pn2/8/8/2B3N1/PPP1BPPP/2KR4 w - - 0 1',
    solution: ['Ba5', 'b6'],
    description: 'Slice the crisscrossing diagonals across the enemy king.',
  },
  {
    id: 'pz-12',
    title: 'Double Check Avalanche',
    theme: 'Discovered Attack',
    rating: 1800,
    fen: 'r1b2rk1/pppp1ppp/8/8/1b1N4/2N5/PPP2PPP/R1BQK2R w KQ - 0 1',
    solution: ['O-O', 'Bxc3', 'bxc3'],
    description: 'Neutralize threats and maintain superior piece activity.',
  },
];
