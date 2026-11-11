import { PORTAL } from "./portal-config";

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

export const isLive = () => !!(PORTAL.url && PORTAL.anonKey);

export const blankEntry = (): EntryInput => ({
  name: "", contact: "", source: "", events: [], other_interest: "", guests: null, trip_dates: "",
  services: [], notes: "", actions_taken: "", status: "new", follow_up: false, follow_up_date: null, follow_up_note: "",
});

/* ------------------------------------------------------------------ session */
type Session = { access_token: string; refresh_token: string; expires_at: number; email: string };
const SKEY = "ct-portal-session";
const LKEY = "ct-portal-local";

const readSession = (): Session | null => {
  try { const s = localStorage.getItem(SKEY); return s ? (JSON.parse(s) as Session) : null; } catch { return null; }
};
const writeSession = (s: Session | null) => {
  try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch { /* private mode */ }
};

export const currentEmail = (): string | null => readSession()?.email ?? null;

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

async function rest(method: string, query: string, body?: unknown) {
  const r = await fetch(`${PORTAL.url}/rest/v1/log_entries${query}`, {
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

/* -------------------------------------------------------------- preview mode */
const readLocal = (): Entry[] => {
  try { return JSON.parse(localStorage.getItem(LKEY) || "[]") as Entry[]; } catch { return []; }
};
const writeLocal = (rows: Entry[]) => { try { localStorage.setItem(LKEY, JSON.stringify(rows)); } catch { /* private mode */ } };

/* ------------------------------------------------------------------- entries */
export const hasSession = () => !isLive() || !!readSession();

export async function listEntries(): Promise<Entry[]> {
  if (!isLive()) return readLocal().sort((a, b) => b.created_at.localeCompare(a.created_at));
  return (await rest("GET", "?select=*&order=created_at.desc")) as Entry[];
}

export async function saveEntry(e: EntryInput): Promise<Entry> {
  const clean = { ...e, follow_up_date: e.follow_up && e.follow_up_date ? e.follow_up_date : null };
  if (!isLive()) {
    const rows = readLocal();
    const now = new Date().toISOString();
    if (e.id) {
      const i = rows.findIndex((r) => r.id === e.id);
      const next = { ...rows[i], ...clean, id: e.id, updated_at: now } as Entry;
      rows[i] = next; writeLocal(rows); return next;
    }
    const row: Entry = { ...(clean as Omit<Entry, "id" | "created_at" | "updated_at">), id: crypto.randomUUID(), created_at: now, updated_at: now };
    writeLocal([row, ...rows]); return row;
  }
  if (e.id) {
    const { id, ...patch } = clean;
    return ((await rest("PATCH", `?id=eq.${id}`, patch)) as Entry[])[0];
  }
  const { id: _id, ...ins } = clean;
  return ((await rest("POST", "", ins)) as Entry[])[0];
}

export async function deleteEntry(id: string) {
  if (!isLive()) { writeLocal(readLocal().filter((r) => r.id !== id)); return; }
  await rest("DELETE", `?id=eq.${id}`);
}

/* -------------------------------------------------------------------- export */
export function toCsv(rows: Entry[]): string {
  const cols: [string, (r: Entry) => string][] = [
    ["Date logged", (r) => r.created_at.slice(0, 10)],
    ["Name", (r) => r.name],
    ["Contact", (r) => r.contact],
    ["Source", (r) => r.source],
    ["Events", (r) => r.events.join("; ")],
    ["Other interest", (r) => r.other_interest],
    ["Guests", (r) => (r.guests ?? "").toString()],
    ["Trip dates", (r) => r.trip_dates],
    ["Needs", (r) => r.services.join("; ")],
    ["Notes", (r) => r.notes],
    ["What I did", (r) => r.actions_taken],
    ["Status", (r) => STATUSES.find((s) => s.v === r.status)?.label || r.status],
    ["Follow up", (r) => (r.follow_up ? "Yes" : "No")],
    ["Follow up date", (r) => r.follow_up_date || ""],
    ["Follow up note", (r) => r.follow_up_note],
  ];
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return "﻿" + [cols.map((c) => esc(c[0])).join(","), ...rows.map((r) => cols.map((c) => esc(c[1](r))).join(","))].join("\r\n");
}
