import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard so a missing env var gives a clear message instead of a cryptic crash.
if (!url || !key) {
  console.warn("Supabase env vars missing. Add them in .env.local (local) or Vercel project settings (deployed).");
}

export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder");
