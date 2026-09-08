import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getSupabase() {
  if (_client) return _client;

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  url = url.trim();
  key = key.trim();

  // If the URL is missing or malformed, fall back to a valid placeholder
  // so createClient never throws and crashes the whole app.
  const looksValid = /^https:\/\/.+\.supabase\.co\/?$/.test(url);
  if (!looksValid) {
    console.error("Supabase URL missing or malformed at runtime:", JSON.stringify(url));
    url = "https://placeholder.supabase.co";
    key = key || "placeholder";
  }
  // strip any trailing slash
  url = url.replace(/\/+$/, "");

  _client = createClient(url, key);
  return _client;
}
