# Games Page Spec — Mr. Wallace Console

## Boot Animation (replaces N64 entirely)
- Full black screen, matches site dark theme
- Top-left: small "MW" logo box (same style as sidebar PW box — dark bg, monospace font)
- Center: terminal-style text types out line by line with cursor:
  Line 1: "mr.wallace console  v1.0"       (white, Geist Mono, 18px)
  Line 2: "initializing game room..."       (muted, 13px)
  Line 3: [loading bar fills slowly]        (gold #22c55e color bar, brackets: [====    ])
  Line 4: "system ready."                   (muted, 13px)
- Sound: OPTIONAL and QUIET — single soft sine wave chime, volume 0.08 max. No loud thuds.
- After boot: smooth fade into game room
- "skip" text bottom right corner (click to skip)
- sessionStorage key: "mw-console-booted"
- Do NOT show boot if already seen this session

## Game Room Layout
- Header: "// game room" label + "mr.wallace console" title
- Game grid: 2x2 card grid, each card has:
  - Icon (emoji or simple canvas preview)
  - Game name in Geist Mono
  - Short description
  - "play →" button
- Cards: snake, pong, breakout, tic-tac-toe
- Active game renders below the grid (or replaces grid with back button)

## Games to Build

### Snake
- Already exists but keep it, clean it up
- 20x18 grid, CELL=20px
- Dark bg #0a0a0a, green snake #22c55e, red food
- Arrow keys / WASD
- Score display

### Pong
- Canvas 400x300
- Player paddle (left, mouse/keyboard control: W/S or ArrowUp/Down)
- AI paddle (right, tracks ball with slight delay for fairness)
- Score display top center "0 : 0"
- Dark bg, white paddles and ball
- Ball speeds up slightly each rally

### Breakout
- Canvas 400x300
- Paddle bottom (mouse x position or arrow keys)
- 5 rows x 8 cols of bricks (colored by row: gold, green, blue, purple, red)
- Ball physics, brick destruction
- Score per brick
- Lives: 3

### Tic-Tac-Toe
- Canvas 300x300
- X = player, O = AI (simple minimax)
- Click to place
- Draw/win detection with line drawn through winning combo
- "play again" on result

## Style Rules
- All games: dark bg (#0a0a0a or #000), Geist Mono font for UI text
- Consistent HUD: "// gamename" top left, score top right
- All use site CSS variables where possible
- Back button always top-left above canvas

## File
Rewrite src/components/Games.tsx completely
Keep Games in page.tsx and Sidebar.tsx as-is (already wired up)
