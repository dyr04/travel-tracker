import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  _client = createClient(url || "https://placeholder.supabase.co", key || "placeholder");
  return _client;
}
