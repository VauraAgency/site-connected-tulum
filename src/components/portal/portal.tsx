import { useCallback, useEffect, useMemo, useState } from "react";
import { u } from "../../lib/url";
import { events } from "../../content/site";
import {
  STATUSES, SERVICES, actionsToCsv, blankAction, blankAgent, blankEntry, blankReservation, currentEmail, deleteEntry, fetchRole, hasSession, isLegacy, isLive,
  listActions, listAgentSales, listAgents, listEntries, listRefEvents, listReservations, reservationsToCsv, saveAction, saveEntry, saveReservation, signIn, signOut, toCsv,
  type Action, type ActionInput, type Agent, type AgentInput, type AgentSale, type Entry, type EntryInput, type RefEvent, type Reservation, type ReservationInput, type Role, type Status,
} from "../../lib/portal-api";
import { ThemeToggle } from "../site/ui";
import { ActionForm, ActionsView } from "./actions";
import { AgentForm, AgentsView, MyLink, MySales } from "./agents";
import { ReservationForm, ReservationsView, markCollected, markCompleted, sampleReservation, saveReservationFlow } from "./reservations";
import { downloadCsv, fmtDay, fmtStamp, fmtTime, todayIso } from "./shared";
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
      const label = `${d} · ${e.title}`;
      if (!seen.has(label)) { seen.add(label); out.push(label); }
    });
  return out;
})();

export function PortalApp() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [roleErr, setRoleErr] = useState("");
  useEffect(() => { setMounted(true); setAuthed(hasSession()); }, []);

  const out = () => { signOut(); setRole(null); setAuthed(false); };
  const loadRole = () => {
    setRoleErr("");
    fetchRole().then(setRole).catch((e) => {
      if (/sign in again|expired/i.test((e as Error).message)) out(); else setRoleErr((e as Error).message);
    });
  };
  useEffect(() => { if (authed && !role) loadRole(); }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return <div className="pt__boot">Loading…</div>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  if (roleErr) return <div className="pt__boot"><p className="pt__err" role="alert">{roleErr}</p><button className="pt__btn" onClick={loadRole}>Try again</button></div>;
  if (!role) return <div className="pt__boot">Loading…</div>;
  if (role.role === "none") {
    return (
      <div className="pt__login">
        <div className="pt__card pt__loginc">
          <img src={u("/assets/logo-mark.svg")} alt="" width={44} height={44} />
          <h1 className="pt__h">Not set up yet</h1>
          <p className="pt__sub">{currentEmail()} doesn't have access to the team log yet. Ask Hector to add this email, then sign in again.</p>
          <button className="pt__btn pt__btn--p" onClick={out}>Sign out</button>
        </div>
      </div>
    );
  }
  return <Log onOut={out} agent={role.role === "agent" ? role : null} />;
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
type View = "actions" | "reservations" | "all" | "agents" | "sales" | "link";
type AgentRole = { id: string; name: string; code: string };
type Editing =
  | { kind: "agent"; data: AgentInput }
  | { kind: "entry"; data: EntryInput }
  | { kind: "res"; data: ReservationInput }
  | { kind: "act"; data: ActionInput };

function Log({ onOut, agent }: { onOut: () => void; agent: AgentRole | null }) {
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [res, setRes] = useState<Reservation[]>([]);
  const [acts, setActs] = useState<Action[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<RefEvent[]>([]);
  const [sales, setSales] = useState<AgentSale[]>([]);
  const [err, setErr] = useState("");
  const [view, setView] = useState<View>(agent ? "all" : "actions");
  const [q, setQ] = useState("");
  const [st, setSt] = useState<Status | "">("");
  const [ag, setAg] = useState("");
  const [editing, setEditing] = useState<Editing | null>(null);

  const fail = useCallback((e: unknown) => {
    const m = (e as Error).message;
    if (/sign in again|expired/i.test(m)) onOut(); else setErr(m);
  }, [onOut]);

  const load = useCallback(async () => {
    try {
      if (agent) {
        const [a, sl, ev] = await Promise.all([listEntries(), listAgentSales(), listRefEvents()]);
        setRows(a); setSales(sl); setEvents(ev); setErr("");
        return;
      }
      const [a, b, c] = await Promise.all([listEntries(), listReservations(), listActions()]);
      setRows(a); setRes(b); setActs(c); setErr("");
      if (!isLegacy()) {
        // Agent data is optional: if it can't load, the rest of the log still works.
        const [ags, ev] = await Promise.all([listAgents().catch(() => [] as Agent[]), listRefEvents().catch(() => [] as RefEvent[])]);
        setAgents(ags); setEvents(ev);
      }
    } catch (e) { fail(e); }
  }, [fail, agent]);
  useEffect(() => { load(); }, [load]);

  /** Run a change, then reload everything so counts and totals stay in step. */
  const run = async (fn: () => Promise<unknown>) => { try { await fn(); await load(); } catch (e) { fail(e); } };

  // Agents' clients live in Hector's Clients tab, but their follow-ups stay with the agent, not in his action register.
  const ownRows = useMemo(() => (rows || []).filter((r) => !r.agent_id), [rows]);
  const agentName = (id: string | null) => agents.find((a) => a.id === id)?.name || "";

  const openCount = useMemo(
    () => ownRows.filter((r) => r.follow_up && r.status !== "done" && r.status !== "lost").length + acts.filter((a) => a.status === "open").length,
    [ownRows, acts],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (st && r.status !== st) return false;
      if (ag === "_none" ? r.agent_id : ag && r.agent_id !== ag) return false;
      if (!s) return true;
      return [r.name, r.contact, r.source, r.notes, r.actions_taken, r.other_interest, r.events.join(" "), r.services.join(" "), agentName(r.agent_id)].join(" ").toLowerCase().includes(s);
    });
  }, [rows, q, st, ag, agents]); // eslint-disable-line react-hooks/exhaustive-deps

  const markEntryDone = (r: Entry) =>
    run(() => saveEntry({ ...r, follow_up: false, actions_taken: r.actions_taken ? `${r.actions_taken}\nFollowed up ${todayIso()}` : `Followed up ${todayIso()}` }));

  const exportCsv = () => {
    if (view === "reservations") downloadCsv(reservationsToCsv(res), "connected-tulum-reservations");
    else if (view === "actions") downloadCsv(actionsToCsv(acts), "connected-tulum-actions");
    else downloadCsv(toCsv(rows || []), "connected-tulum-log");
  };
  const exportCount =
    view === "reservations" ? res.length : view === "actions" ? acts.length : view === "all" ? rows?.length ?? 0 : 0;

  const newLabel = view === "reservations" ? "+ New reservation" : view === "actions" ? "+ New task" : view === "agents" ? "+ New agent" : agent ? "+ New client" : "+ New entry";
  const canNew = !(view === "sales" || view === "link");
  const startNew = () =>
    setEditing(
      view === "reservations" ? { kind: "res", data: blankReservation() }
      : view === "actions" ? { kind: "act", data: blankAction() }
      : view === "agents" ? { kind: "agent", data: blankAgent() }
      : { kind: "entry", data: blankEntry() },
    );

  const close = () => setEditing(null);
  const saved = () => { setEditing(null); load(); };

  return (
    <div className="pt">
      <header className="pt__bar">
        <a className="pt__brand" href={u("/")}><img src={u("/assets/logo-mark.svg")} alt="" width={30} height={30} /><span>{agent ? `Hi ${agent.name.split(" ")[0]}` : "Team log"}</span></a>
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
          {!agent && <button role="tab" aria-selected={view === "actions"} className={view === "actions" ? "on" : ""} onClick={() => setView("actions")}>Actions <i>{openCount}</i></button>}
          {!agent && <button role="tab" aria-selected={view === "reservations"} className={view === "reservations" ? "on" : ""} onClick={() => setView("reservations")}>Reservations <i>{res.length}</i></button>}
          <button role="tab" aria-selected={view === "all"} className={view === "all" ? "on" : ""} onClick={() => setView("all")}>Clients <i>{rows?.length ?? 0}</i></button>
          {!agent && !isLegacy() && <button role="tab" aria-selected={view === "agents"} className={view === "agents" ? "on" : ""} onClick={() => setView("agents")}>Agents <i>{agents.length}</i></button>}
          {agent && <button role="tab" aria-selected={view === "sales"} className={view === "sales" ? "on" : ""} onClick={() => setView("sales")}>My sales <i>{sales.length}</i></button>}
          {agent && <button role="tab" aria-selected={view === "link"} className={view === "link" ? "on" : ""} onClick={() => setView("link")}>My link</button>}
        </div>
        {canNew && <button className="pt__btn pt__btn--p" onClick={startNew}>{newLabel}</button>}
      </div>

      {err && <p className="pt__err" role="alert">{err} <button className="pt__link" onClick={load}>Retry</button></p>}
      {rows === null && !err && <p className="pt__sub">Loading…</p>}

      {rows && view === "actions" && (
        <ActionsView
          entries={ownRows} res={res} acts={acts}
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
          agents={agents}
          onOpen={(r) => setEditing({ kind: "res", data: r })}
          onCompleted={(r) => run(() => markCompleted(r, acts))}
          onCollected={(r) => run(() => markCollected(r, acts))}
          onSample={() => run(() => saveReservationFlow(sampleReservation(), true, acts))}
        />
      )}

      {rows && view === "agents" && !agent && (
        <AgentsView
          agents={agents} entries={rows} res={res} events={events}
          onOpen={(a) => setEditing({ kind: "agent", data: a })}
          onNew={() => setEditing({ kind: "agent", data: blankAgent() })}
          onMarkPaid={(r) => run(() => saveReservation({ ...r, agent_status: "paid", agent_paid_on: todayIso() }))}
          onOpenRes={(r) => setEditing({ kind: "res", data: r })}
        />
      )}

      {rows && view === "sales" && agent && <MySales sales={sales} />}
      {rows && view === "link" && agent && <MyLink code={agent.code} events={events} />}

      {rows && view === "all" && (
        <>
          <div className={`pt__filters${!agent && agents.length > 0 ? " pt__filters--3" : ""}`}>
            <input type="search" placeholder="Search name, event, notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search entries" />
            <select value={st} onChange={(e) => setSt(e.target.value as Status | "")} aria-label="Filter by status">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
            {!agent && agents.length > 0 && (
              <select value={ag} onChange={(e) => setAg(e.target.value)} aria-label="Filter by agent">
                <option value="">Everyone</option>
                <option value="_none">Our own clients</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="pt__empty"><p>{rows.length ? "Nothing matches that." : "No entries yet."}</p></div>
          ) : (
            <ul className="pt__list">
              {filtered.map((r) => (
                <li key={r.id} className="pt__card pt__row">
                  <button className="pt__rowmain" onClick={() => setEditing({ kind: "entry", data: r })}>
                    <span className="pt__line"><b>{r.name}</b><span className={`pt__pill pt__pill--${r.status}`}>{statusLabel(r.status)}</span>{r.follow_up && <span className="pt__pill pt__pill--fu">Follow up{r.follow_up_date ? ` · ${fmtDay(r.follow_up_date)}` : ""}</span>}{!agent && r.agent_id && <span className="pt__pill pt__pill--ag">via {agentName(r.agent_id) || "agent"}</span>}</span>
                    <span className="pt__mut">{[r.contact, r.guests ? `${r.guests} guests` : "", r.trip_dates, r.need_date || r.need_time ? `Needs it ${[r.need_date ? fmtDay(r.need_date) : "", r.need_time ? `at ${fmtTime(r.need_time)}` : ""].filter(Boolean).join(" ")}` : ""].filter(Boolean).join(" · ") || "No details"}</span>
                    <span className="pt__mut pt__stamp">Logged {fmtStamp(r.created_at)}</span>
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
          agents={agent ? [] : agents} forceAgent={agent?.id ?? null}
          onReserve={agent ? undefined : (e) => {
            const a = agents.find((x) => x.id === e.agent_id);
            setEditing({
              kind: "res",
              data: {
                ...blankReservation(), entry_id: e.id, customer_name: e.name, customer_contact: e.contact, guests: e.guests, service: e.services[0] || "",
                reservation_date: e.need_date || todayIso(), reservation_time: e.need_time ? e.need_time.slice(0, 5) : null,
                ...(a ? { agent_id: a.id, agent_basis: a.commission_basis, agent_rate: a.commission_rate, agent_flat: a.commission_flat } : {}),
              },
            });
          }}
        />
      )}
      {editing?.kind === "res" && <ReservationForm start={editing.data} entries={rows || []} agents={agents} acts={acts} onClose={close} onSaved={saved} />}
      {editing?.kind === "agent" && <AgentForm start={editing.data} onClose={close} onSaved={saved} />}
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
function EntryForm({ start, onClose, onSaved, onReserve, agents, forceAgent }: {
  start: EntryInput; onClose: () => void; onSaved: () => void; onReserve?: (e: Entry) => void; agents: Agent[]; forceAgent: string | null;
}) {
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
    try { await saveEntry({ ...f, name: f.name.trim(), agent_id: forceAgent ?? f.agent_id }); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const reserve = async () => {
    if (!f.name.trim()) { setErr("Add a name first."); return; }
    setBusy(true); setErr("");
    try { const e = await saveEntry({ ...f, name: f.name.trim(), agent_id: forceAgent ?? f.agent_id }); onReserve?.(e); } catch (e) { setErr((e as Error).message); setBusy(false); }
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
          <div>
            <h2 className="pt__h2">{f.id ? "Edit entry" : "New entry"}</h2>
            {(start as Partial<Entry>).created_at && <span className="pt__mut pt__stamp">Logged {fmtStamp((start as Partial<Entry>).created_at as string)}</span>}
          </div>
          <button type="button" className="pt__x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="pt__grid">
          <label className="pt__f">Name<input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus={!f.id} required /></label>
          <label className="pt__f">Phone / WhatsApp / email<input value={f.contact} onChange={(e) => set("contact", e.target.value)} /></label>
          <label className="pt__f">Amount of people<input type="number" min={1} inputMode="numeric" value={f.guests ?? ""} onChange={(e) => set("guests", e.target.value ? Number(e.target.value) : null)} /></label>
          <label className="pt__f">Trip dates<input value={f.trip_dates} onChange={(e) => set("trip_dates", e.target.value)} placeholder="Dec 28 to Jan 4" /></label>
          {!isLegacy() && <label className="pt__f">Day they need the table / booking<input type="date" value={f.need_date || ""} onChange={(e) => set("need_date", e.target.value || null)} /></label>}
          {!isLegacy() && <label className="pt__f">Arrival time / time of booking<input type="time" value={f.need_time ? f.need_time.slice(0, 5) : ""} onChange={(e) => set("need_time", e.target.value || null)} /></label>}
          {agents.length > 0 && !isLegacy() && (
            <label className="pt__f">Sent by an agent
              <select value={f.agent_id || ""} onChange={(e) => set("agent_id", e.target.value || null)}>
                <option value="">No, our own client</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
          )}
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
