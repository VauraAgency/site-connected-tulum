import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { site, waLink } from "../../content/site";
import { Arrow, WaGlyph } from "./ui";

/*
 * One inquiry pop up for every "Inquire about a table / Get tickets / reservation" button.
 * The guest picks a date RANGE on a calendar, how many people, adds name + email, and the WhatsApp
 * message is drafted in full: they only have to hit send. Email gets the same text.
 * The send button is a real wa.me link, so agent referral tags (src/lib/ref.ts) still get added.
 */
export type InquiryCtx = {
  kind: "table" | "tickets" | "reservation" | "general";
  /** event name, e.g. "Joezi at Ikal Arena" */
  title?: string;
  venue?: string;
  /** event date as YYYY-MM-DD */
  date?: string;
};

const EVT = "ct-inquire";
export function openInquiry(ctx: InquiryCtx) {
  window.dispatchEvent(new CustomEvent<InquiryCtx>(EVT, { detail: ctx }));
}

/* ---------------------------------------------------------------- date helpers (local, string based) */
const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parse = (s: string) => new Date(`${s}T12:00:00`);
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const short = (s: string) => { const d = parse(s); return `${MON[d.getMonth()]} ${d.getDate()}`; };
const longDay = (s: string) => parse(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const nights = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000);

type Range = { start: string; end: string };
const rangeLabel = (r: Range | null) => {
  if (!r) return "";
  if (r.start === r.end) return short(r.start);
  const n = nights(r.start, r.end);
  return `${short(r.start)} to ${short(r.end)} (${n} night${n === 1 ? "" : "s"})`;
};

/* ---------------------------------------------------------------- range calendar */
function RangeCalendar({ value, onChange, eventDate, today, startView }: { value: Range | null; onChange: (r: Range | null) => void; eventDate?: string; today: string; startView: string }) {
  const [view, setView] = useState(() => { const d = parse(startView); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [pending, setPending] = useState<string | null>(null); // first click, waiting for the second
  const [hover, setHover] = useState<string | null>(null);

  const click = (iso: string) => {
    if (!pending) { setPending(iso); setHover(null); onChange({ start: iso, end: iso }); return; }
    const [a, b] = iso < pending ? [iso, pending] : [pending, iso];
    setPending(null); setHover(null);
    onChange({ start: a, end: b });
  };

  const shown = pending && hover ? (hover < pending ? { start: hover, end: pending } : { start: pending, end: hover }) : value;
  const prevOk = view.y > parse(today).getFullYear() || view.m > parse(today).getMonth();
  const step = (n: number) => setView((v) => { const d = new Date(v.y, v.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  const month = (off: number) => {
    const first = new Date(view.y, view.m + off, 1);
    const y = first.getFullYear(), m = first.getMonth();
    const lead = first.getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: dim }, (_, i) => toIso(y, m, i + 1))];
    return (
      <div className={`rcal__m${off ? " rcal__m--2" : ""}`} key={off}>
        <p className="rcal__t">{MONTH[m]} {y}</p>
        <div className="rcal__g" role="grid" aria-label={`${MONTH[m]} ${y}`}>
          {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => <span key={i} className="rcal__w" aria-hidden="true">{w}</span>)}
          {cells.map((iso, i) => {
            if (!iso) return <span key={`b${i}`} />;
            const past = iso < today;
            const inR = shown && iso >= shown.start && iso <= shown.end;
            const edge = shown && (iso === shown.start || iso === shown.end);
            return (
              <button
                key={iso} type="button" disabled={past}
                className={`rcal__d${inR ? " in" : ""}${edge ? " edge" : ""}${shown && iso === shown.start ? " s" : ""}${shown && iso === shown.end ? " e" : ""}${eventDate === iso ? " ev" : ""}`}
                aria-pressed={!!edge} aria-label={longDay(iso)}
                onClick={() => click(iso)} onMouseEnter={() => pending && setHover(iso)}
              >{Number(iso.slice(8))}</button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="rcal">
      <div className="rcal__nav">
        <button type="button" className="rcal__b" onClick={() => step(-1)} disabled={!prevOk} aria-label="Previous month">‹</button>
        <button type="button" className="rcal__b" onClick={() => step(1)} aria-label="Next month">›</button>
      </div>
      <div className="rcal__ms">{month(0)}{month(1)}</div>
      <p className="rcal__hint mono">
        {pending ? "Now tap your last day (or tap the same day for a single day)." : "Tap your first day, then your last day."}
        {eventDate && <> <span className="rcal__evdot" aria-hidden="true" /> = the event night</>}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- the pop up */
const VERB: Record<InquiryCtx["kind"], string> = {
  table: "inquire about a VIP table",
  tickets: "get tickets",
  reservation: "request a reservation",
  general: "plan a Tulum trip",
};
const HEAD: Record<InquiryCtx["kind"], string> = {
  table: "Inquire about a table",
  tickets: "Get tickets",
  reservation: "Request a reservation",
  general: "Plan your trip",
};

export function InquiryHost() {
  const [ctx, setCtx] = useState<InquiryCtx | null>(null);
  const [range, setRange] = useState<Range | null>(null);
  const [people, setPeople] = useState(4);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [today, setToday] = useState("2026-01-01");
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const on = (e: Event) => {
      const d = new Date();
      setToday(toIso(d.getFullYear(), d.getMonth(), d.getDate()));
      setCtx((e as CustomEvent<InquiryCtx>).detail);
      setRange(null);
      try {
        const s = JSON.parse(localStorage.getItem("ct_inq") || "{}");
        if (s.name) setName(s.name);
        if (s.email) setEmail(s.email);
        if (s.people) setPeople(s.people);
      } catch { /* optional */ }
    };
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    const k = (ev: KeyboardEvent) => { if (ev.key === "Escape") setCtx(null); };
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [ctx]);

  const message = useMemo(() => {
    if (!ctx) return "";
    const ev = ctx.title ? `${ctx.title}${ctx.venue && !ctx.title.toLowerCase().includes(ctx.venue.toLowerCase()) ? ` at ${ctx.venue}` : ""}${ctx.date ? ` (${longDay(ctx.date)})` : ""}` : "";
    const lines = [
      ev && `Event: ${ev}`,
      range && `Trip dates: ${rangeLabel(range)}`,
      `Group size: ${people} ${people === 1 ? "person" : "people"}`,
      name.trim() && `Name: ${name.trim()}`,
      email.trim() && `Email: ${email.trim()}`,
      notes.trim() && `Notes: ${notes.trim()}`,
    ].filter(Boolean);
    return `Hi Connected Tulum! I'd like to ${VERB[ctx.kind]}.\n\n${lines.join("\n")}`;
  }, [ctx, range, people, name, email, notes]);

  if (!ctx) return null;
  const ready = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email.trim());
  const close = () => setCtx(null);
  const remember = () => {
    try { localStorage.setItem("ct_inq", JSON.stringify({ name: name.trim(), email: email.trim(), people })); } catch { /* optional */ }
    try {
      const w = window as unknown as { dataLayer?: { push: (o: Record<string, unknown>) => void } };
      w.dataLayer?.push({ event: "inquiry_send", kind: ctx.kind, event_name: ctx.title ?? "", people });
    } catch { /* tracking must never block */ }
    window.setTimeout(close, 400);
  };
  const guard = (e: React.MouseEvent) => { if (!ready) e.preventDefault(); else remember(); };
  const mail = `mailto:${site.email}?subject=${encodeURIComponent(`${HEAD[ctx.kind]}${ctx.title ? `: ${ctx.title}` : ""}`)}&body=${encodeURIComponent(message)}`;
  const view = ctx.date && ctx.date >= today ? ctx.date : today;

  return createPortal(
    <div className="inq" role="dialog" aria-modal="true" aria-labelledby="inq-h" onClick={close}>
      <div className="inq__card" onClick={(e) => e.stopPropagation()}>
        <div className="inq__h">
          <div>
            {ctx.title && <p className="mono inq__k">{ctx.title}{ctx.date ? ` · ${short(ctx.date)}` : ""}</p>}
            <h3 id="inq-h">{HEAD[ctx.kind]}</h3>
          </div>
          <button type="button" className="inq__x" aria-label="Close" onClick={close}>&times;</button>
        </div>
        <div className="inq__body">
          <p className="inq__sub">Pick the days you are in Tulum and how many people. We write the whole message for you. You just hit send on WhatsApp.</p>

          <p className="inq__l">1 · Your dates {range && <b>{rangeLabel(range)}</b>} {range && <button type="button" className="inq__clear" onClick={() => setRange(null)}>Clear</button>}</p>
          <RangeCalendar value={range} onChange={setRange} eventDate={ctx.date} today={today} startView={view} />

          <p className="inq__l">2 · How many people</p>
          <div className="inq__step" role="group" aria-label="Number of people">
            <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people" disabled={people <= 1}>−</button>
            <output aria-live="polite"><b>{people}</b> {people === 1 ? "person" : "people"}</output>
            <button type="button" onClick={() => setPeople(Math.min(60, people + 1))} aria-label="More people">+</button>
          </div>

          <p className="inq__l">3 · Who is this</p>
          <div className="inq__row">
            <label>Name *<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" /></label>
            <label>Email *<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" inputMode="email" /></label>
          </div>
          <label className="inq__full">Anything else? (optional)<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Birthday, budget, bottle service, section you want..." /></label>

          <button type="button" className="inq__peek mono" onClick={() => setShowMsg(!showMsg)} aria-expanded={showMsg}>{showMsg ? "Hide" : "See"} the message we will send</button>
          {showMsg && <pre className="inq__msg">{message}</pre>}
        </div>

        <div className="inq__bar">
          <a className={`cta-wa inq__send${ready ? "" : " is-off"}`} href={waLink(message)} target="_blank" rel="noopener" aria-disabled={!ready} onClick={guard}>
            <WaGlyph /> Open WhatsApp, message ready
          </a>
          <a className={`inq__mail${ready ? "" : " is-off"}`} href={mail} aria-disabled={!ready} onClick={guard}>Send by email <Arrow /></a>
          {!ready && <p className="inq__need mono">Add your name and email to continue.</p>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Drop-in button that opens the inquiry pop up. */
export function InquireBtn({ ctx, className = "cta-table", children }: { ctx: InquiryCtx; className?: string; children: React.ReactNode }) {
  return <button type="button" className={className} onClick={() => openInquiry(ctx)}>{children}</button>;
}
