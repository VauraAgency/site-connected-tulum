import { useMemo, useState } from "react";
import {
  ACTION_TYPES, PRIORITIES, TEAM, deleteAction, saveAction,
  type Action, type ActionInput, type ActionType, type Entry, type Priority, type Reservation,
} from "../../lib/portal-api";
import { Sheet, fmtDate, fmtDay, todayIso } from "./shared";

const typeLabel = (t: ActionType) => ACTION_TYPES.find((x) => x.v === t)?.label || t;
const RANK: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

/** One row in the register: either a task from the actions table or a client follow-up from the log. */
type Item = {
  key: string;
  kind: "entry" | "action";
  title: string;
  who: string;
  due: string | null;
  priority: Priority;
  owner: string;
  type: ActionType;
  details: string;
  entry?: Entry;
  action?: Action;
};

export function ActionsView({ entries, res, acts, onOpenEntry, onOpenAction, onDoneEntry, onDoneAction, onReopen }: {
  entries: Entry[];
  res: Reservation[];
  acts: Action[];
  onOpenEntry: (e: Entry) => void;
  onOpenAction: (a: Action) => void;
  onDoneEntry: (e: Entry) => void;
  onDoneAction: (a: Action) => void;
  onReopen: (a: Action) => void;
}) {
  const [showDone, setShowDone] = useState(false);
  const [owner, setOwner] = useState("");
  const [q, setQ] = useState("");
  const today = todayIso();

  const nameFor = (a: Action) =>
    res.find((r) => r.id === a.reservation_id)?.customer_name || entries.find((e) => e.id === a.entry_id)?.name || "";

  const open = useMemo<Item[]>(() => {
    const fromEntries: Item[] = entries
      .filter((e) => e.follow_up && e.status !== "done" && e.status !== "lost")
      .map((e) => ({ key: `e-${e.id}`, kind: "entry", title: e.follow_up_note || "Follow up", who: e.name, due: e.follow_up_date, priority: "normal", owner: "", type: "follow_up", details: "", entry: e }));
    const fromActions: Item[] = acts
      .filter((a) => a.status === "open")
      .map((a) => ({ key: `a-${a.id}`, kind: "action", title: a.title, who: nameFor(a), due: a.due_date, priority: a.priority, owner: a.owner, type: a.type, details: a.details, action: a }));
    return [...fromEntries, ...fromActions];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, acts, res]);

  const match = (i: Item) => {
    if (owner === "_none" ? i.owner !== "" : owner && i.owner !== owner) return false;
    const s = q.trim().toLowerCase();
    return !s || [i.title, i.who, i.details, i.owner].join(" ").toLowerCase().includes(s);
  };

  const groups = useMemo(() => {
    const sorted = open.filter(match).sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999") || RANK[a.priority] - RANK[b.priority]);
    return [
      { key: "over", label: "Overdue", items: sorted.filter((i) => i.due && i.due < today) },
      { key: "today", label: "Today", items: sorted.filter((i) => i.due === today) },
      { key: "next", label: "Coming up", items: sorted.filter((i) => i.due && i.due > today) },
      { key: "none", label: "No date set", items: sorted.filter((i) => !i.due) },
    ].filter((g) => g.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, owner, q, today]);

  const done = useMemo(() => {
    const s = q.trim().toLowerCase();
    return acts
      .filter((a) => a.status === "done")
      .filter((a) => (owner === "_none" ? a.owner === "" : !owner || a.owner === owner))
      .filter((a) => !s || [a.title, nameFor(a), a.details, a.owner].join(" ").toLowerCase().includes(s))
      .sort((a, b) => (b.completed_at || "").localeCompare(a.completed_at || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acts, owner, q, res, entries]);

  const doneCount = acts.filter((a) => a.status === "done").length;

  return (
    <>
      <div className="pt__filters pt__filters--3">
        <input type="search" placeholder="Search tasks, clients…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search actions" />
        <select value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Filter by owner">
          <option value="">Everyone</option>
          {TEAM.map((t) => <option key={t} value={t}>{t}</option>)}
          <option value="_none">Unassigned</option>
        </select>
        <button className={`pt__btn ${showDone ? "pt__btn--on" : ""}`} aria-pressed={showDone} onClick={() => setShowDone((v) => !v)}>
          {showDone ? "Showing completed" : `Completed (${doneCount})`}
        </button>
      </div>

      {!showDone && (groups.length === 0 ? (
        <div className="pt__empty">
          <p>Nothing waiting.</p>
          <p className="pt__sub">Client follow-ups from the log and tasks you add show up here, soonest first. Commission collection tasks appear when you complete a reservation.</p>
        </div>
      ) : groups.map((g) => (
        <section key={g.key} className="pt__grp">
          <h2 className={`pt__gh pt__gh--${g.key}`}>{g.label} <i>{g.items.length}</i></h2>
          <ul className="pt__list">
            {g.items.map((i) => (
              <li key={i.key} className="pt__card pt__row">
                <button className="pt__rowmain" onClick={() => (i.entry ? onOpenEntry(i.entry) : onOpenAction(i.action!))}>
                  <span className="pt__line">
                    <b>{i.title}</b>
                    {i.priority === "high" && <span className="pt__pill pt__pill--high">High</span>}
                    <span className="pt__chip">{i.kind === "entry" ? "Client follow-up" : typeLabel(i.type)}</span>
                  </span>
                  <span className="pt__mut">{[i.who, i.due ? fmtDay(i.due) : "No date", i.owner].filter(Boolean).join(" · ")}</span>
                  {i.details && <span className="pt__note">{i.details}</span>}
                </button>
                <button className="pt__btn pt__btn--ok" onClick={() => (i.entry ? onDoneEntry(i.entry) : onDoneAction(i.action!))}>Mark done</button>
              </li>
            ))}
          </ul>
        </section>
      )))}

      {showDone && (done.length === 0 ? (
        <div className="pt__empty"><p>No completed tasks yet.</p></div>
      ) : (
        <ul className="pt__list">
          {done.map((a) => (
            <li key={a.id} className="pt__card pt__row">
              <button className="pt__rowmain" onClick={() => onOpenAction(a)}>
                <span className="pt__line"><b>{a.title}</b><span className="pt__chip">{typeLabel(a.type)}</span></span>
                <span className="pt__mut">{[nameFor(a), a.completed_at ? `Done ${fmtDate(a.completed_at.slice(0, 10))}` : "Done", a.owner].filter(Boolean).join(" · ")}</span>
              </button>
              <button className="pt__btn" onClick={() => onReopen(a)}>Reopen</button>
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------- form */
export function ActionForm({ start, entries, res, onClose, onSaved }: {
  start: ActionInput;
  entries: Entry[];
  res: Reservation[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<ActionInput>(start);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof ActionInput>(k: K, v: ActionInput[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!f.title.trim()) { setErr("Add what needs to be done."); return; }
    setBusy(true); setErr("");
    try { await saveAction({ ...f, title: f.title.trim() }); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const remove = async () => {
    if (!f.id || !confirm("Delete this task? This can't be undone.")) return;
    setBusy(true);
    try { await deleteAction(f.id); onSaved(); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };

  return (
    <Sheet title={f.id ? "Edit task" : "New task"} onClose={onClose} onSubmit={submit}>
      <label className="pt__f pt__full">What needs to be done
        <input value={f.title} onChange={(e) => set("title", e.target.value)} autoFocus={!f.id} required placeholder="Send the villa options, chase the Bagatelle commission…" />
      </label>
      <div className="pt__grid">
        <label className="pt__f">Type
          <select value={f.type} onChange={(e) => set("type", e.target.value as ActionType)}>{ACTION_TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}</select>
        </label>
        <label className="pt__f">Due<input type="date" value={f.due_date || ""} onChange={(e) => set("due_date", e.target.value || null)} /></label>
        <label className="pt__f">Priority
          <select value={f.priority} onChange={(e) => set("priority", e.target.value as Priority)}>{PRIORITIES.map((p) => <option key={p.v} value={p.v}>{p.label}</option>)}</select>
        </label>
        <label className="pt__f">Owner
          <select value={f.owner} onChange={(e) => set("owner", e.target.value)}>
            <option value="">Unassigned</option>
            {TEAM.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="pt__f">Client (optional)
          <select value={f.entry_id || ""} onChange={(e) => set("entry_id", e.target.value || null)}>
            <option value="">Not linked</option>
            {entries.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </label>
        <label className="pt__f">Reservation (optional)
          <select value={f.reservation_id || ""} onChange={(e) => set("reservation_id", e.target.value || null)}>
            <option value="">Not linked</option>
            {res.map((r) => <option key={r.id} value={r.id}>{r.customer_name} · {fmtDate(r.reservation_date)}</option>)}
          </select>
        </label>
        <label className="pt__f">Status
          <select value={f.status} onChange={(e) => set("status", e.target.value as "open" | "done")}>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
      <label className="pt__f pt__full">Details<textarea rows={3} value={f.details} onChange={(e) => set("details", e.target.value)} /></label>

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
