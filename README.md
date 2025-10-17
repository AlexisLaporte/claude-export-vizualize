<div align="center">

# 🤖 Claude Code Export Viewer

**The easiest way to share beautiful Claude Code conversations**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[Live Demo](https://your-demo-url.vercel.app) • [Report Bug](https://github.com/AlexisLaporte/claude-export-vizualize/issues) • [Request Feature](https://github.com/AlexisLaporte/claude-export-vizualize/issues)

</div>

---

## 💡 Why This Tool?

Ever wanted to **share** a Claude Code conversation with your team, client, or community?

Most tools help you *export* or *backup* your conversations. This is the **only web-based platform** that lets you create beautiful, shareable URLs for your Claude Code sessions.

**Think of it as:**
- 🔗 Pastebin/Gist for Claude conversations
- 📸 Carbon.now.sh for AI interactions
- 📤 Imgur for code discussions

## ✨ Features

- **📤 Upload or Paste**: Import Claude Code exports via file upload or paste
- **🎨 Beautiful Display**: Clean, color-coded conversation view with tool calls and results
- **⚡ Client-Side Parsing**: All parsing happens in your browser (instant, private)
- **🔗 Shareable URLs**: Generate short, persistent links like `?id=abc123xyz`
- **👁️ View Counter**: Track how many times your exports are viewed
- **🌍 Zero Install**: No CLI tools, no desktop apps - just a URL
- **🔒 Privacy First**: Exports only saved to database when you click "Share"

## 🆚 How It Compares

| Feature | This Tool | Other Export Tools |
|---------|-----------|-------------------|
| Share via URL | ✅ | ❌ |
| Beautiful web UI | ✅ | Some |
| View tracking | ✅ | ❌ |
| No installation | ✅ | ❌ (most require CLI/desktop) |
| Export to file | Coming soon | ✅ |
| Local analysis | ❌ | ✅ |

**Use this when:** You want to share a conversation
**Use others when:** You want to backup/analyze your own data

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

## 🗺️ Roadmap

- [ ] Search within conversations
- [ ] Export to other formats (HTML, PDF)
- [ ] Syntax highlighting for code blocks
- [ ] Optional expiration dates for exports
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] Conversation diffs

See [open issues](https://github.com/AlexisLaporte/claude-export-vizualize/issues) for planned features and known issues.

## 🤝 Contributing

Contributions are welcome! This is an open-source project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Turso](https://turso.tech/)
- Inspired by the Claude Code community

---

<div align="center">

**[⭐ Star this repo](https://github.com/AlexisLaporte/claude-export-vizualize)** if you find it useful!

Made with ❤️ for the Claude Code community

</div>
