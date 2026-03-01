# Add 4 More Games to Games.tsx

## Task
Open src/components/Games.tsx and add 4 new games to the existing game room.
The file already has: snake, pong, breakout, tic-tac-toe, plus the MW Console boot sequence.
DO NOT remove or change any existing games or the boot sequence.

## Games to Add

### Tetris
- Canvas 240x480 (12 cols x 24 rows, CELL=20px)
- Standard 7 tetrominoes (I, O, T, S, Z, J, L) with standard colors
- Arrow left/right to move, up to rotate, down to soft drop, space to hard drop
- Line clear with score: 1 line=100, 2=300, 3=500, 4=800 (multiplied by level)
- Speed increases every 10 lines (level up)
- Ghost piece (shows where piece will land, semi-transparent)
- Next piece preview box top-right
- Game over when pieces stack to top

### 2048
- 4x4 grid, CELL=100px, canvas 400x400
- Arrow keys to slide tiles
- Merge same numbers, score = merged value
- Spawn new 2 or 4 after each move
- Color scheme per tile value (matches dark aesthetic — use greens/yellows/oranges for values)
- Win condition: reach 2048 tile (show "you won!" overlay, allow continue)
- Game over when no moves left
- Score display above grid

### Flappy Bird (call it "flappy.exe")
- Canvas 400x500
- Dark background with parallax scrolling ground and bg layers
- Click/space to flap (apply upward velocity, gravity pulls down)
- Pipes spawn from right, scroll left, random gap heights
- Score = pipes passed
- Bird is a simple pixel square with wings (no external assets)
- Game over on pipe hit or ground hit
- High score tracked in component state

### Space Invaders (call it "invaders.exe")  
- Canvas 480x400
- Player ship at bottom (arrow keys to move, space to shoot)
- 4 rows x 10 cols of aliens (3 types, different point values: 10/20/30)
- Aliens move left-right and descend one row when hitting edge
- Aliens shoot back (random timing, 1 bullet per alien at a time max)
- 4 shield bunkers that degrade as shots hit them
- 3 lives
- Score display
- Win: clear all aliens (next wave spawns faster)
- Lose: aliens reach bottom or player loses all lives

## How to Add to the Game Room
1. Add 4 new game component functions in the file (TetrisGame, Game2048, FlappyGame, InvadersGame)
2. In the `Games` export default component, add 4 new cards to the game grid (make it a responsive 2-col grid, so it expands)
3. Add 4 new phase states: "tetris" | "2048" | "flappy" | "invaders" 
4. Add 4 new AnimatePresence phases for each game

## Style Rules (same as existing games)
- Dark bg #0a0a0a
- Geist Mono font for all UI
- HUD: "// gamename.exe" top left, score top right
- Back button above canvas
- Consistent with existing aesthetic

## After Writing
1. Run: npm run build
2. Fix ALL TypeScript errors until build passes clean (zero errors)
3. Then: git add src/components/Games.tsx && git commit -m "feat: add tetris, 2048, flappy, space invaders to game room"
4. DO NOT run vercel deploy — I will do that manually
