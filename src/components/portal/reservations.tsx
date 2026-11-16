import { useMemo, useState } from "react";
import { events } from "../../content/site";
import {
  COMM_STATUSES, CURRENCIES, PAID_TO, PAY_METHODS, RES_STATUSES, SERVICES,
  balanceDue, blankAction, commOutstanding, commOverdue, commissionFor, deleteReservation, money, payState,
  saveAction, saveReservation,
  type Action, type CommStatus, type Currency, type Entry, type Reservation, type ReservationInput,
} from "../../lib/portal-api";
import { Num, Sheet, fmtDate, todayIso } from "./shared";

const VENUES = [...new Set(events.map((e) => e.venue).filter(Boolean))].sort() as string[];

const RES_LABEL: Record<string, string> = { confirmed: "Upcoming", completed: "Completed", cancelled: "Cancelled" };
const COMM_LABEL: Record<CommStatus, string> = {
  pending: "Commission pending", invoiced: "Commission invoiced", partial: "Part collected", collected: "Commission collected", written_off: "Written off",
};
const PAY_LABEL = { paid: "Paid in full", partial: "Part paid", unpaid: "Unpaid" } as const;

/* ------------------------------------------------------------ save workflow */
/**
 * Saves a reservation and keeps its collection reminder in step:
 *  - commission still owed and asked to add a task  -> creates one "Collect commission" action
 *  - an open one exists and the due date moved       -> updates its due date
 *  - nothing left to collect (collected / written off / cancelled) -> closes the open action
 */
export async function saveReservationFlow(input: ReservationInput, addAction: boolean, acts: Action[]): Promise<Reservation> {
  const saved = await saveReservation(input);
  const owed = commOutstanding(saved);
  const open = acts.filter((a) => a.reservation_id === saved.id && a.type === "commission" && a.status === "open");
  if (owed <= 0) {
    for (const a of open) await saveAction({ ...a, status: "done" });
  } else if (open.length) {
    for (const a of open) if (a.due_date !== saved.commission_due) await saveAction({ ...a, due_date: saved.commission_due });
  } else if (addAction) {
    await saveAction({
      ...blankAction(),
      title: `Collect commission: ${saved.customer_name}`,
      details: `${money(owed, saved.currency)} from ${saved.commission_payer || saved.venue || "the venue"} for ${fmtDate(saved.reservation_date)}`,
      type: "commission",
      due_date: saved.commission_due,
      entry_id: saved.entry_id,
      reservation_id: saved.id,
    });
  }
  return saved;
}

export const markCompleted = (r: Reservation, acts: Action[]) => saveReservationFlow({ ...r, res_status: "completed" }, true, acts);
export const markCollected = (r: Reservation, acts: Action[]) =>
  saveReservationFlow({ ...r, commission_status: "collected", commission_collected: r.commission_amount, commission_collected_on: todayIso() }, false, acts);

const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); };

/** A clearly marked example so the whole flow can be tried (and deleted) in one click. */
export const sampleReservation = (): ReservationInput => ({
  entry_id: null,
  customer_name: "Sample guest (test, safe to delete)",
  customer_contact: "+1 555 0100",
  guests: 6,
  service: "Table",
  venue: "Casa Jaguar",
  details: "Sample table with bottle service",
  reservation_date: addDays(-3),
  res_status: "completed",
  currency: "USD",
  total_amount: 2400,
  amount_paid: 2400,
  payment_method: "Card",
  paid_to: "venue",
  paid_on: addDays(-3),
  commission_basis: "percent",
  commission_rate: 15,
  commission_amount: 360,
  commission_payer: "Casa Jaguar",
  commission_status: "invoiced",
  commission_due: addDays(7),
  commission_collected: 0,
  commission_collected_on: null,
  commission_ref: "",
  notes: "Created from the sample button. Delete it once you've tried the workflow.",
});

/* -------------------------------------------------------------------- view */
type Filter = "completed" | "upcoming" | "collect" | "cancelled" | "all";

export function ReservationsView({ res, onOpen, onCompleted, onCollected, onSample }: {
  res: Reservation[];
  onOpen: (r: Reservation) => void;
  onCompleted: (r: Reservation) => void;
  onCollected: (r: Reservation) => void;
  onSample: () => void;
}) {
  const [f, setF] = useState<Filter>("completed");
  const [q, setQ] = useState("");
  const today = todayIso();

  const counts = useMemo(() => ({
    completed: res.filter((r) => r.res_status === "completed").length,
    upcoming: res.filter((r) => r.res_status === "confirmed").length,
    collect: res.filter((r) => r.res_status === "completed" && commOutstanding(r) > 0).length,
    cancelled: res.filter((r) => r.res_status === "cancelled").length,
    all: res.length,
  }), [res]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let rows = res.filter((r) => {
      if (f === "completed" && r.res_status !== "completed") return false;
      if (f === "upcoming" && r.res_status !== "confirmed") return false;
      if (f === "cancelled" && r.res_status !== "cancelled") return false;
      if (f === "collect" && !(r.res_status === "completed" && commOutstanding(r) > 0)) return false;
      if (!s) return true;
      return [r.customer_name, r.customer_contact, r.venue, r.service, r.details, r.commission_payer, r.commission_ref, r.notes].join(" ").toLowerCase().includes(s);
    });
    rows = [...rows].sort((a, b) => {
      if (f === "upcoming") return a.reservation_date.localeCompare(b.reservation_date);
      if (f === "collect") return (a.commission_due || "9999").localeCompare(b.commission_due || "9999") || a.reservation_date.localeCompare(b.reservation_date);
      return b.reservation_date.localeCompare(a.reservation_date);
    });
    return rows;
  }, [res, f, q]);

  const chips: { v: Filter; label: string }[] = [
    { v: "completed", label: "Completed" }, { v: "upcoming", label: "Upcoming" }, { v: "collect", label: "To collect" },
    { v: "cancelled", label: "Cancelled" }, { v: "all", label: "All" },
  ];

  return (
    <>
      <Summary res={res} today={today} />

      <div className="pt__fchips" role="group" aria-label="Filter reservations">
        {chips.map((c) => (
          <button key={c.v} className={f === c.v ? "on" : ""} aria-pressed={f === c.v} onClick={() => setF(c.v)}>
            {c.label} <i>{counts[c.v]}</i>
          </button>
        ))}
      </div>
      <div className="pt__filters pt__filters--1">
        <input type="search" placeholder="Search customer, venue, notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search reservations" />
      </div>

      {list.length === 0 ? (
        <div className="pt__empty">
          <p>{res.length === 0 ? "No reservations yet." : "Nothing here."}</p>
          <p className="pt__sub">
            {res.length === 0
              ? "Add a reservation once a booking is confirmed. Mark it completed after the night and the commission shows up under To collect."
              : f === "collect" ? "No commissions waiting to be collected." : "Try another tab."}
          </p>
          {res.length === 0 && <button className="pt__btn" onClick={onSample} style={{ marginTop: 12 }}>Add a sample reservation to try it</button>}
        </div>
      ) : (
        <ul className="pt__list">
          {list.map((r) => {
            const owed = commOutstanding(r);
            const overdue = commOverdue(r, today);
            const pay = payState(r);
            const canComplete = r.res_status === "confirmed" && r.reservation_date <= today;
            const canCollect = r.res_status === "completed" && owed > 0;
            return (
              <li key={r.id} className="pt__card pt__row">
                <button className="pt__rowmain" onClick={() => onOpen(r)}>
                  <span className="pt__line">
                    <b>{r.customer_name}</b>
                    <span className={`pt__pill pt__pill--r_${r.res_status}`}>{RES_LABEL[r.res_status]}</span>
                    {r.res_status !== "cancelled" && <span className={`pt__pill pt__pill--p_${pay}`}>{PAY_LABEL[pay]}</span>}
                    {r.res_status !== "cancelled" && r.commission_amount > 0 && (
                      <span className={`pt__pill ${overdue ? "pt__pill--overdue" : `pt__pill--c_${r.commission_status}`}`}>
                        {overdue ? "Commission overdue" : COMM_LABEL[r.commission_status]}
                      </span>
                    )}
                  </span>
                  <span className="pt__mut">
                    {[fmtDate(r.reservation_date), r.venue, r.service, r.guests ? `${r.guests} guests` : ""].filter(Boolean).join(" · ")}
                  </span>
                  <span className="pt__money">
                    <span>Total <b>{money(r.total_amount, r.currency)}</b></span>
                    <span>Paid <b>{money(r.amount_paid, r.currency)}</b></span>
                    {r.commission_amount > 0 && <span>Commission <b>{money(r.commission_amount, r.currency)}</b></span>}
                    {r.commission_amount > 0 && r.commission_collected > 0 && <span>Collected <b>{money(r.commission_collected, r.currency)}</b></span>}
                    {owed > 0 && r.res_status === "completed" && <span className={overdue ? "pt__bad" : ""}>To collect <b>{money(owed, r.currency)}</b>{r.commission_due ? ` by ${fmtDate(r.commission_due)}` : ""}</span>}
                  </span>
                </button>
                {canComplete && <button className="pt__btn pt__btn--ok" onClick={() => onCompleted(r)}>Mark completed</button>}
                {canCollect && <button className="pt__btn pt__btn--ok" onClick={() => onCollected(r)}>Mark collected</button>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/** Totals for completed reservations, one row per currency. */
function Summary({ res, today }: { res: Reservation[]; today: string }) {
  const done = res.filter((r) => r.res_status === "completed");
  const curs: Currency[] = done.length ? CURRENCIES.filter((c) => done.some((r) => r.currency === c)) : ["USD"];
  return (
    <div className="pt__sums">
      {curs.map((c) => {
        const rows = done.filter((r) => r.currency === c);
        const live = rows.filter((r) => r.commission_status !== "written_off");
        const sales = rows.reduce((s, r) => s + r.total_amount, 0);
        const earned = live.reduce((s, r) => s + r.commission_amount, 0);
        const got = live.reduce((s, r) => s + r.commission_collected, 0);
        const owed = rows.reduce((s, r) => s + commOutstanding(r), 0);
        const late = rows.filter((r) => commOverdue(r, today)).length;
        return (
          <div key={c} className="pt__sumrow" aria-label={`Completed reservations totals in ${c}`}>
            {curs.length > 1 && <span className="pt__cur">{c}</span>}
            <Stat label="Sales" value={money(sales, c)} sub={`${rows.length} completed`} />
            <Stat label="Commission earned" value={money(earned, c)} />
            <Stat label="Collected" value={money(got, c)} />
            <Stat label="Still to collect" value={money(owed, c)} sub={late ? `${late} overdue` : undefined} bad={late > 0} />
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value, sub, bad }: { label: string; value: string; sub?: string; bad?: boolean }) {
  return (
    <div className="pt__stat">
      <span className="pt__statl">{label}</span>
      <b>{value}</b>
      {sub && <span className={`pt__statsub ${bad ? "pt__bad" : ""}`}>{sub}</span>}
    </div>
  );
}

/* -------------------------------------------------------------------- form */
export function ReservationForm({ start, entries, acts, onClose, onSaved }: {
  start: ReservationInput;
  entries: Entry[];
  acts: Action[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<ReservationInput>(start);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof ReservationInput>(k: K, v: ReservationInput[K]) => setF((p) => ({ ...p, [k]: v }));

  const expected = commissionFor(f);
  const owed = Math.max(0, expected - f.commission_collected);
  const hasOpenTask = !!f.id && acts.some((a) => a.reservation_id === f.id && a.type === "commission" && a.status === "open");
  const canAddTask = f.res_status !== "cancelled" && expected > 0 && f.commission_status !== "written_off" && owed > 0 && !hasOpenTask;
  const [addTask, setAddTask] = useState(!f.id);

  const pickEntry = (id: string) => {
    const e = entries.find((x) => x.id === id);
    setF((p) => ({
      ...p,
      entry_id: id || null,
      customer_name: p.customer_name || e?.name || "",
      customer_contact: p.customer_contact || e?.contact || "",
      guests: p.guests ?? e?.guests ?? null,
      service: p.service || e?.services[0] || "",
    }));
  };

  const setCommStatus = (v: CommStatus) =>
    setF((p) => {
      const amt = commissionFor(p);
      if (v === "collected") return { ...p, commission_status: v, commission_collected: Math.max(p.commission_collected, amt), commission_collected_on: p.commission_collected_on || todayIso() };
      return { ...p, commission_status: v };
    });

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!f.customer_name.trim()) { setErr("Add the customer's name first."); return; }
    if (!f.reservation_date) { setErr("Pick the reservation date."); return; }
    setBusy(true); setErr("");
    try { await saveReservationFlow({ ...f, customer_name: f.customer_name.trim() }, addTask && canAddTask, acts); onSaved(); }
    catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const remove = async () => {
    if (!f.id || !confirm(`Delete the reservation for ${f.customer_name || "this customer"}? This can't be undone.`)) return;
    setBusy(true);
    try { await deleteReservation(f.id); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };

  const cur = f.currency;
  return (
    <Sheet title={f.id ? "Edit reservation" : "New reservation"} onClose={onClose} onSubmit={submit}>
      <fieldset className="pt__fs">
        <legend>Customer</legend>
        {entries.length > 0 && (
          <label className="pt__f">From the client log (optional)
            <select value={f.entry_id || ""} onChange={(e) => pickEntry(e.target.value)}>
              <option value="">Not linked</option>
              {entries.map((e) => <option key={e.id} value={e.id}>{e.name}{e.contact ? ` · ${e.contact}` : ""}</option>)}
            </select>
          </label>
        )}
        <div className="pt__grid">
          <label className="pt__f">Customer name<input value={f.customer_name} onChange={(e) => set("customer_name", e.target.value)} autoFocus={!f.id} required /></label>
          <label className="pt__f">Phone / WhatsApp / email<input value={f.customer_contact} onChange={(e) => set("customer_contact", e.target.value)} /></label>
          <label className="pt__f">Amount of people<input type="number" min={1} inputMode="numeric" value={f.guests ?? ""} onChange={(e) => set("guests", e.target.value ? Number(e.target.value) : null)} /></label>
        </div>
      </fieldset>

      <fieldset className="pt__fs">
        <legend>Reservation</legend>
        <div className="pt__grid">
          <label className="pt__f">Reservation date<input type="date" value={f.reservation_date} onChange={(e) => set("reservation_date", e.target.value)} required /></label>
          <label className="pt__f">Status
            <select value={f.res_status} onChange={(e) => set("res_status", e.target.value as ReservationInput["res_status"])}>{RES_STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}</select>
          </label>
          <label className="pt__f">What was booked
            <select value={f.service} onChange={(e) => set("service", e.target.value)}>
              <option value="">Choose…</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="pt__f">Venue / event
            <input list="pt-venues" value={f.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Casa Jaguar, Bagatelle…" />
            <datalist id="pt-venues">{VENUES.map((v) => <option key={v} value={v} />)}</datalist>
          </label>
          <label className="pt__f pt__full">Details<input value={f.details} onChange={(e) => set("details", e.target.value)} placeholder="Table 12, villa name, boat, pickup time…" /></label>
        </div>
      </fieldset>

      <fieldset className="pt__fs">
        <legend>Payment from the customer</legend>
        <div className="pt__grid">
          <label className="pt__f">Currency
            <select value={cur} onChange={(e) => set("currency", e.target.value as Currency)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="pt__f">Total price<Num value={f.total_amount} onChange={(n) => set("total_amount", n)} /></label>
          <label className="pt__f">Paid so far<Num value={f.amount_paid} onChange={(n) => set("amount_paid", n)} /></label>
          <p className="pt__calc">Balance due <b>{money(Math.max(0, f.total_amount - f.amount_paid), cur)}</b></p>
          <label className="pt__f">Payment method
            <select value={f.payment_method} onChange={(e) => set("payment_method", e.target.value)}>
              <option value="">Choose…</option>
              {PAY_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="pt__f">They paid
            <select value={f.paid_to} onChange={(e) => set("paid_to", e.target.value as ReservationInput["paid_to"])}>{PAID_TO.map((p) => <option key={p.v} value={p.v}>{p.label}</option>)}</select>
          </label>
          <label className="pt__f">Paid on<input type="date" value={f.paid_on || ""} onChange={(e) => set("paid_on", e.target.value || null)} /></label>
        </div>
      </fieldset>

      <fieldset className="pt__fs">
        <legend>Our commission</legend>
        <div className="pt__grid">
          <label className="pt__f">How it's calculated
            <select value={f.commission_basis} onChange={(e) => set("commission_basis", e.target.value as "percent" | "flat")}>
              <option value="percent">Percent of the total</option>
              <option value="flat">Flat amount</option>
            </select>
          </label>
          {f.commission_basis === "percent" ? (
            <label className="pt__f">Commission %<Num value={f.commission_rate} onChange={(n) => set("commission_rate", Math.min(100, n))} max={100} /></label>
          ) : (
            <label className="pt__f">Commission amount<Num value={f.commission_amount} onChange={(n) => set("commission_amount", n)} /></label>
          )}
          <p className="pt__calc">Commission expected <b>{money(expected, cur)}</b></p>
          <label className="pt__f">Who pays it
            <input value={f.commission_payer} onChange={(e) => set("commission_payer", e.target.value)} placeholder="The venue or provider" list="pt-venues" />
          </label>
          <label className="pt__f">Collection status
            <select value={f.commission_status} onChange={(e) => setCommStatus(e.target.value as CommStatus)}>{COMM_STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}</select>
          </label>
          <label className="pt__f">Due by<input type="date" value={f.commission_due || ""} onChange={(e) => set("commission_due", e.target.value || null)} /></label>
          <label className="pt__f">Collected so far<Num value={f.commission_collected} onChange={(n) => set("commission_collected", n)} /></label>
          <label className="pt__f">Collected on<input type="date" value={f.commission_collected_on || ""} onChange={(e) => set("commission_collected_on", e.target.value || null)} /></label>
          <label className="pt__f">Invoice / transfer reference<input value={f.commission_ref} onChange={(e) => set("commission_ref", e.target.value)} /></label>
          <p className="pt__calc">Still to collect <b>{f.commission_status === "written_off" ? money(0, cur) : money(owed, cur)}</b></p>
        </div>
        {canAddTask && (
          <label className="pt__ck pt__ck--big">
            <input type="checkbox" checked={addTask} onChange={(e) => setAddTask(e.target.checked)} />
            <span>Add a task to collect this commission{f.commission_due ? ` (due ${fmtDate(f.commission_due)})` : ""}</span>
          </label>
        )}
        {hasOpenTask && <p className="pt__sub">A collection task is already open on the Actions tab. It closes by itself once the commission is fully collected.</p>}
      </fieldset>

      <label className="pt__f pt__full">Notes<textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></label>

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
