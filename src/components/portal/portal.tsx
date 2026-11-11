import { useCallback, useEffect, useMemo, useState } from "react";
import { u } from "../../lib/url";
import { events } from "../../content/site";
import {
  STATUSES, SERVICES, blankEntry, currentEmail, deleteEntry, hasSession, isLive, listEntries, saveEntry, signIn, signOut, toCsv,
  type Entry, type EntryInput, type Status,
} from "../../lib/portal-api";
import { ThemeToggle } from "../site/ui";

const todayIso = () => new Date().toLocaleDateString("en-CA");
const fmtDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const statusLabel = (s: Status) => STATUSES.find((x) => x.v === s)?.label || s;

/** Every night on the site, in date order, for the "which events" checkboxes. */
const EVENT_OPTIONS: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  [...events]
    .filter((e) => e.ready && !e.skipGrid)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((e) => {
      const d = new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const label = e.title === "Casa Jaguar Thursdays" ? "Casa Jaguar Thursdays (every week)" : `${d} · ${e.title}`;
      if (!seen.has(label)) { seen.add(label); out.push(label); }
    });
  return out;
})();

export function PortalApp() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setMounted(true); setAuthed(hasSession()); }, []);

  if (!mounted) return <div className="pt__boot">Loading…</div>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Log onOut={() => { signOut(); setAuthed(false); }} />;
}

/* ------------------------------------------------------------------ login */
function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true); setErr("");
    try { await signIn(email, pw); onDone(); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="pt__login">
      <form className="pt__card pt__loginc" onSubmit={submit}>
        <img src={u("/assets/logo-mark.svg")} alt="" width={44} height={44} />
        <h1 className="pt__h">Team log</h1>
        <p className="pt__sub">Connected Tulum. Sign in to see your clients and follow-ups.</p>
        <label className="pt__f">Email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="pt__f">Password<input type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} /></label>
        {err && <p className="pt__err" role="alert">{err}</p>}
        <button className="pt__btn pt__btn--p" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <a className="pt__link" href={u("/")}>← Back to the site</a>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------- log */
type View = "followups" | "all";

function Log({ onOut }: { onOut: () => void }) {
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [err, setErr] = useState("");
  const [view, setView] = useState<View>("followups");
  const [q, setQ] = useState("");
  const [st, setSt] = useState<Status | "">("");
  const [editing, setEditing] = useState<EntryInput | null>(null);

  const load = useCallback(async () => {
    try { setRows(await listEntries()); setErr(""); } catch (e) {
      const m = (e as Error).message;
      if (/sign in again|expired/i.test(m)) onOut(); else setErr(m);
    }
  }, [onOut]);
  useEffect(() => { load(); }, [load]);

  const open = useMemo(() => (rows || []).filter((r) => r.follow_up && r.status !== "done" && r.status !== "lost"), [rows]);
  const today = todayIso();
  const groups = useMemo(() => {
    const sorted = [...open].sort((a, b) => (a.follow_up_date || "9999").localeCompare(b.follow_up_date || "9999"));
    return [
      { key: "over", label: "Overdue", items: sorted.filter((r) => r.follow_up_date && r.follow_up_date < today) },
      { key: "today", label: "Today", items: sorted.filter((r) => r.follow_up_date === today) },
      { key: "next", label: "Coming up", items: sorted.filter((r) => r.follow_up_date && r.follow_up_date > today) },
      { key: "none", label: "No date set", items: sorted.filter((r) => !r.follow_up_date) },
    ].filter((g) => g.items.length);
  }, [open, today]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (st && r.status !== st) return false;
      if (!s) return true;
      return [r.name, r.contact, r.source, r.notes, r.actions_taken, r.other_interest, r.events.join(" "), r.services.join(" ")].join(" ").toLowerCase().includes(s);
    });
  }, [rows, q, st]);

  const markDone = async (r: Entry) => {
    await saveEntry({ ...r, follow_up: false, actions_taken: r.actions_taken ? `${r.actions_taken}\nFollowed up ${todayIso()}` : `Followed up ${todayIso()}` });
    load();
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows || [])], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `connected-tulum-log-${todayIso()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="pt">
      <header className="pt__bar">
        <a className="pt__brand" href={u("/")}><img src={u("/assets/logo-mark.svg")} alt="" width={30} height={30} /><span>Team log</span></a>
        <div className="pt__barr">
          {isLive() && currentEmail() && <span className="pt__who">{currentEmail()}</span>}
          <ThemeToggle />
          <button className="pt__btn" onClick={exportCsv} disabled={!rows?.length}>Export CSV</button>
          {isLive() && <button className="pt__btn" onClick={onOut}>Sign out</button>}
        </div>
      </header>

      {!isLive() && (
        <p className="pt__warn" role="note"><b>Preview mode.</b> The login and saved database aren't connected yet, so entries only stay in this browser. Don't put real client details here until setup is finished.</p>
      )}

      <div className="pt__top">
        <div className="pt__tabs" role="tablist">
          <button role="tab" aria-selected={view === "followups"} className={view === "followups" ? "on" : ""} onClick={() => setView("followups")}>Follow-ups <i>{open.length}</i></button>
          <button role="tab" aria-selected={view === "all"} className={view === "all" ? "on" : ""} onClick={() => setView("all")}>All entries <i>{rows?.length ?? 0}</i></button>
        </div>
        <button className="pt__btn pt__btn--p" onClick={() => setEditing(blankEntry())}>+ New entry</button>
      </div>

      {err && <p className="pt__err" role="alert">{err} <button className="pt__link" onClick={load}>Retry</button></p>}
      {rows === null && !err && <p className="pt__sub">Loading…</p>}

      {rows && view === "followups" && (
        groups.length === 0 ? (
          <div className="pt__empty"><p>No follow-ups waiting.</p><p className="pt__sub">When you log someone and tick "Needs a follow-up", they show up here, oldest first.</p></div>
        ) : groups.map((g) => (
          <section key={g.key} className="pt__grp">
            <h2 className={`pt__gh pt__gh--${g.key}`}>{g.label} <i>{g.items.length}</i></h2>
            <ul className="pt__list">
              {g.items.map((r) => (
                <li key={r.id} className="pt__card pt__row">
                  <button className="pt__rowmain" onClick={() => setEditing(r)}>
                    <b>{r.name}</b>
                    <span className="pt__mut">{r.follow_up_date ? fmtDay(r.follow_up_date) : "No date"}{r.follow_up_note ? ` · ${r.follow_up_note}` : ""}</span>
                    <Chips r={r} />
                  </button>
                  <button className="pt__btn pt__btn--ok" onClick={() => markDone(r)}>Mark done</button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {rows && view === "all" && (
        <>
          <div className="pt__filters">
            <input type="search" placeholder="Search name, event, notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search entries" />
            <select value={st} onChange={(e) => setSt(e.target.value as Status | "")} aria-label="Filter by status">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="pt__empty"><p>{rows.length ? "Nothing matches that." : "No entries yet."}</p></div>
          ) : (
            <ul className="pt__list">
              {filtered.map((r) => (
                <li key={r.id} className="pt__card pt__row">
                  <button className="pt__rowmain" onClick={() => setEditing(r)}>
                    <span className="pt__line"><b>{r.name}</b><span className={`pt__pill pt__pill--${r.status}`}>{statusLabel(r.status)}</span>{r.follow_up && <span className="pt__pill pt__pill--fu">Follow up{r.follow_up_date ? ` · ${fmtDay(r.follow_up_date)}` : ""}</span>}</span>
                    <span className="pt__mut">{[r.contact, r.guests ? `${r.guests} guests` : "", r.trip_dates].filter(Boolean).join(" · ") || "No details"}</span>
                    <Chips r={r} />
                    {r.notes && <span className="pt__note">{r.notes}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {editing && <EntryForm start={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function Chips({ r }: { r: Entry }) {
  const all = [...r.events.map((e) => e.replace(/^[A-Z][a-z]{2} \d+ · /, "")), ...r.services, ...(r.other_interest ? [r.other_interest] : [])];
  if (!all.length) return null;
  return <span className="pt__chips">{all.slice(0, 6).map((c) => <span key={c} className="pt__chip">{c}</span>)}{all.length > 6 && <span className="pt__chip">+{all.length - 6}</span>}</span>;
}

/* ------------------------------------------------------------------- form */
function EntryForm({ start, onClose, onSaved }: { start: EntryInput; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<EntryInput>(start);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof EntryInput>(k: K, v: EntryInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const tog = (k: "events" | "services", v: string) => setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!f.name.trim()) { setErr("Add a name first."); return; }
    setBusy(true); setErr("");
    try { await saveEntry({ ...f, name: f.name.trim() }); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const remove = async () => {
    if (!f.id || !confirm(`Delete ${f.name || "this entry"}? This can't be undone.`)) return;
    setBusy(true);
    try { await deleteEntry(f.id); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };

  return (
    <div className="pt__ov" role="dialog" aria-modal="true" aria-label={f.id ? "Edit entry" : "New entry"} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="pt__sheet" onSubmit={submit}>
        <div className="pt__sh">
          <h2 className="pt__h2">{f.id ? "Edit entry" : "New entry"}</h2>
          <button type="button" className="pt__x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="pt__grid">
          <label className="pt__f">Name<input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus={!f.id} required /></label>
          <label className="pt__f">Phone / WhatsApp / email<input value={f.contact} onChange={(e) => set("contact", e.target.value)} /></label>
          <label className="pt__f">Amount of people<input type="number" min={1} inputMode="numeric" value={f.guests ?? ""} onChange={(e) => set("guests", e.target.value ? Number(e.target.value) : null)} /></label>
          <label className="pt__f">Trip dates<input value={f.trip_dates} onChange={(e) => set("trip_dates", e.target.value)} placeholder="Dec 28 to Jan 4" /></label>
          <label className="pt__f pt__full">Where they came from<input value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="Instagram, referral, promoter, CDMX trip…" /></label>
        </div>

        <fieldset className="pt__fs">
          <legend>Events they want</legend>
          <div className="pt__checks">
            {EVENT_OPTIONS.map((o) => (
              <label key={o} className="pt__ck"><input type="checkbox" checked={f.events.includes(o)} onChange={() => tog("events", o)} /><span>{o}</span></label>
            ))}
          </div>
          <label className="pt__f">Other (anything else they're interested in)<input value={f.other_interest} onChange={(e) => set("other_interest", e.target.value)} /></label>
        </fieldset>

        <fieldset className="pt__fs">
          <legend>What they need</legend>
          <div className="pt__checks">
            {SERVICES.map((o) => (
              <label key={o} className="pt__ck"><input type="checkbox" checked={f.services.includes(o)} onChange={() => tog("services", o)} /><span>{o}</span></label>
            ))}
          </div>
        </fieldset>

        <label className="pt__f pt__full">What we talked about<textarea rows={4} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></label>
        <label className="pt__f pt__full">What I did (actions taken)<textarea rows={3} value={f.actions_taken} onChange={(e) => set("actions_taken", e.target.value)} /></label>

        <div className="pt__grid">
          <label className="pt__f">Status
            <select value={f.status} onChange={(e) => set("status", e.target.value as Status)}>{STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}</select>
          </label>
          <label className="pt__ck pt__ck--big"><input type="checkbox" checked={f.follow_up} onChange={(e) => set("follow_up", e.target.checked)} /><span>Needs a follow-up</span></label>
          {f.follow_up && (
            <>
              <label className="pt__f">Follow up on<input type="date" value={f.follow_up_date || ""} onChange={(e) => set("follow_up_date", e.target.value || null)} /></label>
              <label className="pt__f">What to do<input value={f.follow_up_note} onChange={(e) => set("follow_up_note", e.target.value)} placeholder="Send the table price, confirm the villa…" /></label>
            </>
          )}
        </div>

        {err && <p className="pt__err" role="alert">{err}</p>}
        <div className="pt__act">
          {f.id && <button type="button" className="pt__btn pt__btn--d" onClick={remove} disabled={busy}>Delete</button>}
          <span style={{ flex: 1 }} />
          <button type="button" className="pt__btn" onClick={onClose}>Cancel</button>
          <button className="pt__btn pt__btn--p" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
