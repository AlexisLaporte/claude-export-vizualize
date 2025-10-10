# Claude Code Export Viewer

A web app to visualize Claude Code conversation exports beautifully.

## Features

- **Upload or Paste**: Import Claude Code exports via file upload or paste
- **Beautiful Display**: Clean, color-coded conversation view with tool calls and results
- **Client-Side Parsing**: All parsing happens in your browser
- **Database Storage**: Exports saved to Turso (SQLite edge database) when shared
- **Short Share URLs**: Clean, persistent links like `?id=abc123xyz`
- **View Counter**: Track how many times exports are viewed

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Turso** - Edge SQLite database (generous free tier)
- **libSQL** - Database client

## Getting Started

### Prerequisites

1. Install [Turso CLI](https://docs.turso.tech/cli/installation):
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Authenticate and create database:
```bash
turso auth login
turso db create claude-exports
```

3. Get credentials:
```bash
turso db show claude-exports --url
turso db tokens create claude-exports
```

4. Create `.env.local`:
```env
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Deploy

Or use Vercel CLI:

```bash
vercel
# Add env variables when prompted
```

**Note**: Turso free tier includes:
- 9 GB storage
- 1 billion rows
- 500 databases
- Perfect for this use case!

## How It Works

1. Export a conversation from Claude Code (File > Export)
2. Upload the `.txt` file or paste the content
3. Parsing happens in your browser (instant, no upload yet)
4. View the formatted conversation
5. Click "Share" to save to database and generate a short URL
6. Copy and share the URL with others

**Privacy**: Exports are only saved to the database when you explicitly click "Share".

## Parser

The parser (`lib/parser.ts`) recognizes:
- User messages (`>`)
- Assistant messages (`●`)
- Tool calls (`● ToolName(args)`)
- Tool results (`⎿`)
- Expandable sections (`… +X lines`)

## Database Schema

```sql
CREATE TABLE exports (
  id TEXT PRIMARY KEY,        -- nanoid(10) for short IDs
  content TEXT NOT NULL,      -- Full export text
  created_at INTEGER NOT NULL, -- Unix timestamp
  views INTEGER DEFAULT 0     -- View counter
);
CREATE INDEX idx_created_at ON exports(created_at);
```

## API Routes

- `POST /api/exports` - Save export, returns `{id}`
- `GET /api/exports/[id]` - Load export by ID, increments views

## Future Enhancements

- [ ] Search within conversations
- [ ] Export to other formats (HTML, PDF)
- [ ] Syntax highlighting for code blocks
- [ ] Optional expiration dates for exports
- [ ] Analytics dashboard

## License

MIT
