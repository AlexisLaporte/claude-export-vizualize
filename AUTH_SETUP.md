# Authentication Setup

NextAuth v5 with Google OAuth, stored in Turso database.

## Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure consent screen if needed
6. Choose "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3012/api/auth/callback/google`
   - (Add production URL when deploying)
8. Copy the **Client ID** and **Client Secret**
9. Add to `.env.local`:
   ```
   AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=your-client-secret
   ```

## Database Schema

Auth tables are already created in Turso:
- `users` - User accounts
- `accounts` - OAuth provider accounts
- `sessions` - Active sessions
- `verification_tokens` - Email verification tokens
- `exports.user_id` - Links exports to users (nullable)

## Features

- Google OAuth login
- Session management
- User tracking for exports
- Anonymous exports still supported (user_id can be null)

## Test Locally

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3012
3. Click "Sign in with Google"
4. After auth, create an export - it will be linked to your account
