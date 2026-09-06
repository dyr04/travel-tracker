"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getSupabase } from "../lib/supabase";
import { seedState } from "../lib/seed";
import Dashboard from "../components/Dashboard";
import { Globe2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const supabase = getSupabase();

const C = {
  jade: "#1f7a5c", jadeDeep: "#0f4a37", gold: "#e0a13c",
  clayText: "#2a2320", paper: "#faf6ee", card: "#ffffff", line: "#e5ddcf", muted: "#8a8072",
};

export default function Page() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [state, setState] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | error
  const saveTimer = useRef(null);

  // ---- auth session ----
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // ---- load this user's row (or seed a new one) ----
  useEffect(() => {
    if (!session) { setState(null); return; }
    let cancelled = false;
    (async () => {
      setLoadingData(true);
      const { data, error } = await supabase
        .from("trip_data")
        .select("data")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error(error);
        setState(seedState);
      } else if (data?.data) {
        setState(data.data);
      } else {
        // first login: create the row with seed content
        await supabase.from("trip_data").insert({ user_id: session.user.id, data: seedState });
        setState(seedState);
      }
      setLoadingData(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  // ---- debounced save on every change ----
  const persist = useCallback(async (next) => {
    if (!session) return;
    setSaveStatus("saving");
    const { error } = await supabase
      .from("trip_data")
      .upsert({ user_id: session.user.id, data: next, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaveStatus(error ? "error" : "saved");
    if (error) console.error(error);
  }, [session]);

  useEffect(() => {
    if (!state || !session) return;
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(state), 800);
    return () => clearTimeout(saveTimer.current);
  }, [state, session, persist]);

  if (checking) return <Splash text="Loading…" />;
  if (!session) return <Login />;
  if (loadingData || !state) return <Splash text="Loading your trips…" />;

  return (
    <Dashboard
      state={state}
      setState={setState}
      saveStatus={saveStatus}
      userEmail={session.user.email}
      onSignOut={() => supabase.auth.signOut()}
    />
  );
}

function Splash({ text }) {
  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", color: C.muted }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Globe2 size={20} color={C.jade} /> {text}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const send = async () => {
    if (!email.trim()) return;
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", padding: 20 }}>
      <style>{`.fr{font-family:'Fraunces',Georgia,serif}
        .inp{border:1px solid ${C.line};background:#fff;border-radius:8px;padding:11px 12px;font-size:15px;color:${C.clayText};outline:none;width:100%}
        .inp:focus{border-color:${C.jade}}`}</style>
      <div style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 30 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: C.jade, fontSize: 13, fontWeight: 600 }}>
          <Globe2 size={16} /> TRAVEL TRACKER
        </div>
        <h1 className="fr" style={{ fontSize: 30, fontWeight: 600, margin: "10px 0 6px", color: C.clayText }}>
          {sent ? "Check your email" : "Sign in"}
        </h1>

        {sent ? (
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.5 }}>
            We sent a login link to <b style={{ color: C.clayText }}>{email}</b>. Open it on any device to sign in — your trips sync automatically.
          </p>
        ) : (
          <>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.5, marginBottom: 18 }}>
              Enter your email and we'll send a one-tap login link. No password to remember.
            </p>
            <input
              className="inp"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            {err && <div style={{ color: "#c0392b", fontSize: 13, marginTop: 8 }}>{err}</div>}
            <button
              onClick={send}
              disabled={busy}
              style={{ marginTop: 14, width: "100%", background: C.jade, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", opacity: busy ? .7 : 1 }}
            >
              <Mail size={17} /> {busy ? "Sending…" : "Send login link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
