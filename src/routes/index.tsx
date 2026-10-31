import { u, VARIANT } from "../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  site, img, services, events, marquee, team, reviews, faqs, steps, waLink, waTemplate,
} from "../content/site";
import { Shell, Eyebrow, H2, Icon, Arrow, ClosingCTA, Faq, WaGlyph, LogoAnim, useReveal } from "../components/site/ui";
import { SeasonScroller, Calendar, NightCard, useToday, daysUntil } from "../components/site/events";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connected Tulum | Tulum High Season 2027 Tickets & VIP Tables" },
      { name: "description", content: "Tickets and VIP tables for Tulum High Season 2027: Zamna, Tehmplo, Day Zero and every night. Plus transport, reservations, yachts and villas." },
      { property: "og:url", content: site.domain },
    ],
    links: [
      { rel: "canonical", href: site.domain + "/" },
      { rel: "preload", as: "image", href: img.hero },
    ],
  }),
  component: Home,
});

function Hero() {
  const layer = useRef<HTMLDivElement>(null);
  const today = useToday();
  const left = today ? daysUntil("2026-12-31", today) : null;
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        if (layer.current) layer.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero__bg" ref={layer} aria-hidden="true">
        {site.heroVideo ? (
          <video className="hero__media" src={site.heroVideo} poster={img.hero} autoPlay muted loop playsInline preload="metadata" />
        ) : (
          <img className="hero__media" src={img.hero} alt="" width={1600} height={900} fetchPriority="high" />
        )}
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__logo" aria-hidden="true"><LogoAnim /></div>
      <div className="wrap hero__in">
        <p className="hero__eye mono"><i aria-hidden="true" /> Tickets · VIP tables · High Season 2027</p>
        <h1 id="hero-h" className="hero__h">
          Tulum, <em className="accent">connected</em>.
        </h1>
        <p className="hero__lead">Every night of the season, in one place. Grab tickets, lock a VIP table, and we handle the rest.</p>
        <p className="hero__count mono">
          31.12 to 10.01{left !== null && left > 0 ? ` · ${left} days to go` : ""}
        </p>
        <div className="hero__ctas">
          <a className="cta-hero" href="#season">See every night <Arrow /></a>
          <a className="cta-wa" href={waLink(waTemplate("VIP table, High Season 2027"))} target="_blank" rel="noopener"><WaGlyph /> Inquire about a table</a>
        </div>
        <ul className="hero__trust mono">
          <li>Zamna</li><li>Tehmplo</li><li>Day Zero</li><li>Transport</li><li>24/7</li>
        </ul>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <a className="marq" href={u("/tulum-festival-season")} aria-label="High Season 2027 lineup">
      <div className="marq__track">
        {row.map((m, i) => (
          <span key={i} className="marq__i"><em>{m}</em><span className="marq__dot" aria-hidden="true">✦</span></span>
        ))}
      </div>
    </a>
  );
}

function Calendar_() {
  return (
    <section id="calendar" className="sec wrap" aria-labelledby="cal-h">
      <Eyebrow>Season calendar</Eyebrow>
      <div id="cal-h"><H2 a="Every night." b="One calendar" /></div>
      <p className="sub">Tap a date to see what is on, then grab tickets or ask about a table.</p>
      <Calendar />
    </section>
  );
}

function Nights() {
  const list = events.filter((e) => e.key);
  return (
    <section id="nights" className="sec wrap" aria-labelledby="nt-h">
      <Eyebrow>The nights</Eyebrow>
      <div className="pf__head">
        <div id="nt-h"><H2 a="Get tickets." b="Or a table" /></div>
        <a href={u("/tulum-festival-season")} className="cta-pill">All nights <Arrow /></a>
      </div>
      <p className="sub">Tap a flyer's Get tickets for the ticket link. Want a table or VIP? Inquire and we reply on WhatsApp.</p>
      <div className="evgrid">{list.map((e, i) => <NightCard key={i} e={e} />)}</div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="sec wrap" aria-labelledby="svc-h">
      <Eyebrow>Around the nights</Eyebrow>
      <div id="svc-h"><H2 a="Everything else" b="in one message" /></div>
      <p className="sub">Rides, dinners, beach days and boats, lined up around the events you pick.</p>
      <div className="svc">
        {services.map((s, i) => (
          <a key={s.slug} href={u(`/${s.slug}`)} className={`svc__c ${i % 3 === 0 ? "svc__c--up" : ""}`} data-rise>
            <span className="mono svc__k">{s.num} / {s.kicker}</span>
            <span className="svc__ic"><Icon name={s.icon} /></span>
            <h3>{s.title}</h3>
            <p>{s.short}</p>
            <span className="svc__go">{s.cardCta} <Arrow /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function VillaStrip() {
  const href = site.villaAffiliateUrl || u("/villas");
  return (
    <section id="villas" className="sec wrap" aria-labelledby="vs-h">
      <div className="vstrip">
        <img src={img.villaJungle} alt="" loading="lazy" width={1200} height={800} />
        <div className="vstrip__t">
          <Eyebrow>Villa partner · {site.villaPartner}</Eyebrow>
          <div id="vs-h"><H2 a="Stay close" b="to the nights" /></div>
          <p className="sub">Browse private villas for the season with {site.villaPartner}. We'll line up tickets, tables and rides around your dates.</p>
          <a className="cta-hero" href={href} {...(site.villaAffiliateUrl ? { target: "_blank", rel: "noopener sponsored" } : {})}>Browse villas <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="sec wrap team" aria-labelledby="team-h">
      <div className="team__film" aria-hidden="true"><LogoAnim loop /><span className="team__word">connected</span></div>
      <div>
        <Eyebrow>The team</Eyebrow>
        <div id="team-h"><H2 a="The people" b="on the ground" /></div>
        <ul className="team__l">
          {team.map((t, i) => (
            <li key={t.name}><span className="mono">0{i + 1}</span><div><b>{t.name}</b><span>{t.role}</span><p>{t.note}</p></div></li>
          ))}
        </ul>
        <a className="cta-pill" href={waLink(waTemplate("Talk to the team"))} target="_blank" rel="noopener">Talk to the team <Arrow /></a>
      </div>
    </section>
  );
}

function Reviews() {
  if (!reviews.length) return null;
  return (
    <section id="testimonials" className="sec wrap" aria-labelledby="rev-h">
      <Eyebrow>Reviews</Eyebrow>
      <div id="rev-h"><H2 a="What our guests" b="say" /></div>
      <div className="rev">
        {reviews.map((r) => (
          <figure key={r.name + r.quote.slice(0, 10)} className="rev__c"><blockquote>{r.quote}</blockquote><figcaption>{r.name}{r.source ? ` · ${r.source}` : ""}</figcaption></figure>
        ))}
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="sec wrap" aria-labelledby="how-h">
      <Eyebrow>How it works</Eyebrow>
      <div id="how-h"><H2 a="From first message" b="to first night" /></div>
      <ol className="how">
        {steps.map((s, i) => (
          <li key={s.t} data-rise><span className="how__n">0{i + 1}</span><h3>{s.t}</h3><p>{s.d}</p></li>
        ))}
      </ol>
      <div className="how__cta">
        <p>Want it all mapped out? Get a plan for your nights, rides and tables.</p>
        <a className="cta-hero" href={u("/contact")}>Get my schedule <Arrow /></a>
      </div>
    </section>
  );
}

function Home() {
  useReveal();
  return (
    <Shell overlay>
      <Hero />
      <Marquee />
      {VARIANT === "dark" && <SeasonScroller />}
      <Nights />
      <Calendar_ />
      <Services />
      <VillaStrip />
      <Team />
      <Reviews />
      <How />
      <section className="sec wrap" aria-labelledby="faq-h">
        <Eyebrow>FAQ</Eyebrow>
        <div id="faq-h"><H2 a="Quick" b="answers" /></div>
        <Faq items={faqs} />
      </section>
      <ClosingCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: site.name,
            url: site.domain,
            email: site.email,
            areaServed: "Tulum, Quintana Roo, Mexico",
            sameAs: Object.values(site.socials),
          }),
        }}
      />
    </Shell>
  );
}
