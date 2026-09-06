# Travel Tracker — Setup Guide

This gets your app live on the internet with email login and cross-device sync.
No coding needed — just clicking, copying, and pasting. **About 15 minutes.**

You'll create two free accounts:
- **Supabase** — stores your data and handles email login
- **Vercel** — hosts the website at a URL you can open anywhere

Do the steps **in order**. Take it slow; each one is small.

---

## PART 1 — Supabase (your database + login)  ~6 min

### 1.1 Make the account
1. Go to **https://supabase.com** and click **Start your project**.
2. Sign in with GitHub or email (whichever is easier).

### 1.2 Create a project
1. Click **New project**.
2. Name it `travel-tracker` (anything is fine).
3. Set a **database password** — click Generate, then copy it somewhere safe. (You won't need it for the app, but Supabase wants one.)
4. Pick the region closest to you.
5. Click **Create new project** and wait ~2 minutes while it sets up.

### 1.3 Create the data table
1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file **`supabase-setup.sql`** (included in this project), copy ALL of it, paste it into the box.
4. Click **Run** (bottom right). You should see "Success. No rows returned." That's correct.

### 1.4 Turn on email login
1. Left sidebar -> **Authentication** -> **Sign In / Providers** (or "Providers").
2. Make sure **Email** is enabled.
3. Find the **"Confirm email"** / magic-link setting — the default (magic link on) is what we want. No password needed.

### 1.5 Grab your two keys (you'll paste these into Vercel later)
1. Left sidebar -> **Project Settings** (gear icon) -> **API**.
2. Copy these two values into a note:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

Keep these handy for Part 3.

---

## PART 2 — Put the code on GitHub  ~3 min

Vercel deploys from GitHub. Easiest way with no terminal:

1. Go to **https://github.com** and sign in (make an account if needed).
2. Click **+** (top right) -> **New repository**.
3. Name it `travel-tracker`, keep it **Private**, click **Create repository**.
4. On the next page, click **uploading an existing file**.
5. Drag in **all the files and folders from this project** (the whole `travel-app` folder contents — `app`, `components`, `lib`, `package.json`, everything EXCEPT `node_modules`).
6. Click **Commit changes**.

> Tip: if drag-and-drop of folders is fussy in the browser, zip the project, or ask me to walk you through the GitHub Desktop app instead.

---

## PART 3 — Deploy on Vercel  ~5 min

### 3.1 Connect
1. Go to **https://vercel.com** and click **Sign Up** -> **Continue with GitHub**.
2. Click **Add New… -> Project**.
3. Find your `travel-tracker` repo and click **Import**.

### 3.2 Add your two keys
Before clicking Deploy, expand **Environment Variables** and add both:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (paste your Project URL from step 1.5) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste your anon public key from step 1.5) |

Type the name on the left, paste the value on the right, click **Add** for each.

### 3.3 Deploy
1. Click **Deploy**. Wait ~1–2 minutes.
2. When it finishes, you'll get a URL like `https://travel-tracker-xxxx.vercel.app`. **That's your app.**

### 3.4 Tell Supabase about your URL (so login links work)
1. Copy your new Vercel URL.
2. Back in Supabase: **Authentication -> URL Configuration**.
3. Set **Site URL** to your Vercel URL.
4. Under **Redirect URLs**, add the same URL (with `/**` on the end, e.g. `https://travel-tracker-xxxx.vercel.app/**`). Save.

---

## PART 4 — Use it

1. Open your Vercel URL on your phone or laptop.
2. Type your email, tap **Send login link**.
3. Check your inbox, tap the link — you're in.
4. Do the same on any other device with the same email. Your Guatemala trip and everything you add syncs automatically. The header shows "Saved" after each change.

### Make it feel like an app on your phone
- **iPhone:** open the URL in Safari -> Share -> **Add to Home Screen**.
- **Android:** open in Chrome -> menu -> **Add to Home screen**.
It'll get an icon and open full-screen like a real app.

---

## Troubleshooting

- **Login email didn't arrive:** check spam. Supabase's free tier sends a limited number of emails per hour; wait a bit and retry. (For heavy use you can later add a custom email sender, but the default is fine to start.)
- **"Not saved" in the header:** usually means the two environment variables are missing or mistyped in Vercel. Re-check Part 3.2, then in Vercel go to Deployments -> redeploy.
- **Login link opens but doesn't log in:** the Site URL / Redirect URL in Part 3.4 doesn't match your Vercel URL exactly. Fix and save.
- **Photos slow to sync:** big videos make the data row large. Keep to phone-sized photos/short clips. (If you want unlimited media later, the next upgrade is Supabase Storage — ask me and I'll add it.)

---

## What this costs
Both Supabase and Vercel have free tiers that comfortably cover personal use. You won't be asked for a card to start. If you ever outgrow the free limits, they'll tell you before charging.

That's it — enjoy Guatemala. 🇬🇹
