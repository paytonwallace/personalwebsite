# Leaderboard Spec

## Supabase
- URL: process.env.NEXT_PUBLIC_SUPABASE_URL
- Key: process.env.NEXT_PUBLIC_SUPABASE_KEY
- Table: scores (id, game, name, score, created_at)
- Use raw fetch calls — no supabase-js SDK needed

## API Routes

### GET /api/scores?game=snake
- Fetch top 10 scores for a game, ordered by score desc
- URL: `${SUPABASE_URL}/rest/v1/scores?game=eq.${game}&order=score.desc&limit=10`
- Headers: apikey + Authorization Bearer

### POST /api/scores
- Body: { game, name, score }
- Insert to supabase scores table
- URL: `${SUPABASE_URL}/rest/v1/scores`
- Method: POST, headers: apikey + Authorization + Content-Type + Prefer: return=minimal

## Files to create
- src/app/api/scores/route.ts — handles GET and POST

## Games.tsx changes

### After each game ends (dead state), show a "Submit Score" flow:
- Small form appears: input for name (max 12 chars), submit button
- On submit: POST to /api/scores, then show leaderboard for that game
- Skip button to just see leaderboard without submitting

### Leaderboard panel (shown after submit or via "leaderboard" button):
- Shows top 10 for current game
- Rank | Name | Score columns
- Monospace font, dark bg, matches site aesthetic
- "back to game room" and "play again" buttons

### Game room (select screen) changes:
- Each game card gets a small "view scores →" link that opens leaderboard for that game
- Leaderboard shown as a modal/overlay over the game room

## Game names to use (must match exactly in DB):
- "snake", "pong", "breakout", "tictactoe", "tetris", "2048", "flappy", "invaders"

## Score submission trigger points (add to each game's dead/gameover state):
- Snake: when dead===true
- Pong: when score shows final (player loses all points or loses a round — use total player score)
- Breakout: when lives===0
- TicTacToe: skip (no numeric score)
- Tetris: when game over
- 2048: when no moves left (game over)
- Flappy: when dead
- Invaders: when lives===0

## Style
- Input: dark bg #1a1a1a, border var(--border), font Geist Mono, text white
- Table: no borders, alternating row bg, rank numbers in muted color
- Gold color #B5945A for top 3 ranks
- Consistent with rest of site

## After building
1. npm run build — fix all TS errors
2. git add -A && git commit -m "feat: leaderboard — supabase scores, submit modal, top 10 per game"
3. DO NOT run vercel deploy
