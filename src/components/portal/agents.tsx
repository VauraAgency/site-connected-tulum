import { useMemo, useState } from "react";
import {
  AGENT_BASES, blankAgent, deleteAgent, money, saveAgent,
  type Agent, type AgentBasis, type AgentInput, type AgentSale, type Entry, type RefEvent, type Reservation,
} from "../../lib/portal-api";
import { Num, Sheet, fmtDate, fmtTime } from "./shared";

export const SITE = "https://connectedtulum.com";
export const refLink = (code: string) => `${SITE}/ref/${code}`;

const DAY = 86_400_000;
const slug = (s: string) => s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);

const basisText = (a: Pick<Agent, "commission_basis" | "commission_rate" | "commission_flat">) =>
  a.commission_basis === "flat" ? (a.commission_flat ? `${money(a.commission_flat)} flat` : "No rate set")
    : a.commission_rate ? `${a.commission_rate}% of ${a.commission_basis === "percent_total" ? "the sale" : "our commission"}` : "No rate set";

/** "$120 + MX$500" style total, one entry per currency. */
function byCurrency(rows: { currency: string; amount: number }[]): string {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(r.currency, (m.get(r.currency) || 0) + r.amount));
  const parts = [...m].filter(([, v]) => v > 0).map(([c, v]) => money(v, c));
  return parts.length ? parts.join(" + ") : money(0);
}

function CopyBtn({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button" className="pt__btn"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { window.prompt("Copy this link:", text); }
      }}
    >{done ? "Copied" : label}</button>
  );
}

export function eventCounts(events: RefEvent[], agentId?: string) {
  const since = Date.now() - 30 * DAY;
  const mine = agentId ? events.filter((e) => e.agent_id === agentId) : events;
  const count = (k: RefEvent["kind"], recent: boolean) => mine.filter((e) => e.kind === k && (!recent || new Date(e.created_at).getTime() >= since)).length;
  return {
    visits: count("visit", true), whatsapp: count("whatsapp", true), tickets: count("ticket", true),
    allVisits: count("visit", false), allWhatsapp: count("whatsapp", false), allTickets: count("ticket", false),
  };
}

/* ============================================================== Hector's tab */
export function AgentsView({ agents, entries, res, events, onOpen, onNew, onMarkPaid, onOpenRes }: {
  agents: Agent[];
  entries: Entry[];
  res: Reservation[];
  events: RefEvent[];
  onOpen: (a: Agent) => void;
  onNew: () => void;
  onMarkPaid: (r: Reservation) => void;
  onOpenRes: (r: Reservation) => void;
}) {
  const live = res.filter((r) => r.agent_id && r.res_status !== "cancelled");
  const owedRows = useMemo(
    () => live.filter((r) => r.agent_status === "pending" && r.agent_amount > 0).sort((a, b) => a.reservation_date.localeCompare(b.reservation_date)),
    [res], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const nameOf = (id: string | null) => agents.find((a) => a.id === id)?.name || "Agent";

  if (!agents.length) {
    return (
      <div className="pt__empty">
        <p>No agents yet.</p>
        <p className="pt__sub">Add the people who send you clients. Each one gets their own link, their own login, and their commission is tracked here.</p>
        <button className="pt__btn pt__btn--p" onClick={onNew} style={{ marginTop: 12 }}>+ New agent</button>
      </div>
    );
  }

  return (
    <>
      <div className="pt__sums">
        <div className="pt__sumrow" aria-label="Agent payout totals">
          <Stat label="Agents" value={String(agents.filter((a) => a.active).length)} sub={`${agents.length} total`} />
          <Stat label="Clients logged by agents" value={String(entries.filter((e) => e.agent_id).length)} />
          <Stat label="Owed to agents" value={byCurrency(owedRows.map((r) => ({ currency: r.currency, amount: r.agent_amount })))} sub={`${owedRows.length} payouts`} />
          <Stat label="Paid out" value={byCurrency(live.filter((r) => r.agent_status === "paid").map((r) => ({ currency: r.currency, amount: r.agent_amount })))} />
        </div>
      </div>

      <h2 className="pt__h3">Agents</h2>
      <ul className="pt__list">
        {agents.map((a) => {
          const ev = eventCounts(events, a.id);
          const leads = entries.filter((e) => e.agent_id === a.id);
          const sales = live.filter((r) => r.agent_id === a.id);
          const owed = sales.filter((r) => r.agent_status === "pending");
          const paid = sales.filter((r) => r.agent_status === "paid");
          return (
            <li key={a.id} className="pt__card pt__row pt__row--col">
              <button className="pt__rowmain" onClick={() => onOpen(a)}>
                <span className="pt__line">
                  <b>{a.name}</b>
                  {!a.active && <span className="pt__pill pt__pill--lost">Inactive</span>}
                  <span className="pt__pill pt__pill--ag">{basisText(a)}</span>
                </span>
                <span className="pt__mut">{[a.email, a.phone].filter(Boolean).join(" · ")}</span>
                <span className="pt__money">
                  <span>Link visits <b>{ev.visits}</b> <i className="pt__mut">(30 days)</i></span>
                  <span>WhatsApp clicks <b>{ev.whatsapp}</b></span>
                  <span>Clients logged <b>{leads.length}</b></span>
                  <span>Sales <b>{sales.length}</b></span>
                  <span>Owed <b>{byCurrency(owed.map((r) => ({ currency: r.currency, amount: r.agent_amount })))}</b></span>
                  <span>Paid <b>{byCurrency(paid.map((r) => ({ currency: r.currency, amount: r.agent_amount })))}</b></span>
                </span>
              </button>
              <div className="pt__linkrow">
                <code className="pt__code">{refLink(a.code)}</code>
                <CopyBtn text={refLink(a.code)} />
              </div>
            </li>
          );
        })}
      </ul>

      <h2 className="pt__h3">Commissions owed to agents</h2>
      {owedRows.length === 0 ? (
        <div className="pt__empty"><p className="pt__sub">Nothing owed right now. Link a reservation to an agent and their payout shows up here.</p></div>
      ) : (
        <ul className="pt__list">
          {owedRows.map((r) => (
            <li key={r.id} className="pt__card pt__row">
              <button className="pt__rowmain" onClick={() => onOpenRes(r)}>
                <span className="pt__line">
                  <b>{nameOf(r.agent_id)}</b>
                  <span className={`pt__pill pt__pill--r_${r.res_status}`}>{r.res_status === "completed" ? "Completed" : "Upcoming"}</span>
                </span>
                <span className="pt__mut">
                  {[r.customer_name, `${fmtDate(r.reservation_date)}${r.reservation_time ? ` at ${fmtTime(r.reservation_time)}` : ""}`, r.venue].filter(Boolean).join(" · ")}
                </span>
                <span className="pt__money"><span>Owed <b>{money(r.agent_amount, r.currency)}</b></span><span>Sale <b>{money(r.total_amount, r.currency)}</b></span></span>
              </button>
              <button className="pt__btn pt__btn--ok" onClick={() => onMarkPaid(r)}>Mark paid</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="pt__stat">
      <span className="pt__statl">{label}</span>
      <b>{value}</b>
      {sub && <span className="pt__statsub">{sub}</span>}
    </div>
  );
}

/* ================================================================ agent form */
export function AgentForm({ start, onClose, onSaved }: { start: AgentInput; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<AgentInput>(start);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [codeTouched, setCodeTouched] = useState(!!start.id);
  const set = <K extends keyof AgentInput>(k: K, v: AgentInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const code = slug(f.code);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!f.name.trim()) { setErr("Add the agent's name."); return; }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setErr("Add the email they will sign in with."); return; }
    if (code.length < 2) { setErr("Pick a link name (letters and numbers, at least 2)."); return; }
    setBusy(true); setErr("");
    try { await saveAgent({ ...f, code }); onSaved(); }
    catch (e) {
      const m = (e as Error).message;
      setErr(/duplicate|unique/i.test(m) ? "That email or link name is already used by another agent." : m);
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!f.id || !confirm(`Delete ${f.name}? Their logged clients stay in the log but are no longer tied to an agent. This can't be undone. (To just pause them, untick Active instead.)`)) return;
    setBusy(true);
    try { await deleteAgent(f.id); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };

  return (
    <Sheet title={f.id ? "Edit agent" : "New agent"} onClose={onClose} onSubmit={submit}>
      <div className="pt__grid">
        <label className="pt__f">Name
          <input value={f.name} autoFocus={!f.id} required onChange={(e) => { set("name", e.target.value); if (!codeTouched) set("code", slug(e.target.value.split(" ")[0] || "")); }} />
        </label>
        <label className="pt__f">Login email<input type="email" value={f.email} required onChange={(e) => set("email", e.target.value)} /></label>
        <label className="pt__f">Phone / WhatsApp<input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
        <label className="pt__f">Link name<input value={f.code} onChange={(e) => { setCodeTouched(true); set("code", e.target.value); }} placeholder="arantxa" /></label>
      </div>
      <p className="pt__calc">Their link <b>{code ? refLink(code) : "…"}</b></p>

      <fieldset className="pt__fs">
        <legend>What they earn by default</legend>
        <div className="pt__grid">
          <label className="pt__f">How it's calculated
            <select value={f.commission_basis} onChange={(e) => set("commission_basis", e.target.value as AgentBasis)}>{AGENT_BASES.map((b) => <option key={b.v} value={b.v}>{b.label}</option>)}</select>
          </label>
          {f.commission_basis === "flat" ? (
            <label className="pt__f">Flat amount per sale<Num value={f.commission_flat} onChange={(n) => set("commission_flat", n)} /></label>
          ) : (
            <label className="pt__f">Percent<Num value={f.commission_rate} onChange={(n) => set("commission_rate", Math.min(100, n))} max={100} /></label>
          )}
        </div>
        <p className="pt__sub">This fills in when you link a reservation to them. You can change it on any single reservation.</p>
      </fieldset>

      <label className="pt__ck pt__ck--big"><input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /><span>Active (can sign in and their link counts)</span></label>
      <label className="pt__f pt__full">Notes<textarea rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></label>

      {!f.id && <p className="pt__sub">After saving, also add this email under Authentication, Users in Supabase so they can sign in. Only emails listed here can see anything.</p>}
      {err && <p className="pt__err" role="alert">{err}</p>}
      <div className="pt__act">
        {f.id && <button type="button" className="pt__btn pt__btn--d" onClick={remove} disabled={busy}>Delete</button>}
        <span style={{ flex: 1 }} />
        <button type="button" className="pt__btn" onClick={onClose}>Cancel</button>
        <button className="pt__btn pt__btn--p" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      </div>
    </Sheet>
  );
}

export const newAgent = blankAgent;

/* ============================================================ the agent's own */
export function MyLink({ code, events }: { code: string; events: RefEvent[] }) {
  const c = eventCounts(events);
  return (
    <>
      <div className="pt__card pt__linkcard">
        <h2 className="pt__h3" style={{ marginTop: 0 }}>Your link</h2>
        <p className="pt__sub">Share this link. Anyone who opens it and then messages or buys is tracked to you.</p>
        <div className="pt__linkrow">
          <code className="pt__code">{refLink(code)}</code>
          <CopyBtn text={refLink(code)} />
        </div>
      </div>
      <div className="pt__sums">
        <div className="pt__sumrow pt__sumrow--3">
          <Stat label="Link opens" value={String(c.visits)} sub={`last 30 days · ${c.allVisits} total`} />
          <Stat label="WhatsApp taps" value={String(c.whatsapp)} sub={`last 30 days · ${c.allWhatsapp} total`} />
          <Stat label="Ticket clicks" value={String(c.tickets)} sub={`last 30 days · ${c.allTickets} total`} />
        </div>
      </div>
      <p className="pt__sub">Ticket purchases on Ticket Fairy or Eventbrite happen on their site, so we can only see the click. Add every client you send in the Clients tab so you get credit.</p>
    </>
  );
}

export function MySales({ sales }: { sales: AgentSale[] }) {
  const live = sales.filter((s) => s.res_status !== "cancelled");
  const owed = live.filter((s) => s.agent_status === "pending");
  const paid = live.filter((s) => s.agent_status === "paid");
  if (!sales.length) {
    return (
      <div className="pt__empty">
        <p>No sales yet.</p>
        <p className="pt__sub">When a client you sent books, it shows up here with your commission and whether it has been paid.</p>
      </div>
    );
  }
  return (
    <>
      <div className="pt__sums">
        <div className="pt__sumrow pt__sumrow--3">
          <Stat label="Sales" value={String(live.length)} />
          <Stat label="Owed to you" value={byCurrency(owed.map((s) => ({ currency: s.currency, amount: s.agent_amount })))} />
          <Stat label="Paid to you" value={byCurrency(paid.map((s) => ({ currency: s.currency, amount: s.agent_amount })))} />
        </div>
      </div>
      <ul className="pt__list">
        {sales.map((s) => (
          <li key={s.id} className="pt__card pt__row">
            <div className="pt__rowmain">
              <span className="pt__line">
                <b>{s.customer_name}</b>
                <span className={`pt__pill pt__pill--r_${s.res_status}`}>{s.res_status === "confirmed" ? "Upcoming" : s.res_status === "completed" ? "Completed" : "Cancelled"}</span>
                {s.res_status !== "cancelled" && <span className={`pt__pill ${s.agent_status === "paid" ? "pt__pill--c_collected" : "pt__pill--c_pending"}`}>{s.agent_status === "paid" ? `Paid${s.agent_paid_on ? ` ${fmtDate(s.agent_paid_on)}` : ""}` : "Owed"}</span>}
              </span>
              <span className="pt__mut">
                {[`${fmtDate(s.reservation_date)}${s.reservation_time ? ` at ${fmtTime(s.reservation_time)}` : ""}`, s.venue, s.service, s.guests ? `${s.guests} guests` : ""].filter(Boolean).join(" · ")}
              </span>
              <span className="pt__money"><span>Your commission <b>{money(s.agent_amount, s.currency)}</b></span></span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
