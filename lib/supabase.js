import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client = null;

// Build the client only when first used (not at build/prerender time),
// so a missing env var during build can never crash the deploy.
export function getSupabase() {
  if (_client) return _client;
  if (!url || !key) {
    throw new Error("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.");
  }
  _client = createClient(url, key);
  return _client;
}
