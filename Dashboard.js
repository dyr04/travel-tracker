"use client";

import React, { useState, useMemo } from "react";
import {
  Plane, Hotel, Utensils, Ticket, PiggyBank, MapPin, Camera,
  CalendarDays, Luggage, Coins, Plus, Trash2, Check, Globe2,
  Wallet, TrendingUp, Lightbulb, ChevronRight, Users, Clock,
  ExternalLink, Car, Image as ImageIcon, X, Cloud, CloudOff, LogOut
} from "lucide-react";

const C = {
  jade: "#1f7a5c", jadeDeep: "#0f4a37", gold: "#e0a13c",
  clayText: "#2a2320", paper: "#faf6ee", card: "#ffffff", line: "#e5ddcf", muted: "#8a8072", coral: "#c65b3c",
};
const CAT_META = {
  Flights: { icon: Plane, color: "#3a6ea5" }, Hotels: { icon: Hotel, color: "#7c5cbf" },
  Food: { icon: Utensils, color: "#c65b3c" }, Activities: { icon: Ticket, color: C.jade },
};
const fmt = (n) => "$" + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const fmt2 = (n) => "$" + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const uid = () => Date.now() + Math.floor(Math.random() * 10000);

export default function Dashboard({ state, setState, saveStatus, userEmail, onSignOut }) {
  const [tab, setTab] = useState("overview");
  const trip = state.trips[state.activeTrip];
  const update = (patch) => setState((s) => ({ ...s, trips: { ...s.trips, [s.activeTrip]: { ...s.trips[s.activeTrip], ...patch } } }));
  const setTop = (patch) => setState((s) => ({ ...s, ...patch }));

  const group = Math.max(1, Number(state.groupSize) || 1);
  const myShare = (e) => (e.shared ? Number(e.usd || 0) / group : Number(e.usd || 0));

  const myTotal = useMemo(() => trip.expenses.reduce((a, e) => a + myShare(e), 0), [trip.expenses, group]);
  const fullTotal = useMemo(() => trip.expenses.reduce((a, e) => a + Number(e.usd || 0), 0), [trip.expenses]);
  const paidMine = useMemo(() => trip.expenses.filter((e) => e.paid).reduce((a, e) => a + myShare(e), 0), [trip.expenses, group]);
  const remaining = Math.max(myTotal - paidMine, 0);

  const paychecksLeft = useMemo(() => {
    const dep = new Date(trip.startDate + "T00:00:00");
    const days = Math.ceil((dep - new Date()) / 86400000);
    return Math.max(Math.floor(days / state.payCadenceDays), 1);
  }, [trip.startDate, state.payCadenceDays]);

  const grossPerCheck = (Number(state.hourlyRate) || 0) * (Number(state.hoursPerWeek) || 0) * (state.payCadenceDays / 7);
  const perPaycheck = remaining / paychecksLeft;
  const pctOfCheck = grossPerCheck > 0 ? (perPaycheck / grossPerCheck) * 100 : 0;

  const byCatMine = useMemo(() => { const m = {}; trip.expenses.forEach((e) => { m[e.cat] = (m[e.cat] || 0) + myShare(e); }); return m; }, [trip.expenses, group]);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp }, { id: "expenses", label: "Expenses", icon: Wallet },
    { id: "savings", label: "Savings", icon: PiggyBank }, { id: "checklist", label: "Places", icon: MapPin },
    { id: "ideas", label: "Ideas & Photos", icon: Camera }, { id: "itinerary", label: "Itinerary", icon: CalendarDays },
    { id: "memories", label: "Memories", icon: ImageIcon }, { id: "packing", label: "Packing", icon: Luggage },
    { id: "currency", label: "Currency", icon: Coins }, { id: "book", label: "Book & Go", icon: ExternalLink },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.clayText, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .fr { font-family: 'Fraunces', Georgia, serif; }
        .tabbtn:hover { color:${C.jade} !important; }
        .rowhover:hover { background:${C.paper}; }
        .inp { border:1px solid ${C.line}; background:${C.card}; border-radius:8px; padding:8px 10px; font-size:14px; color:${C.clayText}; outline:none; width:100%; }
        .inp:focus { border-color:${C.jade}; }
        .btn { cursor:pointer; border:none; border-radius:8px; font-weight:600; font-size:14px; }
        .link:hover { text-decoration:underline; }
      `}</style>

      <header style={{ background: C.jadeDeep, color: "#fff", padding: "18px 22px 26px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, opacity: .85 }}><Globe2 size={15} /> Travel Tracker</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12 }}>
              <SyncBadge status={saveStatus} />
              <span style={{ opacity: .8 }}>{userEmail}</span>
              <button className="btn" onClick={onSignOut} style={{ background: "rgba(255,255,255,.15)", color: "#fff", padding: "6px 10px", display: "flex", gap: 5, alignItems: "center", fontSize: 12 }}><LogOut size={13} /> Sign out</button>
            </div>
          </div>
          <h1 className="fr" style={{ margin: "10px 0 2px", fontSize: 38, fontWeight: 600, lineHeight: 1 }}>{trip.flag} {trip.name}</h1>
          <div style={{ fontSize: 14, opacity: .85 }}>{trip.startDate} \u2192 {trip.endDate} \u00B7 {group} {group === 1 ? "traveler" : "travelers"}</div>
          <div style={{ display: "flex", gap: 22, marginTop: 18, flexWrap: "wrap" }}>
            <Stat label="My total cost" value={fmt(myTotal)} tone={C.gold} />
            <Stat label="Still to pay" value={fmt(remaining)} tone="#fff" />
            <Stat label={`Per paycheck (${paychecksLeft} left)`} value={fmt(perPaycheck)} tone={C.gold} />
            <Stat label="% of each check" value={`${pctOfCheck.toFixed(0)}%`} tone="#fff" />
          </div>
        </div>
      </header>

      <nav style={{ background: C.card, borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 2, overflowX: "auto", padding: "0 12px" }}>
          {tabs.map((t) => { const Ic = t.icon; const on = tab === t.id;
            return (<button key={t.id} className="tabbtn btn" onClick={() => setTab(t.id)} style={{ background: "transparent", padding: "14px 13px", whiteSpace: "nowrap", color: on ? C.jade : C.muted, borderBottom: on ? `2px solid ${C.jade}` : "2px solid transparent", display: "flex", alignItems: "center", gap: 6 }}><Ic size={16} /> {t.label}</button>);
          })}
        </div>
      </nav>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 18px 60px" }}>
        {tab === "overview" && <Overview {...{ trip, myTotal, fullTotal, paidMine, remaining, perPaycheck, paychecksLeft, byCatMine, group, pctOfCheck }} />}
        {tab === "expenses" && <Expenses {...{ trip, update, group, myShare, myTotal, fullTotal }} />}
        {tab === "savings" && <Savings {...{ trip, update, state, setTop, remaining, paychecksLeft, perPaycheck, grossPerCheck, pctOfCheck, paidMine }} />}
        {tab === "checklist" && <ListTab {...{ trip, update, field: "checklist", itemKey: "place", title: "Places visited", placeholder: "Add a place\u2026", icon: MapPin }} />}
        {tab === "ideas" && <Ideas {...{ trip, update }} />}
        {tab === "itinerary" && <Itinerary {...{ trip, update, group }} />}
        {tab === "memories" && <Memories {...{ trip, update }} />}
        {tab === "packing" && <ListTab {...{ trip, update, field: "packing", itemKey: "item", title: "Packing list", placeholder: "Add an item\u2026", icon: Luggage }} />}
        {tab === "currency" && <Currency {...{ trip, update, byCatMine, myTotal }} />}
        {tab === "book" && <BookGo {...{ trip, update }} />}
      </main>
    </div>
  );
}

function SyncBadge({ status }) {
  if (status === "saving") return <span style={{ display: "flex", gap: 5, alignItems: "center", opacity: .8 }}><Cloud size={14} /> Saving\u2026</span>;
  if (status === "error") return <span style={{ display: "flex", gap: 5, alignItems: "center", color: "#ffd2c2" }}><CloudOff size={14} /> Not saved</span>;
  return <span style={{ display: "flex", gap: 5, alignItems: "center", opacity: .8 }}><Cloud size={14} /> Saved</span>;
}

function Stat({ label, value, tone }) { return (<div><div style={{ fontSize: 12, opacity: .75, marginBottom: 3 }}>{label}</div><div className="fr" style={{ fontSize: 25, fontWeight: 600, color: tone }}>{value}</div></div>); }
function Card({ children, style }) { return <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, ...style }}>{children}</div>; }
function SectionTitle({ children, right }) { return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><h2 className="fr" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{children}</h2>{right}</div>); }

function Overview({ trip, myTotal, fullTotal, paidMine, remaining, perPaycheck, paychecksLeft, byCatMine, group, pctOfCheck }) {
  const pct = myTotal ? Math.round((paidMine / myTotal) * 100) : 0;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
        <Card>
          <SectionTitle>Payment progress</SectionTitle>
          <div style={{ height: 12, background: C.paper, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.line}` }}><div style={{ width: `${pct}%`, height: "100%", background: C.jade }} /></div>
          <div style={{ marginTop: 10, fontSize: 14, color: C.muted }}>{fmt(paidMine)} paid \u00B7 {fmt(remaining)} to go ({pct}%)</div>
          <div style={{ marginTop: 14, fontSize: 15 }}>Save <b style={{ color: C.jade }}>{fmt(perPaycheck)}</b> ({pctOfCheck.toFixed(0)}% of each check) across your next <b>{paychecksLeft}</b> paychecks.</div>
        </Card>
        <Card>
          <SectionTitle>My spending by category</SectionTitle>
          <div style={{ display: "grid", gap: 9 }}>
            {Object.entries(byCatMine).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
              const meta = CAT_META[cat] || { color: C.muted, icon: Ticket }; const Ic = meta.icon; const w = myTotal ? (amt / myTotal) * 100 : 0;
              return (<div key={cat}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}><span style={{ display: "flex", gap: 6, alignItems: "center" }}><Ic size={14} color={meta.color} />{cat}</span><b>{fmt(amt)}</b></div><div style={{ height: 6, background: C.paper, borderRadius: 6 }}><div style={{ width: `${w}%`, height: "100%", background: meta.color, borderRadius: 6 }} /></div></div>);
            })}
          </div>
        </Card>
      </div>
      {group > 1 && (<Card style={{ background: C.jadeDeep, color: "#fff" }}><div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 15 }}><Users size={18} color={C.gold} />Splitting shared costs across {group} people lowers your share. Full trip cost is {fmt(fullTotal)}; your share is <b style={{ color: C.gold }}>{fmt(myTotal)}</b>.</div></Card>)}
      <Card>
        <SectionTitle>Trip at a glance</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          <MiniStat label="Places to see" value={`${trip.checklist.filter(c=>c.done).length}/${trip.checklist.length}`} />
          <MiniStat label="Days planned" value={trip.itinerary.length} />
          <MiniStat label="Packing done" value={`${trip.packing.filter(p=>p.done).length}/${trip.packing.length}`} />
          <MiniStat label="Ideas saved" value={trip.ideas.length} />
        </div>
      </Card>
    </div>
  );
}
function MiniStat({ label, value }) { return (<div style={{ background: C.paper, borderRadius: 10, padding: "14px 16px" }}><div className="fr" style={{ fontSize: 24, fontWeight: 600, color: C.jade }}>{value}</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{label}</div></div>); }

function Expenses({ trip, update, group, myShare, myTotal, fullTotal }) {
  const [f, setF] = useState({ cat: "Activities", label: "", usd: "", shared: false });
  const add = () => { if (!f.label.trim()) return; update({ expenses: [...trip.expenses, { id: uid(), cat: f.cat, label: f.label.trim(), usd: Number(f.usd) || 0, paid: false, shared: f.shared }] }); setF({ cat: f.cat, label: "", usd: "", shared: false }); };
  const patch = (id, p) => update({ expenses: trip.expenses.map((e) => e.id === id ? { ...e, ...p } : e) });
  const del = (id) => update({ expenses: trip.expenses.filter((e) => e.id !== id) });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <SectionTitle>Add an expense</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px auto auto", gap: 10, alignItems: "center" }}>
          <select className="inp" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{Object.keys(CAT_META).map((c) => <option key={c}>{c}</option>)}</select>
          <input className="inp" placeholder="What is it?" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} onKeyDown={(e)=>e.key==="Enter"&&add()} />
          <input className="inp" type="number" placeholder="USD" value={f.usd} onChange={(e) => setF({ ...f, usd: e.target.value })} onKeyDown={(e)=>e.key==="Enter"&&add()} />
          <label style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 13, color: C.muted, whiteSpace: "nowrap", cursor: "pointer" }}><input type="checkbox" checked={f.shared} onChange={(e) => setF({ ...f, shared: e.target.checked })} /> Split</label>
          <button className="btn" onClick={add} style={{ background: C.jade, color: "#fff", padding: "9px 16px", display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> Add</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>Tick \u201CSplit\u201D for costs shared across the group (hotels, car rides). Your share = cost \u00F7 {group}.</div>
      </Card>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {trip.expenses.map((e) => {
          const meta = CAT_META[e.cat] || { color: C.muted, icon: Ticket }; const Ic = meta.icon; const mine = myShare(e);
          return (
            <div key={e.id} className="rowhover" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: `1px solid ${C.line}` }}>
              <button className="btn" onClick={() => patch(e.id, { paid: !e.paid })} style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${e.paid ? C.jade : C.line}`, background: e.paid ? C.jade : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{e.paid && <Check size={14} color="#fff" />}</button>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: meta.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={15} color={meta.color} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, textDecoration: e.paid ? "line-through" : "none", opacity: e.paid ? .6 : 1 }}>{e.label}</div>
                <div style={{ fontSize: 12, color: C.muted, display: "flex", gap: 8, alignItems: "center" }}>{e.cat}<label style={{ display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}><input type="checkbox" checked={!!e.shared} onChange={(ev) => patch(e.id, { shared: ev.target.checked })} /> split</label></div>
              </div>
              <div style={{ textAlign: "right" }}><b style={{ fontSize: 15 }}>{fmt(mine)}</b>{e.shared && group > 1 && <div style={{ fontSize: 11, color: C.muted }}>of {fmt(e.usd)}</div>}</div>
              <button className="btn" onClick={() => del(e.id)} style={{ background: "transparent", color: C.muted, padding: 4 }}><Trash2 size={16} /></button>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 18px", background: C.paper }}><b>My total{group > 1 ? ` (full trip ${fmt(fullTotal)})` : ""}</b><b className="fr" style={{ fontSize: 18, color: C.jade }}>{fmt(myTotal)}</b></div>
      </Card>
    </div>
  );
}

function Savings({ trip, update, state, setTop, remaining, paychecksLeft, perPaycheck, grossPerCheck, pctOfCheck, paidMine }) {
  const NumRow = ({ label, val, on, step = 1, suffix }) => (
    <div><label style={{ fontSize: 13, color: C.muted }}>{label}</label><div style={{ display: "flex", alignItems: "center", gap: 6 }}><input className="inp" type="number" step={step} value={val} onChange={(e) => on(e.target.value)} />{suffix && <span style={{ fontSize: 13, color: C.muted }}>{suffix}</span>}</div></div>
  );
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <SectionTitle>Your income</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          <NumRow label="Hourly rate" val={state.hourlyRate} on={(v) => setTop({ hourlyRate: Number(v) || 0 })} step={0.5} suffix="/hr" />
          <NumRow label="Hours / week" val={state.hoursPerWeek} on={(v) => setTop({ hoursPerWeek: Number(v) || 0 })} />
          <NumRow label="Pay cadence (days)" val={state.payCadenceDays} on={(v) => setTop({ payCadenceDays: Number(v) || 14 })} />
          <NumRow label="Group size (incl. you)" val={state.groupSize} on={(v) => setTop({ groupSize: Math.max(1, Number(v) || 1) })} />
        </div>
        <div style={{ marginTop: 12, fontSize: 14, color: C.muted }}>Estimated gross per paycheck: <b style={{ color: C.clayText }}>{fmt(grossPerCheck)}</b> ({state.hourlyRate}/hr \u00D7 {state.hoursPerWeek} hrs \u00D7 {(state.payCadenceDays/7).toFixed(1)} wks)</div>
      </Card>
      <Card>
        <SectionTitle right={<span style={{ fontSize: 13, color: C.muted }}>{paidMine > 0 ? `${fmt(paidMine)} already paid` : ""}</span>}>Trip timing</SectionTitle>
        <div><label style={{ fontSize: 13, color: C.muted }}>Departure date</label><input className="inp" style={{ maxWidth: 220 }} type="date" value={trip.startDate} onChange={(e) => update({ startDate: e.target.value })} /></div>
      </Card>
      <Card style={{ background: C.jadeDeep, color: "#fff" }}>
        <div style={{ fontSize: 14, opacity: .85 }}>To cover the {fmt(remaining)} still owed before departure:</div>
        <div className="fr" style={{ fontSize: 34, fontWeight: 600, color: C.gold, margin: "6px 0" }}>{fmt2(perPaycheck)} <span style={{ fontSize: 16, color: "#fff", opacity: .8 }}>per paycheck</span></div>
        <div style={{ fontSize: 14, opacity: .9 }}>That's <b style={{ color: C.gold }}>{pctOfCheck.toFixed(1)}%</b> of each ~{fmt(grossPerCheck)} check, across your next {paychecksLeft} paychecks.</div>
        {pctOfCheck > 50 && <div style={{ marginTop: 10, fontSize: 13, background: "rgba(255,255,255,.12)", padding: "8px 12px", borderRadius: 8 }}>\u26A0 That's over half your paycheck. Consider pushing the date out or trimming expenses.</div>}
      </Card>
      <Card>
        <SectionTitle>Paycheck schedule</SectionTitle>
        <div style={{ display: "grid", gap: 8 }}>
          {Array.from({ length: paychecksLeft }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() + (i + 1) * state.payCadenceDays);
            return (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: C.paper, borderRadius: 9 }}><span style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}><PiggyBank size={16} color={C.jade} /> Paycheck {i + 1} \u00B7 {d.toLocaleDateString()}</span><b style={{ color: C.jade }}>{fmt2(perPaycheck)}</b></div>);
          })}
        </div>
      </Card>
    </div>
  );
}

function ListTab({ trip, update, field, itemKey, title, placeholder, icon: Icon }) {
  const [val, setVal] = useState(""); const items = trip[field];
  const add = () => { if (!val.trim()) return; update({ [field]: [...items, { id: uid(), [itemKey]: val.trim(), done: false }] }); setVal(""); };
  const toggle = (id) => update({ [field]: items.map((i) => i.id === id ? { ...i, done: !i.done } : i) });
  const del = (id) => update({ [field]: items.filter((i) => i.id !== id) });
  return (
    <Card>
      <SectionTitle right={<span style={{ fontSize: 14, color: C.muted }}>{items.filter(i=>i.done).length}/{items.length} done</span>}>{title}</SectionTitle>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}><input className="inp" placeholder={placeholder} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} /><button className="btn" onClick={add} style={{ background: C.jade, color: "#fff", padding: "9px 16px" }}><Plus size={16} /></button></div>
      <div style={{ display: "grid", gap: 7 }}>
        {items.map((i) => (<div key={i.id} className="rowhover" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 9, border: `1px solid ${C.line}` }}><button className="btn" onClick={() => toggle(i.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${i.done ? C.jade : C.line}`, background: i.done ? C.jade : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{i.done && <Check size={14} color="#fff" />}</button><Icon size={16} color={C.muted} /><span style={{ flex: 1, fontSize: 15, textDecoration: i.done ? "line-through" : "none", opacity: i.done ? .55 : 1 }}>{i[itemKey]}</span><button className="btn" onClick={() => del(i.id)} style={{ background: "transparent", color: C.muted, padding: 4 }}><Trash2 size={16} /></button></div>))}
      </div>
    </Card>
  );
}

function Ideas({ trip, update }) {
  const [f, setF] = useState({ type: "Photo", note: "" });
  const add = () => { if (!f.note.trim()) return; update({ ideas: [...trip.ideas, { id: uid(), type: f.type, note: f.note.trim(), done: false }] }); setF({ type: f.type, note: "" }); };
  const toggle = (id) => update({ ideas: trip.ideas.map((i) => i.id === id ? { ...i, done: !i.done } : i) });
  const del = (id) => update({ ideas: trip.ideas.filter((i) => i.id !== id) });
  const tone = { Photo: C.coral, Activity: C.jade };
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <SectionTitle>Add a photo or activity idea</SectionTitle>
        <div style={{ display: "flex", gap: 10 }}><select className="inp" style={{ width: 130 }} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option>Photo</option><option>Activity</option></select><input className="inp" placeholder="e.g. Sunrise from Indian Nose" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} onKeyDown={(e) => e.key === "Enter" && add()} /><button className="btn" onClick={add} style={{ background: C.jade, color: "#fff", padding: "9px 16px" }}><Plus size={16} /></button></div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
        {trip.ideas.map((i) => { const Ic = i.type === "Photo" ? Camera : Lightbulb;
          return (<div key={i.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 15, opacity: i.done ? .55 : 1 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}><span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 600, color: tone[i.type] }}><Ic size={14} /> {i.type}</span><button className="btn" onClick={() => del(i.id)} style={{ background: "transparent", color: C.muted, padding: 2 }}><Trash2 size={14} /></button></div><div style={{ fontSize: 14, lineHeight: 1.45, textDecoration: i.done ? "line-through" : "none" }}>{i.note}</div><button className="btn" onClick={() => toggle(i.id)} style={{ marginTop: 11, background: i.done ? C.paper : tone[i.type], color: i.done ? C.muted : "#fff", padding: "6px 12px", fontSize: 13 }}>{i.done ? "Done \u2713" : "Mark done"}</button></div>);
        })}
      </div>
    </div>
  );
}

function Itinerary({ trip, update, group }) {
  const addDay = () => update({ itinerary: [...trip.itinerary, { id: uid(), day: `Day ${trip.itinerary.length + 1}`, date: "", blocks: [] }] });
  const delDay = (id) => update({ itinerary: trip.itinerary.filter((d) => d.id !== id) });
  const setDay = (id, p) => update({ itinerary: trip.itinerary.map((d) => d.id === id ? { ...d, ...p } : d) });
  const addBlock = (dayId) => setDay(dayId, { blocks: [...trip.itinerary.find(d=>d.id===dayId).blocks, { id: uid(), time: "12:00", activity: "", usd: 0, shared: false }] });
  const setBlock = (dayId, bId, p) => { const day = trip.itinerary.find(d => d.id === dayId); setDay(dayId, { blocks: day.blocks.map((b) => b.id === bId ? { ...b, ...p } : b) }); };
  const delBlock = (dayId, bId) => { const day = trip.itinerary.find(d => d.id === dayId); setDay(dayId, { blocks: day.blocks.filter((b) => b.id !== bId) }); };
  const dayCost = (d) => d.blocks.reduce((a, b) => a + (b.shared ? Number(b.usd||0)/group : Number(b.usd||0)), 0);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 className="fr" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Hour-by-hour plan</h2><button className="btn" onClick={addDay} style={{ background: C.jade, color: "#fff", padding: "9px 14px", display: "flex", gap: 6, alignItems: "center" }}><Plus size={16} /> Add day</button></div>
      {trip.itinerary.map((d) => { const sorted = [...d.blocks].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        return (<Card key={d.id}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <input className="inp fr" style={{ fontSize: 17, fontWeight: 600, flex: 1, minWidth: 160 }} value={d.day} onChange={(e) => setDay(d.id, { day: e.target.value })} />
            <input className="inp" style={{ width: 150 }} type="date" value={d.date || ""} onChange={(e) => setDay(d.id, { date: e.target.value })} />
            <span style={{ background: C.paper, padding: "6px 12px", borderRadius: 8, fontSize: 14, whiteSpace: "nowrap" }}>Day cost: <b style={{ color: C.jade }}>{fmt(dayCost(d))}</b></span>
            <button className="btn" onClick={() => delDay(d.id)} style={{ background: "transparent", color: C.muted, padding: 4 }}><Trash2 size={16} /></button>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {sorted.map((b) => (<div key={b.id} style={{ display: "grid", gridTemplateColumns: "78px 1fr 90px auto auto", gap: 8, alignItems: "center" }}>
              <input className="inp" type="time" value={b.time} onChange={(e) => setBlock(d.id, b.id, { time: e.target.value })} style={{ padding: "6px 8px" }} />
              <input className="inp" placeholder="Activity" value={b.activity} onChange={(e) => setBlock(d.id, b.id, { activity: e.target.value })} style={{ padding: "6px 10px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ fontSize: 13, color: C.muted }}>$</span><input className="inp" type="number" value={b.usd} onChange={(e) => setBlock(d.id, b.id, { usd: Number(e.target.value) || 0 })} style={{ padding: "6px 8px" }} /></div>
              <label style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 12, color: C.muted, cursor: "pointer" }}><input type="checkbox" checked={!!b.shared} onChange={(e) => setBlock(d.id, b.id, { shared: e.target.checked })} /> split</label>
              <button className="btn" onClick={() => delBlock(d.id, b.id)} style={{ background: "transparent", color: C.muted, padding: 3 }}><Trash2 size={15} /></button>
            </div>))}
          </div>
          <button className="btn" onClick={() => addBlock(d.id)} style={{ marginTop: 10, background: C.paper, color: C.jade, padding: "7px 12px", display: "flex", gap: 6, alignItems: "center" }}><Clock size={14} /> Add time block</button>
        </Card>);
      })}
    </div>
  );
}

function Memories({ trip, update }) {
  const [place, setPlace] = useState("");
  const memories = trip.memories || [];
  const addMem = () => { if (!place.trim()) return; update({ memories: [...memories, { id: uid(), place: place.trim(), notes: "", images: [] }] }); setPlace(""); };
  const setMem = (id, p) => update({ memories: (trip.memories || []).map((m) => m.id === id ? { ...m, ...p } : m) });
  const delMem = (id) => update({ memories: memories.filter((m) => m.id !== id) });
  const onFiles = (id, files) => {
    Array.from(files).slice(0, 6).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => { const m = (trip.memories || []).find((x) => x.id === id); setMem(id, { images: [...(m.images || []), { id: uid(), src: reader.result, name: file.name }] }); };
      reader.readAsDataURL(file);
    });
  };
  const delImg = (memId, imgId) => { const m = memories.find((x) => x.id === memId); setMem(memId, { images: m.images.filter((im) => im.id !== imgId) }); };
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <SectionTitle>New memory / place</SectionTitle>
        <div style={{ display: "flex", gap: 10 }}><input className="inp" placeholder="Place name (e.g. Semuc Champey)" value={place} onChange={(e) => setPlace(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMem()} /><button className="btn" onClick={addMem} style={{ background: C.jade, color: "#fff", padding: "9px 16px" }}><Plus size={16} /></button></div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>Add notes, directions, and what to look for \u2014 plus photos/videos. Media syncs with your account (keep phone-sized images so sync stays fast).</div>
      </Card>
      {memories.map((m) => (
        <Card key={m.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><input className="inp fr" style={{ fontSize: 18, fontWeight: 600, flex: 1, marginRight: 10 }} value={m.place} onChange={(e) => setMem(m.id, { place: e.target.value })} /><button className="btn" onClick={() => delMem(m.id)} style={{ background: "transparent", color: C.muted, padding: 4 }}><Trash2 size={16} /></button></div>
          <textarea className="inp" style={{ minHeight: 70, resize: "vertical", marginBottom: 12 }} placeholder="Notes, directions, what it's like, what to look for\u2026" value={m.notes} onChange={(e) => setMem(m.id, { notes: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
            {(m.images || []).map((im) => (<div key={im.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.line}`, aspectRatio: "1", background: C.paper }}>{(/\.(mp4|mov|webm)$/i.test(im.name) || im.src.startsWith("data:video")) ? <video src={im.src} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <img src={im.src} alt={im.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}<button className="btn" onClick={() => delImg(m.id, im.id)} style={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,.6)", color: "#fff", width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}><X size={14} /></button></div>))}
            <label className="btn" style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", justifyContent: "center", border: `2px dashed ${C.line}`, borderRadius: 10, aspectRatio: "1", color: C.muted, cursor: "pointer", background: C.paper }}><ImageIcon size={22} /> <span style={{ fontSize: 12 }}>Add media</span><input type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={(e) => onFiles(m.id, e.target.files)} /></label>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Currency({ trip, update, byCatMine, myTotal }) {
  const [amt, setAmt] = useState("100");
  const rate = trip.currency.perUSD;
  const setRate = (v) => update({ currency: { ...trip.currency, perUSD: Number(v) || 0 } });
  const n = Number(amt) || 0;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <SectionTitle>{trip.currency.name} ({trip.currency.code})</SectionTitle>
        <div><label style={{ fontSize: 13, color: C.muted }}>1 USD =</label><div style={{ display: "flex", alignItems: "center", gap: 8 }}><input className="inp" style={{ width: 110 }} type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /><span style={{ fontSize: 14 }}>{trip.currency.code}</span></div></div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>Refresh this before you travel \u2014 check xe.com for the live rate.</div>
      </Card>
      <Card>
        <SectionTitle>Quick converter</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 12, alignItems: "center" }}><div><label style={{ fontSize: 13, color: C.muted }}>USD</label><input className="inp" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} /></div><ChevronRight size={22} color={C.muted} style={{ marginTop: 20 }} /><div><label style={{ fontSize: 13, color: C.muted }}>{trip.currency.code}</label><div className="inp fr" style={{ fontSize: 20, color: C.jade, background: C.paper }}>{(n * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div></div>
      </Card>
      <Card>
        <SectionTitle>My budget in local currency</SectionTitle>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(byCatMine).map(([cat, usd]) => (<div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: C.paper, borderRadius: 9, fontSize: 14 }}><span>{cat}</span><span>{fmt(usd)} \u00B7 <b style={{ color: C.jade }}>{(usd * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {trip.currency.code}</b></span></div>))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: C.jadeDeep, color: "#fff", borderRadius: 9, fontSize: 15 }}><b>Total</b><b>{fmt(myTotal)} \u00B7 {(myTotal * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {trip.currency.code}</b></div>
        </div>
      </Card>
    </div>
  );
}

function BookGo({ trip, update }) {
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [checkIn, setCheckIn] = useState(trip.startDate);
  const [checkOut, setCheckOut] = useState(trip.endDate);
  const [dest, setDest] = useState(trip.name);
  const [guests, setGuests] = useState(1);
  const enc = encodeURIComponent;
  const dep = trip.startDate, ret = trip.endDate, ha = trip.homeAirport, da = trip.destAirport;

  const gFlights = `https://www.google.com/travel/flights?q=${enc(`flights from ${ha} to ${da} on ${dep} returning ${ret}`)}`;
  const skyscanner = `https://www.skyscanner.com/transport/flights/${ha.toLowerCase()}/${da.toLowerCase()}/${dep.replace(/-/g,"").slice(2)}/${ret.replace(/-/g,"").slice(2)}/`;
  const kayak = `https://www.kayak.com/flights/${ha}-${da}/${dep}/${ret}`;
  const hostelworld = `https://www.hostelworld.com/search?search_keywords=${enc(dest)}&date_from=${checkIn}&date_to=${checkOut}&number_of_guests=${guests}`;
  const booking = `https://www.booking.com/searchresults.html?ss=${enc(dest)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}`;
  const airbnb = `https://www.airbnb.com/s/${enc(dest)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`;
  const maps = (from && to) ? `https://www.google.com/maps/dir/${enc(from)}/${enc(to)}` : `https://www.google.com/maps/search/${enc(to || dest)}`;
  const uber = (from && to) ? `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${enc(from)}&dropoff[formatted_address]=${enc(to)}` : `https://m.uber.com/`;
  const lyft = (from && to) ? `https://ride.lyft.com/ridetype?origin=${enc(from)}&destination=${enc(to)}` : `https://ride.lyft.com/`;

  const Launch = ({ href, icon: Ic, title, sub, color }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link" style={{ display: "flex", gap: 14, alignItems: "center", background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, textDecoration: "none", color: C.clayText }}><span style={{ width: 42, height: 42, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={22} color={color} /></span><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div><div style={{ fontSize: 13, color: C.muted }}>{sub}</div></div><ExternalLink size={18} color={C.muted} /></a>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card style={{ background: "#fff8ec", border: `1px solid ${C.gold}55` }}><div style={{ fontSize: 14, lineHeight: 1.5 }}><b>Heads up:</b> every button opens the real site in a new tab, pre-filled with your dates and route \u2014 live prices in one click.</div></Card>
      <Card>
        <SectionTitle>Trip details</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
          <div><label style={{ fontSize: 13, color: C.muted }}>Home airport</label><input className="inp" value={trip.homeAirport} onChange={(e) => update({ homeAirport: e.target.value.toUpperCase() })} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>Dest. airport</label><input className="inp" value={trip.destAirport} onChange={(e) => update({ destAirport: e.target.value.toUpperCase() })} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>City / area</label><input className="inp" value={dest} onChange={(e) => setDest(e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>Check-in</label><input className="inp" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>Check-out</label><input className="inp" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>Guests</label><input className="inp" type="number" min="1" value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} /></div>
        </div>
      </Card>
      <Card>
        <SectionTitle>\u2708\uFE0F Flights</SectionTitle>
        <div style={{ display: "grid", gap: 10 }}>
          <Launch href={gFlights} icon={Plane} title="Google Flights" sub={`${ha} \u21C4 ${da} \u00B7 ${dep} \u2192 ${ret}`} color="#3a6ea5" />
          <Launch href={skyscanner} icon={Plane} title="Skyscanner" sub="Compare airlines & flexible dates" color="#0770e3" />
          <Launch href={kayak} icon={Plane} title="Kayak" sub={`${ha}\u2013${da} round trip`} color="#ff690f" />
        </div>
      </Card>
      <Card>
        <SectionTitle>\uD83D\uDECF\uFE0F Stays</SectionTitle>
        <div style={{ display: "grid", gap: 10 }}>
          <Launch href={hostelworld} icon={Hotel} title="Hostelworld" sub={`${dest} \u00B7 ${checkIn} \u2192 ${checkOut} \u00B7 ${guests} guest${guests>1?"s":""}`} color="#f5a623" />
          <Launch href={booking} icon={Hotel} title="Booking.com" sub={`${dest} \u00B7 ${checkIn} \u2192 ${checkOut}`} color="#003580" />
          <Launch href={airbnb} icon={Hotel} title="Airbnb" sub={`${dest} \u00B7 ${guests} guest${guests>1?"s":""}`} color="#ff385c" />
        </div>
      </Card>
      <Card>
        <SectionTitle>\uD83D\uDE97 Getting around</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={{ fontSize: 13, color: C.muted }}>From (address/place)</label><input className="inp" placeholder="e.g. GUA airport" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: C.muted }}>To (address/place)</label><input className="inp" placeholder="e.g. Antigua" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <Launch href={maps} icon={MapPin} title="Google Maps" sub={from && to ? `Directions & distance: ${from} \u2192 ${to}` : `Search ${to || dest}`} color={C.jade} />
          <Launch href={uber} icon={Car} title="Uber" sub={from && to ? `${from} \u2192 ${to}` : "Set pickup & drop-off"} color={C.clayText} />
          <Launch href={lyft} icon={Car} title="Lyft" sub={from && to ? `${from} \u2192 ${to}` : "Set pickup & drop-off"} color="#ff00bf" />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: C.muted }}>Note: Uber & Lyft operate in limited areas abroad \u2014 in Guatemala they mostly work in Guatemala City and Antigua.</div>
      </Card>
    </div>
  );
}
