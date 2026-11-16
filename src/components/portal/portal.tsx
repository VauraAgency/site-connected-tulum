import { useCallback, useEffect, useMemo, useState } from "react";
import { u } from "../../lib/url";
import { events } from "../../content/site";
import {
  STATUSES, SERVICES, actionsToCsv, blankAction, blankEntry, blankReservation, currentEmail, deleteEntry, hasSession, isLive,
  listActions, listEntries, listReservations, reservationsToCsv, saveAction, saveEntry, signIn, signOut, toCsv,
  type Action, type ActionInput, type Entry, type EntryInput, type Reservation, type ReservationInput, type Status,
} from "../../lib/portal-api";
import { ThemeToggle } from "../site/ui";
import { ActionForm, ActionsView } from "./actions";
import { ReservationForm, ReservationsView, markCollected, markCompleted, sampleReservation, saveReservationFlow } from "./reservations";
import { downloadCsv, fmtDay, todayIso } from "./shared";
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
type View = "actions" | "reservations" | "all";
type Editing =
  | { kind: "entry"; data: EntryInput }
  | { kind: "res"; data: ReservationInput }
  | { kind: "act"; data: ActionInput };

function Log({ onOut }: { onOut: () => void }) {
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [res, setRes] = useState<Reservation[]>([]);
  const [acts, setActs] = useState<Action[]>([]);
  const [err, setErr] = useState("");
  const [view, setView] = useState<View>("actions");
  const [q, setQ] = useState("");
  const [st, setSt] = useState<Status | "">("");
  const [editing, setEditing] = useState<Editing | null>(null);

  const fail = useCallback((e: unknown) => {
    const m = (e as Error).message;
    if (/sign in again|expired/i.test(m)) onOut(); else setErr(m);
  }, [onOut]);

  const load = useCallback(async () => {
    try {
      const [a, b, c] = await Promise.all([listEntries(), listReservations(), listActions()]);
      setRows(a); setRes(b); setActs(c); setErr("");
    } catch (e) { fail(e); }
  }, [fail]);
  useEffect(() => { load(); }, [load]);

  /** Run a change, then reload everything so counts and totals stay in step. */
  const run = async (fn: () => Promise<unknown>) => { try { await fn(); await load(); } catch (e) { fail(e); } };

  const openCount = useMemo(
    () => (rows || []).filter((r) => r.follow_up && r.status !== "done" && r.status !== "lost").length + acts.filter((a) => a.status === "open").length,
    [rows, acts],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (st && r.status !== st) return false;
      if (!s) return true;
      return [r.name, r.contact, r.source, r.notes, r.actions_taken, r.other_interest, r.events.join(" "), r.services.join(" ")].join(" ").toLowerCase().includes(s);
    });
  }, [rows, q, st]);

  const markEntryDone = (r: Entry) =>
    run(() => saveEntry({ ...r, follow_up: false, actions_taken: r.actions_taken ? `${r.actions_taken}\nFollowed up ${todayIso()}` : `Followed up ${todayIso()}` }));

  const exportCsv = () => {
    if (view === "reservations") downloadCsv(reservationsToCsv(res), "connected-tulum-reservations");
    else if (view === "actions") downloadCsv(actionsToCsv(acts), "connected-tulum-actions");
    else downloadCsv(toCsv(rows || []), "connected-tulum-log");
  };
  const exportCount = view === "reservations" ? res.length : view === "actions" ? acts.length : rows?.length ?? 0;

  const newLabel = view === "reservations" ? "+ New reservation" : view === "actions" ? "+ New task" : "+ New entry";
  const startNew = () =>
    setEditing(view === "reservations" ? { kind: "res", data: blankReservation() } : view === "actions" ? { kind: "act", data: blankAction() } : { kind: "entry", data: blankEntry() });

  const close = () => setEditing(null);
  const saved = () => { setEditing(null); load(); };

  return (
    <div className="pt">
      <header className="pt__bar">
        <a className="pt__brand" href={u("/")}><img src={u("/assets/logo-mark.svg")} alt="" width={30} height={30} /><span>Team log</span></a>
        <div className="pt__barr">
          {isLive() && currentEmail() && <span className="pt__who">{currentEmail()}</span>}
          <ThemeToggle />
          <button className="pt__btn" onClick={exportCsv} disabled={!exportCount}>Export CSV</button>
          {isLive() && <button className="pt__btn" onClick={onOut}>Sign out</button>}
        </div>
      </header>

      {!isLive() && (
        <p className="pt__warn" role="note"><b>Preview mode.</b> The login and saved database aren't connected yet, so entries only stay in this browser. Don't put real client details here until setup is finished.</p>
      )}

      <div className="pt__top">
        <div className="pt__tabs" role="tablist">
          <button role="tab" aria-selected={view === "actions"} className={view === "actions" ? "on" : ""} onClick={() => setView("actions")}>Actions <i>{openCount}</i></button>
          <button role="tab" aria-selected={view === "reservations"} className={view === "reservations" ? "on" : ""} onClick={() => setView("reservations")}>Reservations <i>{res.length}</i></button>
          <button role="tab" aria-selected={view === "all"} className={view === "all" ? "on" : ""} onClick={() => setView("all")}>Clients <i>{rows?.length ?? 0}</i></button>
        </div>
        <button className="pt__btn pt__btn--p" onClick={startNew}>{newLabel}</button>
      </div>

      {err && <p className="pt__err" role="alert">{err} <button className="pt__link" onClick={load}>Retry</button></p>}
      {rows === null && !err && <p className="pt__sub">Loading…</p>}

      {rows && view === "actions" && (
        <ActionsView
          entries={rows} res={res} acts={acts}
          onOpenEntry={(e) => setEditing({ kind: "entry", data: e })}
          onOpenAction={(a) => setEditing({ kind: "act", data: a })}
          onDoneEntry={markEntryDone}
          onDoneAction={(a) => run(() => saveAction({ ...a, status: "done" }))}
          onReopen={(a) => run(() => saveAction({ ...a, status: "open" }))}
        />
      )}

      {rows && view === "reservations" && (
        <ReservationsView
          res={res}
          onOpen={(r) => setEditing({ kind: "res", data: r })}
          onCompleted={(r) => run(() => markCompleted(r, acts))}
          onCollected={(r) => run(() => markCollected(r, acts))}
          onSample={() => run(() => saveReservationFlow(sampleReservation(), true, acts))}
        />
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
                  <button className="pt__rowmain" onClick={() => setEditing({ kind: "entry", data: r })}>
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

      {editing?.kind === "entry" && (
        <EntryForm
          start={editing.data} onClose={close} onSaved={saved}
          onReserve={(e) => setEditing({
            kind: "res",
            data: { ...blankReservation(), entry_id: e.id, customer_name: e.name, customer_contact: e.contact, guests: e.guests, service: e.services[0] || "" },
          })}
        />
      )}
      {editing?.kind === "res" && <ReservationForm start={editing.data} entries={rows || []} acts={acts} onClose={close} onSaved={saved} />}
      {editing?.kind === "act" && <ActionForm start={editing.data} entries={rows || []} res={res} onClose={close} onSaved={saved} />}
    </div>
  );
}

function Chips({ r }: { r: Entry }) {
  const all = [...r.events.map((e) => e.replace(/^[A-Z][a-z]{2} \d+ · /, "")), ...r.services, ...(r.other_interest ? [r.other_interest] : [])];
  if (!all.length) return null;
  return <span className="pt__chips">{all.slice(0, 6).map((c) => <span key={c} className="pt__chip">{c}</span>)}{all.length > 6 && <span className="pt__chip">+{all.length - 6}</span>}</span>;
}

/* ------------------------------------------------------------------- form */
function EntryForm({ start, onClose, onSaved, onReserve }: { start: EntryInput; onClose: () => void; onSaved: () => void; onReserve?: (e: Entry) => void }) {
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
  const reserve = async () => {
    if (!f.name.trim()) { setErr("Add a name first."); return; }
    setBusy(true); setErr("");
    try { const e = await saveEntry({ ...f, name: f.name.trim() }); onReserve?.(e); } catch (e) { setErr((e as Error).message); setBusy(false); }
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
          {f.id && onReserve && <button type="button" className="pt__btn" onClick={reserve} disabled={busy}>+ Reservation</button>}
          <button type="button" className="pt__btn" onClick={onClose}>Cancel</button>
          <button className="pt__btn pt__btn--p" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
