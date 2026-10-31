# openchess.com (OpenChess)

A complete, production-ready, 1-to-1 open-source clone of Chess.com featuring client-side Stockfish engine analysis, serverless WebRTC peer-to-peer multiplayer, unlimited tactical puzzles, Puzzle Rush, authentic AI personality bots, real-time evaluation graphs, and 100% unlocked paywall-free Game Reviews.

---

## 🌟 Key Features

### 1. Pixel-Perfect Board Engine & Authentic Styling
- **Hardware-Accelerated Piece Sliding**: Smooth 220ms CSS cubic-bezier transition when pieces are moved.
- **Dual Movement Modes**: Smooth drag-and-drop piece manipulation with drop-shadow floating piece and click-to-select square highlights.
- **Visual Feedback**:
  - Translucent yellow last-move overlay
  - Blue ring selection indicators
  - Circular dots for empty legal squares & hollow circular rings for capturable targets
  - Radial red gradient for King in check
  - Translucent red premove queue indicator
- **Right-Click Canvas Annotations**: Draw green, orange (`Alt`), red (`Shift`), and blue (`Ctrl`) arrows and square highlight overlays directly on the board.
- **6 Authentic Board Themes**:
  - Default Green (`#eeeed2` / `#769656`)
  - Natural Wood (`#e8c39e` / `#9e6a38`)
  - Frosted Glass (`#70a4a2` / `#3a6b68`)
  - Slate Marble (`#e2e8f0` / `#64748b`)
  - Cyber Neon (`#4deeea` / `#0f3854`)
  - Gothic Clay (`#c4b79b` / `#6b4c35`)
- **6 Vector SVG Piece Sets**:
  - **Neo** (Chess.com flagship modern vector set)
  - **Classic** (Staunton traditional carved pieces)
  - **Alpha** (Minimalist modern flat vectors)
  - **Wood** (Warm textured gradient carved wood)
  - **8-Bit** (Retro arcade pixel art sprites)
  - **3D** (Tactile beveled depth and gloss figurines)

### 2. High-Fidelity Web Audio API Synthesizer
Zero-dependency, instantaneous client-side sound engine:
- `move-self`: Crisp wooden board tap
- `capture`: Sharp piece capture knock
- `move-check`: High dual-tone bell chime
- `castle`: Rapid double-tap
- `promote`: Fanfare flourish chime
- `game-start`: Ascending major chord
- `game-end`: Victory/draw resolution chord
- `tenseconds`: Warning pulse tick

### 3. Client-Side Stockfish Engine & 100% Unlocked Game Review
- **UCI Web Worker Pipeline**: Queue parser managing `uci`, `isready`, `ucinewgame`, `position fen`, and `go depth`.
- **Free CAPS2 Move Classification**:
  - **Brilliant (!!)**: Tactical sacrifices that retain or increase winning evaluation
  - **Great (!)**: Finding the sole winning or equalizing move in critical positions
  - **Best**: Top engine recommendation (0–10 CPL)
  - **Excellent / Good**: Small deviation from top line (11–35 CPL)
  - **Inaccuracy (?!)**: CPL between 36–90
  - **Mistake (?)**: CPL between 91–200
  - **Blunder (??)**: CPL > 200 or blundering forced mate
  - **Miss**: Failing to capitalize on an opponent's blunder
- **Advantage Graph & Eval Bar**: Real-time evaluation bar (-10 to +10 gauge) and interactive SVG centipawn graph over move history.
- **AI Coach**: Natural language commentary explaining every move's tactical purpose and providing alternative suggestions.

### 4. Comprehensive AI Bots Roster (400 to 2850 ELO)
- **Beginner**: Martin (400), Elani (700)
- **Intermediate**: Nelson (1300 - Wayward Queen Attack), Antonio (1500), Isabel (1600)
- **Advanced**: Wally (1800), Li (2000 CM), Elena (2200 FM)
- **Master**: Gotham Bot (2400 IM), Hikaru Bot (2800 GM), Magnus Bot (2850 GM)
- Each bot features custom avatars, opening repertoires, depth limits, and blunder probabilities.

### 5. Unlimited Tactical Puzzles & Puzzle Rush
- **Rated Puzzles**: Tactical puzzles (back-rank mates, smothered mates, royal forks, pins, skewers, Greek gift sacrifices) with rating progression.
- **Puzzle Rush**: High-intensity 3-minute, 5-minute, and survival modes with strikes, high-score tracking, and celebratory confetti.
- **Opening Explorer**: Grandmaster opening database covering the Sicilian Defense, Ruy Lopez, Queen's Gambit, Italian Game, Caro-Kann, French Defense, and London System.

### 6. Serverless P2P WebRTC Multiplayer
- Powered by PeerJS over WebRTC data channels.
- Instant shareable room links (`openchess.com/#/play?room=UUID`).
- Real-time JSON protocol synchronizing moves, clocks with lag compensation, draw offers, resignations, and chat messages.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom Chess.com color palette
- **Chess Logic**: `chess.js`
- **Networking**: `peerjs` (WebRTC)
- **Audio**: Web Audio API Synthesizer
- **Icons**: `lucide-react`
- **Build Tool**: Vite 6
- **Deployment**: GitHub Pages via GitHub Actions (`actions/deploy-pages@v4`)

---

## 🚀 Getting Started

### Installation
```bash
cd openchess-asm
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The static bundle will be exported to `dist/`, pre-configured with `dist/CNAME` for `openchess.com` deployment on GitHub Pages.
