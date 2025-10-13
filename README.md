# Welcome to your Lovable project

## Project info

**URL**: https://mygreentoken.netlify.app/

# GreenToken — Green Steward Flow

Lightweight frontend for rewarding real-world land care with tokens. Built with React + Vite + Supabase.

## Features

- Submit proof (photos) of land care actions
- Community verification workflow
- Earn and redeem GreenTokens
- Supabase for auth and data

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Create a `.env.local` at the project root with your Supabase values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

3. Run the dev server

```powershell
npm run dev
```

Note for Windows PowerShell users

- If `npm` PowerShell scripts are blocked (execution policy), either run the dev server in Command Prompt or set the policy (run PowerShell as Administrator):

```powershell
Set-ExecutionPolicy RemoteSigned
npm run dev
```

## Build

```powershell
npm run build
npm run preview
```

## Environment & Supabase

- Use Supabase client-side anon/public key (not the service role key).
- Ensure `.env.local` is in the project root and that Vite is restarted after changing env variables.

## Troubleshooting

- "No API key found in request" — means the anon key is missing or empty in the running client. Confirm `.env.local` is present and values are correct, then restart the dev server.
- Blank or blinking dashboard after login — often caused by auth requests failing due to missing API key. See above.
- PowerShell script execution errors — see the PowerShell note above.

## Project structure (high level)

- `src/` — React app
- `src/pages` — page components (Landing, Login, Dashboard, Redeem, Verify, etc.)
- `src/components` — UI components & small app pieces
- `src/lib/supabaseClient.ts` — Supabase client initialization
