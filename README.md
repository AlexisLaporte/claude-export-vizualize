# Claude Code Export Viewer

A web app to visualize Claude Code conversation exports beautifully.

## Features

- **Upload or Paste**: Import Claude Code exports via file upload or paste
- **Beautiful Display**: Clean, color-coded conversation view with tool calls and results
- **Client-Side Processing**: All parsing happens in your browser, no data sent to servers
- **URL Sharing**: Generate shareable links with encoded conversation data
- **No Database**: Currently runs entirely client-side (Supabase integration planned)

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Client-side parsing** - No backend required

## Getting Started

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
3. Deploy (zero config required)

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## How It Works

1. Export a conversation from Claude Code (File > Export)
2. Upload the `.txt` file or paste the content
3. View the formatted conversation
4. Click "Share" to generate a URL
5. Copy and share the URL with others

## Parser

The parser (`lib/parser.ts`) recognizes:
- User messages (`>`)
- Assistant messages (`●`)
- Tool calls (`● ToolName(args)`)
- Tool results (`⎿`)
- Expandable sections (`… +X lines`)

## Future Enhancements

- [ ] Supabase integration for persistent storage
- [ ] Search within conversations
- [ ] Export to other formats (HTML, PDF)
- [ ] Syntax highlighting for code blocks
- [ ] Compression for shorter share URLs

## License

MIT
