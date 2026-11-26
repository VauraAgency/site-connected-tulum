import { useEffect, useState } from "react";
import { bpLink, bpSearchUrl, trackBP, type Stay } from "../../lib/beachplease";
import { Arrow } from "./ui";

const KEY = "ct_stay";
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (s: string, n: number) => { const d = new Date(`${s}T12:00:00`); d.setDate(d.getDate() + n); return iso(d); };

export function readStay(): Stay {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

/**
 * Dates + guests, right on our site. Submitting opens the booking engine on the results page
 * (every villa free for those dates, with totals), or straight on one villa when `villa` is set.
 * No separate "pick dates" step on their side.
 */
export function VillaSearch({ villa, placement = "search", className = "" }: { villa?: { slug: string; name: string; gid?: string; bpPage?: string }; placement?: string; className?: string }) {
  const [inn, setIn] = useState("");
  const [out, setOut] = useState("");
  const [g, setG] = useState(2);
  const [min, setMin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setMin(iso(new Date()));
    const s = readStay();
    if (s.checkIn) setIn(s.checkIn);
    if (s.checkOut) setOut(s.checkOut);
    if (s.guests) setG(s.guests);
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inn || !out) return setErr("Pick your check-in and check-out dates.");
    if (out <= inn) return setErr("Check-out has to be after check-in.");
    setErr("");
    const stay: Stay = { checkIn: inn, checkOut: out, guests: g };
    try { sessionStorage.setItem(KEY, JSON.stringify(stay)); } catch { /* optional */ }
    const url = villa ? bpLink(villa, `${placement}-dates`, stay) : bpSearchUrl(stay, placement);
    if (!url) return;
    trackBP(villa?.slug ?? "all", villa?.name ?? "All villas", `${placement}-dates`);
    window.open(url, "_blank", "noopener");
  };

  return (
    <form className={`vsearch ${className}`} onSubmit={go} aria-label={villa ? `Check dates for ${villa.name}` : "Search villas by date"}>
      <label className="vsearch__f">
        <span className="mono">Check-in</span>
        <input type="date" value={inn} min={min || undefined} onChange={(e) => { setIn(e.target.value); if (!out || out <= e.target.value) setOut(addDays(e.target.value, 4)); }} required />
      </label>
      <label className="vsearch__f">
        <span className="mono">Check-out</span>
        <input type="date" value={out} min={inn ? addDays(inn, 1) : min || undefined} onChange={(e) => setOut(e.target.value)} required />
      </label>
      <label className="vsearch__f vsearch__f--g">
        <span className="mono">Guests</span>
        <select value={g} onChange={(e) => setG(Number(e.target.value))}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <button className="cta-hero vsearch__go" type="submit">{villa ? "Check availability" : "See available villas"} <Arrow /></button>
      {err && <p className="vsearch__err" role="alert">{err}</p>}
    </form>
  );
}
