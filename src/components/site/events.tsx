import { useEffect, useMemo, useRef, useState } from "react";
import { events, img, ticketHref, fmtDate, waLink, waTemplate, type TEvent } from "../../content/site";
import { Arrow } from "./ui";

/* ------------------------------------------------------------------ helpers */
const pad = (n: number) => String(n).padStart(2, "0");
export const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dotDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const evName = (e: TEvent) => e.title;

/** Today's date, set after mount so prerendered HTML never mismatches. */
export function useToday() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => { setT(new Date()); }, []);
  return t;
}

export function daysUntil(iso: string, from: Date) {
  const a = new Date(iso + "T00:00:00");
  const b = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

/* ------------------------------------------------------------------ buttons */
export function TicketBtn({ e, className = "cta-ticket" }: { e: TEvent; className?: string }) {
  const href = ticketHref(e);
  const d = fmtDate(e.date);
  if (href) {
    return <a className={className} href={href} target="_blank" rel="noopener sponsored">Get tickets <Arrow /></a>;
  }
  return (
    <a className={className} href={waLink(waTemplate(`Tickets: ${evName(e)} @ ${e.venue} (${d.long})`))} target="_blank" rel="noopener">
      Get tickets <Arrow />
    </a>
  );
}

export function TableBtn({ e, className = "cta-table" }: { e: TEvent; className?: string }) {
  const d = fmtDate(e.date);
  return (
    <a className={className} href={waLink(waTemplate(`VIP table: ${evName(e)} @ ${e.venue} (${d.long})`))} target="_blank" rel="noopener">
      Inquire about a table
    </a>
  );
}

/* ------------------------------------------------------------------ flyer card */
export function NightCard({ e }: { e: TEvent }) {
  const d = fmtDate(e.date);
  const name = evName(e);
  const bg = e.bg || (e.festival === "tehmplo" ? img.cenote : e.festival === "day-zero" ? img.cenote : e.festival ? img.festival : img.beachClub);
  return (
    <article className="ev" data-rise>
      <div className="ev__flyer">
        {e.flyer ? (
          <img src={e.flyer} alt={`${name} flyer`} loading="lazy" width={800} height={1000} />
        ) : (
          <div className="ev__ph">
            <img src={bg} alt="" loading="lazy" width={800} height={1000} />
            <div className="ev__ph-in">
              <span className="ev__ph-d">{dotDate(e.date)}</span>
              <span className="ev__ph-t">{e.tbd ? "Lineup TBA" : name}</span>
              <span className="ev__ph-v mono">{e.venue}</span>
            </div>
          </div>
        )}
        {e.flyer && <span className="ev__date"><b>{d.day}</b><span>{d.mon}</span></span>}
      </div>
      <div className="ev__b">
        <p className="mono">{d.wk} · {e.venue}{e.time ? ` · ${e.time}` : ""}</p>
        <h3>{name}</h3>
        {e.lineup && <p className="ev__lu">{e.lineup}</p>}
        <div className="ev__ctas">
          <TicketBtn e={e} />
          <TableBtn e={e} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ season scroller (big date + rail) */
export function SeasonScroller() {
  const list = useMemo(() => events.filter((e) => e.key), []);
  const n = list.length;
  const box = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = box.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        setI(Math.min(n - 1, Math.floor(p * n)));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [n]);

  const jump = (k: number) => {
    const el = box.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((k + 0.5) / n) * total, behavior: "smooth" });
  };

  const cur = list[i];
  return (
    <section id="season" className="season" ref={box} style={{ height: `${n * 80 + 20}vh` }} aria-label="The season, night by night">
      <div className="season__stick">
        {list.map((e, k) => (
          <img key={k} className={`season__bg ${k === i ? "on" : ""}`} src={e.bg || img.festival} alt="" width={1600} height={900} loading={k === 0 ? "eager" : "lazy"} />
        ))}
        <div className="season__shade" aria-hidden="true" />
        <p className="season__k mono">The season · High Season 2027</p>
        <div className="season__txt" key={i}>
          <p className="season__date" aria-hidden="true">{dotDate(cur.date)}</p>
          <h3 className="season__t">{cur.title}</h3>
          <p className="season__l">{cur.venue}{cur.lineup ? `. ${cur.lineup}` : ""}</p>
          <div className="season__ctas">
            <TicketBtn e={cur} className="cta-hero" />
            <TableBtn e={cur} className="cta-table" />
          </div>
        </div>
        <ol className="season__rail" aria-label="Jump to a night">
          {list.map((e, k) => (
            <li key={k}>
              <button type="button" className={k <= i ? "on" : ""} aria-current={k === i} onClick={() => jump(k)}>{dotDate(e.date)}</button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ calendar (today highlighted) */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SEASON_START = { y: 2026, m: 11 }; // Dec 2026
const SEASON_END = { y: 2027, m: 0 }; // Jan 2027
const key = (y: number, m: number) => `${y}-${pad(m + 1)}`;

export function Calendar() {
  const today = useToday();
  const [active, setActive] = useState(key(SEASON_START.y, SEASON_START.m));
  const [sel, setSel] = useState<string>("2026-12-31");

  // Tabs run from today's month (if before the season) through the season end.
  const tabs = useMemo(() => {
    const out: { y: number; m: number }[] = [];
    let y = SEASON_START.y, m = SEASON_START.m;
    if (today && (today.getFullYear() < y || (today.getFullYear() === y && today.getMonth() < m))) {
      y = today.getFullYear(); m = today.getMonth();
    }
    while (y < SEASON_END.y || (y === SEASON_END.y && m <= SEASON_END.m)) {
      out.push({ y, m });
      m++; if (m > 11) { m = 0; y++; }
    }
    return out;
  }, [today]);

  // Once we know today, preselect the next night on/after today.
  useEffect(() => {
    if (!today) return;
    const t = isoOf(today);
    const next = events.map((e) => e.date).sort().find((d) => d >= t);
    if (next) setSel(next);
  }, [today]);

  const [ay, am] = active.split("-").map(Number);
  const first = new Date(ay, am - 1, 1);
  const dim = new Date(ay, am, 0).getDate();
  const lead = first.getDay();
  const todayIso = today ? isoOf(today) : "";
  const byDate = useMemo(() => {
    const m: Record<string, TEvent[]> = {};
    events.forEach((e) => { (m[e.date] ||= []).push(e); });
    return m;
  }, []);
  const selEvents = byDate[sel] || [];
  const days = today ? daysUntil("2026-12-31", today) : null;

  return (
    <div className="cal">
      <div className="cal__today" aria-live="polite">
        {today ? (
          <>
            <span className="cal__pill"><i /> Today</span>
            <b>{today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</b>
            {days !== null && days > 0 && <span className="cal__count">{days} days to NYE</span>}
            {days !== null && days <= 0 && todayIso <= "2027-01-10" && <span className="cal__count">High season is on</span>}
            <button type="button" className="cal__jump" onClick={() => { setActive(key(today.getFullYear(), today.getMonth())); }} hidden={!tabs.some((t) => t.y === today.getFullYear() && t.m === today.getMonth())}>
              Go to today
            </button>
          </>
        ) : (
          <span className="cal__count">High Season 2027 · 31.12 to 10.01</span>
        )}
      </div>

      <div className="cal__tabs" role="tablist" aria-label="Month">
        {tabs.map((t) => {
          const k = key(t.y, t.m);
          return (
            <button key={k} type="button" role="tab" aria-selected={active === k} className={active === k ? "on" : ""} onClick={() => setActive(k)}>
              {MONTHS[t.m].slice(0, 3)} <span>{t.y}</span>
            </button>
          );
        })}
      </div>

      <div className="cal__grid" role="grid" aria-label={`${MONTHS[am - 1]} ${ay}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => <span key={i} className="cal__w mono" aria-hidden="true">{w}</span>)}
        {Array.from({ length: lead }).map((_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: dim }).map((_, i) => {
          const day = i + 1;
          const iso = `${ay}-${pad(am)}-${pad(day)}`;
          const evs = byDate[iso] || [];
          const cls = ["cal__d", evs.length ? "has" : "", iso === todayIso ? "today" : "", iso === sel ? "sel" : ""].filter(Boolean).join(" ");
          return (
            <button key={iso} type="button" className={cls} onClick={() => setSel(iso)} aria-label={`${MONTHS[am - 1]} ${day}${evs.length ? `, ${evs.length} event${evs.length > 1 ? "s" : ""}` : ""}${iso === todayIso ? ", today" : ""}`} aria-pressed={iso === sel}>
              <b>{day}</b>
              {evs.length > 0 && <em>{evs.length}</em>}
            </button>
          );
        })}
      </div>

      <div className="cal__list">
        <p className="mono cal__sel">{fmtDate(sel).long}</p>
        {selEvents.length === 0 && <p className="cal__none">Nothing announced for this date yet. Pick a highlighted day.</p>}
        {selEvents.map((e, k) => (
          <div key={k} className="cal__ev">
            <div>
              <b>{evName(e)}</b>
              <span>{e.venue}{e.lineup ? ` · ${e.lineup}` : ""}</span>
            </div>
            <div className="cal__btns">
              <TicketBtn e={e} className="cta-ticket cta-ticket--sm" />
              <TableBtn e={e} className="cta-table cta-table--sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
