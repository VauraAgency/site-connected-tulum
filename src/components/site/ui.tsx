import { u } from "../../lib/url";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  site, waLink, waTemplate, footerPlan, footerExplore, type IconName,
} from "../../content/site";

/* ---------------------------------------------------------------- icons */
const paths: Record<IconName, ReactNode> = {
  glass: <><path d="M8 3h8l-1 7a3 3 0 0 1-6 0z" /><path d="M12 13v7M8 21h8" /></>,
  crown: <><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" /></>,
  boat: <><path d="M3 17l2 3h14l2-3z" /><path d="M12 3v12M12 4l6 10H12" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  car: <><path d="M4 16V11l2-5h12l2 5v5z" /><circle cx="8" cy="16" r="1.6" /><circle cx="16" cy="16" r="1.6" /></>,
  chef: <><path d="M7 4v7M10 4v7M7 11h3M8.5 11v9" /><path d="M16 4c-2 2-2 7 0 8v8" /></>,
  leaf: <><path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z" /><path d="M5 19l8-8" /></>,
  disc: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" /></>,
  spark: <><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></>,
  camera: <><path d="M4 8h3l2-2h6l2 2h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  home: <><path d="M4 11l8-6 8 6v9H4z" /><path d="M10 20v-5h4v5" /></>,
  ticket: <><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" /><path d="M14 7v10" strokeDasharray="2 2" /></>,
  moon: <><path d="M19 14A8 8 0 0 1 10 5a7 7 0 1 0 9 9z" /></>,
  phone: <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></>,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const Arrow = () => <span className="arr" aria-hidden="true">→</span>;
export { Arrow };

/* ---------------------------------------------------------------- brand */
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className={`brand ${dark ? "brand--dark" : ""}`} aria-label="Connected Tulum home">
      <img src={u("/assets/logo-mark.svg")} alt="" width={40} height={40} className="brand__mark" />
      <span className="brand__text">
        <span className="brand__word">connected</span>
        <span className="brand__sub">TULUM · CONCIERGE</span>
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- header */
const nav = [
  { label: "Villas", to: "/villas" },
  { label: "Services", to: "/#services" },
  { label: "Events", to: "/tulum-festival-season" },
  { label: "Yachts", to: "/boats" },
  { label: "Beach Clubs", to: "/tulum-group-beach-clubs" },
  { label: "Contact", to: "/contact" },
];

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const dark = overlay && !scrolled && !open;
  return (
    <header className={`hdr ${dark ? "hdr--overlay" : ""} ${scrolled ? "hdr--solid" : ""}`}>
      <a href="#main" className="skip">Skip to content</a>
      <div className="hdr__in">
        <Brand dark={dark} />
        <nav className="hdr__nav" aria-label="Main">
          {nav.map((n) => (
            <a key={n.label} href={u(n.to)}>{n.label}</a>
          ))}
        </nav>
        <a className="cta-call" href={u("/contact")}>
          Schedule your call <Arrow />
        </a>
        <button className="hdr__burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
      {open && (
        <div className="mnav" role="dialog" aria-label="Menu">
          {nav.map((n, i) => (
            <a key={n.label} href={u(n.to)} onClick={() => setOpen(false)}>
              <span className="mono">0{i + 1}</span> {n.label}
            </a>
          ))}
          <a className="mnav__wa" href={waLink(waTemplate("Planning a Tulum trip"))} target="_blank" rel="noopener">
            WhatsApp the concierge <Arrow />
          </a>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------- section head */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span className="eyebrow__rule" />{children}</p>;
}

export function H2({ a, b, tail = "." }: { a: string; b: string; tail?: string }) {
  return (
    <h2 className="h2">
      {a} <em className="accent">{b}</em>{tail}
    </h2>
  );
}

/* ---------------------------------------------------------------- closing CTA */
export function ClosingCTA({ a = "Tell us who's coming,", b = "and it's handled", topic = "Planning a Tulum trip", label = "Message on WhatsApp" }: { a?: string; b?: string; topic?: string; label?: string }) {
  return (
    <section className="closing" aria-labelledby="closing-h">
      <div className="closing__glow" aria-hidden="true" />
      <div className="wrap closing__in">
        <p className="mono closing__k">Start with two details · dates & group size</p>
        <h2 id="closing-h" className="h2 h2--light">{a} <em className="accent">{b}</em>.</h2>
        <div className="closing__ctas">
          <a className="cta-wa" href={waLink(waTemplate(topic))} target="_blank" rel="noopener">
            <WaGlyph /> {label}
          </a>
          <a className="cta-ghost" href={u("/contact")}>Book a call <Arrow /></a>
        </div>
        <a className="closing__mail" href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </section>
  );
}

export function WaGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- floating contact */
export function FloatDock() {
  return (
    <div className="dock" aria-label="Quick contact">
      <a className="dock__b dock__wa" href={waLink(waTemplate("Planning a Tulum trip"))} target="_blank" rel="noopener" aria-label="WhatsApp"><WaGlyph /></a>
      <a className="dock__b dock__cal" href={u("/contact")} aria-label="Book a call"><Icon name="calendar" size={18} /></a>
      <a className="dock__b dock__mail" href={`mailto:${site.email}`} aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></a>
      <a className="dock__b dock__ig" href={site.socials.instagram} target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a>
    </div>
  );
}

/* ---------------------------------------------------------------- notify modal (festival updates) */
export function NotifyModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("ct_notify") === "1"; } catch { /* ignore */ }
    if (seen) return;
    const t = window.setTimeout(() => setOpen(true), 25000);
    return () => window.clearTimeout(t);
  }, []);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem("ct_notify", "1"); } catch { /* ignore */ }
  };
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="nm-h" onClick={close}>
      <form
        className="modal__card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Notify me: Tulum High Season 2027")}&body=${encodeURIComponent(`Please add ${email} to the High Season 2027 list.`)}`;
          close();
        }}
      >
        <button type="button" className="modal__x" onClick={close} aria-label="Close">×</button>
        <img src={u("/assets/logo-mark.svg")} alt="" width={48} height={48} />
        <p className="mono">Tulum High Season 2027</p>
        <h3 id="nm-h">Be first to know what drops next.</h3>
        <label className="sr" htmlFor="nm-email">Email</label>
        <input id="nm-email" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="cta-notify" type="submit">Notify me</button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- footer */
export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div className="ftr__brand">
          <Brand dark />
          <p>Tulum, connected. Villas, tables, festivals and the people who make them happen.</p>
          <div className="ftr__soc">
            <a href={site.socials.instagram} target="_blank" rel="noopener">Instagram</a>
            <a href={site.socials.tiktok} target="_blank" rel="noopener">TikTok</a>
            <a href={site.socials.facebook} target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
        <div>
          <h4>Plan your trip</h4>
          <ul>{footerPlan.map((l) => <li key={l.to}><a href={u(l.to)}>{l.label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>{footerExplore.map((l) => <li key={l.to}><a href={u(l.to)}>{l.label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Concierge</h4>
          <ul>
            <li><a href={waLink(waTemplate("Planning a Tulum trip"))} target="_blank" rel="noopener">WhatsApp {site.whatsappDisplay}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={u("/contact")}>Book a call</a></li>
          </ul>
          <p className="ftr__hours">{site.callHours}</p>
        </div>
      </div>
      <div className="wrap ftr__base">
        <span>© {new Date().getFullYear()} Connected Tulum · Tulum, Quintana Roo, México</span>
        <a href="https://vauraagency.com" target="_blank" rel="noopener" className="ftr__vaura">Site by VAURA</a>
      </div>
    </footer>
  );
}

export function Shell({ children, overlay = false }: { children: ReactNode; overlay?: boolean }) {
  return (
    <>
      <Header overlay={overlay} />
      <main id="main">{children}</main>
      <Footer />
      <FloatDock />
      <NotifyModal />
    </>
  );
}

/* ---------------------------------------------------------------- faq */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} className="faq__i" open={i === 0}>
          <summary><span className="mono">0{i + 1}</span>{f.q}<span className="faq__plus" aria-hidden="true" /></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = document.querySelectorAll<HTMLElement>("[data-rise]");
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => { el.classList.add("rise"); io.observe(el); });
    return () => io.disconnect();
  }, []);
}

/* ---------------------------------------------------------------- animated logo (SVG redraw of the Connected mark) */
export function LogoAnim({ loop = false, className = "" }: { loop?: boolean; className?: string }) {
  if (site.logoVideo) {
    return (
      <video className={className} src={site.logoVideo} autoPlay muted playsInline loop={loop} preload="auto" />
    );
  }
  return (
    <svg className={`lgo ${loop ? "lgo--loop" : ""} ${className}`} viewBox="0 0 512 512" role="img" aria-label="Connected logo">
      <defs>
        <linearGradient id="lgo-g" x1="0.85" y1="0.05" x2="0.2" y2="0.95">
          <stop offset="0" stopColor="#7DFF00" /><stop offset=".5" stopColor="#00F02E" /><stop offset="1" stopColor="#00DCA0" />
        </linearGradient>
        <filter id="lgo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="miter" strokeWidth={25} filter="url(#lgo-glow)">
        <circle className="lgo__ring" cx="256" cy="258" r="158" stroke="#fff" strokeWidth={23} pathLength={1} />
        <path className="lgo__a" stroke="url(#lgo-g)" d="M127 428 A210 210 0 0 1 340 66 V298 A56 56 0 0 1 228 298 V236" pathLength={1} />
        <path className="lgo__b" stroke="url(#lgo-g)" d="M386 82 A210 210 0 0 1 173 451 V230 A58 58 0 0 1 289 230 V280" pathLength={1} />
      </g>
    </svg>
  );
}
