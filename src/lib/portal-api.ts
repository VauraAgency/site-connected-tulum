import { PORTAL } from "./portal-config";

/* ================================================================== types */
export type Status = "new" | "in_progress" | "booked" | "done" | "lost";

export type Entry = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact: string;
  source: string;
  events: string[];
  other_interest: string;
  guests: number | null;
  trip_dates: string;
  services: string[];
  notes: string;
  actions_taken: string;
  status: Status;
  follow_up: boolean;
  follow_up_date: string | null;
  follow_up_note: string;
};
export type EntryInput = Omit<Entry, "id" | "created_at" | "updated_at"> & { id?: string };

export type ResStatus = "confirmed" | "completed" | "cancelled";
export type CommStatus = "pending" | "invoiced" | "partial" | "collected" | "written_off";
export type Currency = "USD" | "MXN" | "EUR";

export type Reservation = {
  id: string;
  created_at: string;
  updated_at: string;
  entry_id: string | null;
  customer_name: string;
  customer_contact: string;
  guests: number | null;
  service: string;
  venue: string;
  details: string;
  reservation_date: string;
  res_status: ResStatus;
  currency: Currency;
  total_amount: number;
  amount_paid: number;
  payment_method: string;
  paid_to: "" | "venue" | "connected";
  paid_on: string | null;
  commission_basis: "percent" | "flat";
  commission_rate: number;
  commission_amount: number;
  commission_payer: string;
  commission_status: CommStatus;
  commission_due: string | null;
  commission_collected: number;
  commission_collected_on: string | null;
  commission_ref: string;
  notes: string;
};
export type ReservationInput = Omit<Reservation, "id" | "created_at" | "updated_at"> & { id?: string };

export type ActionType = "follow_up" | "commission" | "payment" | "booking" | "other";
export type Priority = "low" | "normal" | "high";
export type Action = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  details: string;
  type: ActionType;
  priority: Priority;
  owner: string;
  due_date: string | null;
  status: "open" | "done";
  completed_at: string | null;
  entry_id: string | null;
  reservation_id: string | null;
};
export type ActionInput = Omit<Action, "id" | "created_at" | "updated_at"> & { id?: string };

/* ============================================================ option lists */
export const STATUSES: { v: Status; label: string }[] = [
  { v: "new", label: "New" },
  { v: "in_progress", label: "In progress" },
  { v: "booked", label: "Booked" },
  { v: "done", label: "Done" },
  { v: "lost", label: "Lost" },
];

export const SERVICES = [
  "Table",
  "Villa",
  "Yacht",
  "Airport transfer (ground transport)",
  "Restaurant / dinner",
  "Beach club",
  "Private chef",
  "Photo / video",
  "Private event",
  "Music studio / retreat",
];

export const RES_STATUSES: { v: ResStatus; label: string }[] = [
  { v: "confirmed", label: "Confirmed (upcoming)" },
  { v: "completed", label: "Completed" },
  { v: "cancelled", label: "Cancelled" },
];

export const COMM_STATUSES: { v: CommStatus; label: string }[] = [
  { v: "pending", label: "Pending (not asked for yet)" },
  { v: "invoiced", label: "Invoiced / requested" },
  { v: "partial", label: "Partly collected" },
  { v: "collected", label: "Collected" },
  { v: "written_off", label: "Written off" },
];

export const CURRENCIES: Currency[] = ["USD", "MXN", "EUR"];
export const PAY_METHODS = ["Cash", "Card", "Bank transfer / SPEI", "Zelle / Venmo", "Crypto", "Other"];
export const PAID_TO = [
  { v: "", label: "Not sure" },
  { v: "venue", label: "The venue / provider directly" },
  { v: "connected", label: "Connected Tulum" },
];

export const ACTION_TYPES: { v: ActionType; label: string }[] = [
  { v: "follow_up", label: "Follow up with a client" },
  { v: "commission", label: "Collect a commission" },
  { v: "payment", label: "Payment / deposit" },
  { v: "booking", label: "Booking to confirm" },
  { v: "other", label: "Other" },
];
export const PRIORITIES: { v: Priority; label: string }[] = [
  { v: "high", label: "High" },
  { v: "normal", label: "Normal" },
  { v: "low", label: "Low" },
];
export const TEAM = ["Hector", "Benji"];

export const isLive = () => !!(PORTAL.url && PORTAL.anonKey);

/* ============================================================ blank records */
const today = () => new Date().toLocaleDateString("en-CA");

export const blankEntry = (): EntryInput => ({
  name: "", contact: "", source: "", events: [], other_interest: "", guests: null, trip_dates: "",
  services: [], notes: "", actions_taken: "", status: "new", follow_up: false, follow_up_date: null, follow_up_note: "",
});

export const blankReservation = (): ReservationInput => ({
  entry_id: null, customer_name: "", customer_contact: "", guests: null,
  service: "", venue: "", details: "", reservation_date: today(), res_status: "confirmed",
  currency: "USD", total_amount: 0, amount_paid: 0, payment_method: "", paid_to: "", paid_on: null,
  commission_basis: "percent", commission_rate: 0, commission_amount: 0, commission_payer: "",
  commission_status: "pending", commission_due: null, commission_collected: 0, commission_collected_on: null, commission_ref: "",
  notes: "",
});

export const blankAction = (): ActionInput => ({
  title: "", details: "", type: "follow_up", priority: "normal", owner: "", due_date: null,
  status: "open", completed_at: null, entry_id: null, reservation_id: null,
});

/* ============================================================== money math */
const r2 = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
const num = (n: unknown) => { const v = Number(n); return Number.isFinite(v) && v > 0 ? v : 0; };

export const money = (n: number, cur: string = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n);

/** What Connected Tulum should earn on a reservation, from its basis. */
export const commissionFor = (r: Pick<Reservation, "commission_basis" | "commission_rate" | "commission_amount" | "total_amount">) =>
  r.commission_basis === "percent" ? r2((num(r.total_amount) * num(r.commission_rate)) / 100) : r2(num(r.commission_amount));

/** Commission still waiting to be collected (zero when written off or the reservation was cancelled). */
export const commOutstanding = (r: Reservation) =>
  r.commission_status === "written_off" || r.res_status === "cancelled" ? 0 : Math.max(0, r2(r.commission_amount - r.commission_collected));

export const balanceDue = (r: Reservation) => Math.max(0, r2(r.total_amount - r.amount_paid));

export const payState = (r: Reservation): "paid" | "partial" | "unpaid" =>
  r.total_amount > 0 && r.amount_paid >= r.total_amount ? "paid" : r.amount_paid > 0 ? "partial" : "unpaid";

export const commOverdue = (r: Reservation, day: string) =>
  r.res_status === "completed" && commOutstanding(r) > 0 && !!r.commission_due && r.commission_due < day;

/* ================================================================== session */
type Session = { access_token: string; refresh_token: string; expires_at: number; email: string };
const SKEY = "ct-portal-session";

const readSession = (): Session | null => {
  try { const s = localStorage.getItem(SKEY); return s ? (JSON.parse(s) as Session) : null; } catch { return null; }
};
const writeSession = (s: Session | null) => {
  try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch { /* private mode */ }
};

export const currentEmail = (): string | null => readSession()?.email ?? null;
export const hasSession = () => !isLive() || !!readSession();

async function authCall(path: string, body: unknown): Promise<Session> {
  const r = await fetch(`${PORTAL.url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: PORTAL.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error_description || j.msg || j.message || "Sign in failed");
  return {
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600),
    email: j.user?.email || "",
  };
}

export async function signIn(email: string, password: string) {
  const s = await authCall("token?grant_type=password", { email: email.trim(), password });
  writeSession(s);
}

export function signOut() { writeSession(null); }

async function token(): Promise<string> {
  let s = readSession();
  if (!s) throw new Error("Please sign in again");
  if (s.expires_at - 60 < Date.now() / 1000) {
    try {
      s = { ...(await authCall("token?grant_type=refresh_token", { refresh_token: s.refresh_token })), email: s.email };
      writeSession(s);
    } catch {
      writeSession(null);
      throw new Error("Session expired. Please sign in again.");
    }
  }
  return s.access_token;
}

async function rest(table: string, method: string, query: string, body?: unknown) {
  const r = await fetch(`${PORTAL.url}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: PORTAL.anonKey,
      Authorization: `Bearer ${await token()}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (r.status === 401) { writeSession(null); throw new Error("Session expired. Please sign in again."); }
  const text = await r.text();
  const j = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(j?.message || "Something went wrong saving. Try again.");
  return j;
}

/* ============================================================ table helper */
type Base = { id: string; created_at: string; updated_at: string };

/**
 * One small CRUD helper per table. Live mode talks to Supabase (Row Level Security does the locking);
 * preview mode (no Supabase config) keeps rows in this browser only.
 */
function makeStore<T extends Base>(table: string, lkey: string, normalize: (x: Record<string, unknown>) => Record<string, unknown>) {
  const readL = (): T[] => { try { return JSON.parse(localStorage.getItem(lkey) || "[]") as T[]; } catch { return []; } };
  const writeL = (rows: T[]) => { try { localStorage.setItem(lkey, JSON.stringify(rows)); } catch { /* private mode */ } };
  return {
    async list(): Promise<T[]> {
      if (!isLive()) return readL().sort((a, b) => b.created_at.localeCompare(a.created_at));
      return (await rest(table, "GET", "?select=*&order=created_at.desc")) as T[];
    },
    async save(input: Record<string, unknown> & { id?: string }): Promise<T> {
      const clean = normalize(input);
      const { id, created_at: _c, updated_at: _u, ...patch } = clean as Record<string, unknown> & { id?: string; created_at?: unknown; updated_at?: unknown };
      if (!isLive()) {
        const rows = readL();
        const now = new Date().toISOString();
        if (id) {
          const i = rows.findIndex((r) => r.id === id);
          const next = { ...rows[i], ...patch, id, updated_at: now } as T;
          rows[i] = next; writeL(rows); return next;
        }
        const row = { ...patch, id: crypto.randomUUID(), created_at: now, updated_at: now } as unknown as T;
        writeL([row, ...rows]); return row;
      }
      if (id) return ((await rest(table, "PATCH", `?id=eq.${id}`, patch)) as T[])[0];
      return ((await rest(table, "POST", "", patch)) as T[])[0];
    },
    async remove(id: string) {
      if (!isLive()) { writeL(readL().filter((r) => r.id !== id)); return; }
      await rest(table, "DELETE", `?id=eq.${id}`);
    },
  };
}

const nul = (v: unknown) => (v === "" || v === undefined ? null : v);

const entries = makeStore<Entry>("log_entries", "ct-portal-local", (e) => ({
  ...e, follow_up_date: e.follow_up && e.follow_up_date ? e.follow_up_date : null,
}));

const reservations = makeStore<Reservation>("reservations", "ct-portal-local-res", (x) => {
  const r = x as unknown as ReservationInput;
  const percent = r.commission_basis !== "flat";
  const total = r2(num(r.total_amount));
  const amount = commissionFor({ commission_basis: r.commission_basis, commission_rate: r.commission_rate, commission_amount: r.commission_amount, total_amount: total });
  let collected = r2(num(r.commission_collected));
  let on = nul(r.commission_collected_on) as string | null;
  let status = r.commission_status;
  // Keep the collection fields honest with each other.
  if (status === "collected" && collected < amount) collected = amount;
  if (status !== "written_off") {
    if (amount > 0 && collected >= amount) status = "collected";
    else if (collected > 0 && (status === "pending" || status === "invoiced" || status === "collected")) status = "partial";
  }
  if (collected > 0 && !on) on = today();
  return {
    ...x,
    entry_id: nul(r.entry_id),
    guests: r.guests ? Number(r.guests) : null,
    total_amount: total,
    amount_paid: r2(num(r.amount_paid)),
    paid_on: nul(r.paid_on),
    commission_rate: percent ? r2(num(r.commission_rate)) : 0,
    commission_amount: amount,
    commission_collected: collected,
    commission_collected_on: on,
    commission_status: status,
    commission_due: nul(r.commission_due),
  };
});

const actions = makeStore<Action>("actions", "ct-portal-local-act", (x) => {
  const a = x as unknown as ActionInput;
  const done = a.status === "done";
  return {
    ...x,
    due_date: nul(a.due_date),
    entry_id: nul(a.entry_id),
    reservation_id: nul(a.reservation_id),
    completed_at: done ? a.completed_at || new Date().toISOString() : null,
  };
});

export const listEntries = () => entries.list();
export const saveEntry = (e: EntryInput) => entries.save(e);
export const deleteEntry = (id: string) => entries.remove(id);

export const listReservations = () => reservations.list();
export const saveReservation = (r: ReservationInput) => reservations.save(r);
export const deleteReservation = (id: string) => reservations.remove(id);

export const listActions = () => actions.list();
export const saveAction = (a: ActionInput) => actions.save(a);
export const deleteAction = (id: string) => actions.remove(id);

/* ================================================================== export */
function csv<T>(cols: [string, (r: T) => string | number][], rows: T[]): string {
  const esc = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
  return "﻿" + [cols.map((c) => esc(c[0])).join(","), ...rows.map((r) => cols.map((c) => esc(c[1](r))).join(","))].join("\r\n");
}

export const toCsv = (rows: Entry[]) => csv<Entry>([
  ["Date logged", (r) => r.created_at.slice(0, 10)],
  ["Name", (r) => r.name],
  ["Contact", (r) => r.contact],
  ["Source", (r) => r.source],
  ["Events", (r) => r.events.join("; ")],
  ["Other interest", (r) => r.other_interest],
  ["Guests", (r) => r.guests ?? ""],
  ["Trip dates", (r) => r.trip_dates],
  ["Needs", (r) => r.services.join("; ")],
  ["Notes", (r) => r.notes],
  ["What I did", (r) => r.actions_taken],
  ["Status", (r) => STATUSES.find((s) => s.v === r.status)?.label || r.status],
  ["Follow up", (r) => (r.follow_up ? "Yes" : "No")],
  ["Follow up date", (r) => r.follow_up_date || ""],
  ["Follow up note", (r) => r.follow_up_note],
], rows);

export const reservationsToCsv = (rows: Reservation[]) => csv<Reservation>([
  ["Reservation date", (r) => r.reservation_date],
  ["Status", (r) => RES_STATUSES.find((s) => s.v === r.res_status)?.label || r.res_status],
  ["Customer", (r) => r.customer_name],
  ["Contact", (r) => r.customer_contact],
  ["Guests", (r) => r.guests ?? ""],
  ["Service", (r) => r.service],
  ["Venue / event", (r) => r.venue],
  ["Details", (r) => r.details],
  ["Currency", (r) => r.currency],
  ["Total", (r) => r.total_amount],
  ["Paid", (r) => r.amount_paid],
  ["Balance", (r) => balanceDue(r)],
  ["Payment method", (r) => r.payment_method],
  ["Paid to", (r) => PAID_TO.find((p) => p.v === r.paid_to)?.label || ""],
  ["Paid on", (r) => r.paid_on || ""],
  ["Commission basis", (r) => (r.commission_basis === "percent" ? `${r.commission_rate}%` : "Flat")],
  ["Commission expected", (r) => r.commission_amount],
  ["Commission paid by", (r) => r.commission_payer],
  ["Commission status", (r) => COMM_STATUSES.find((s) => s.v === r.commission_status)?.label || r.commission_status],
  ["Commission due", (r) => r.commission_due || ""],
  ["Commission collected", (r) => r.commission_collected],
  ["Commission outstanding", (r) => commOutstanding(r)],
  ["Collected on", (r) => r.commission_collected_on || ""],
  ["Reference", (r) => r.commission_ref],
  ["Notes", (r) => r.notes],
], rows);

export const actionsToCsv = (rows: Action[]) => csv<Action>([
  ["Task", (r) => r.title],
  ["Type", (r) => ACTION_TYPES.find((t) => t.v === r.type)?.label || r.type],
  ["Status", (r) => (r.status === "done" ? "Done" : "Open")],
  ["Priority", (r) => r.priority],
  ["Owner", (r) => r.owner],
  ["Due", (r) => r.due_date || ""],
  ["Completed", (r) => (r.completed_at ? r.completed_at.slice(0, 10) : "")],
  ["Details", (r) => r.details],
  ["Created", (r) => r.created_at.slice(0, 10)],
], rows);
