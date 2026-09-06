# Travel Tracker

A personal trip planner with expenses, a paycheck savings calculator, group cost-splitting,
hour-by-hour itineraries, packing lists, currency conversion, memories with photos, and
one-click launchers for flights/stays/rides. Email login, synced across all your devices.

## Get it running
See **SETUP-GUIDE.md** — a click-by-click walkthrough (~15 min, no coding).

## Tech
- Next.js (App Router) + React
- Supabase (Postgres + magic-link auth)
- Deployed on Vercel

## Local development (optional)
```bash
npm install
cp .env.local.example .env.local   # then paste your Supabase URL + anon key
npm run dev
```
Open http://localhost:3000
