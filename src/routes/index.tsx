import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  site, img, services, villas, venues, events, marquee, team, reviews, faqs, steps, waLink, waTemplate, fmtDate,
} from "../content/site";
import { VillaCard } from "../components/site/cards";
import { Shell, Eyebrow, H2, Icon, Arrow, ClosingCTA, Faq, WaGlyph, LogoAnim, useReveal } from "../components/site/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connected Tulum | Villas, VIP Tables, Festivals & 24/7 Concierge" },
      { name: "description", content: "Luxury villas, VIP tables, Zamna, Tehmplo, Day Zero, yachts, chefs and 24/7 concierge in Tulum. One contact for the whole trip." },
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
      <div className="hero__corner hero__corner--l mono">EST · TULUM</div>
      <div className="hero__corner hero__corner--r mono">VILLAS · TABLES · FESTIVALS</div>
      <div className="wrap hero__in">
        <h1 id="hero-h" className="hero__h">
          Get connected to <em className="accent">the real Tulum</em>.
        </h1>
        <p className="hero__lead">Private villas, VIP tables, high season festivals and a 24/7 concierge. One contact for the whole trip.</p>
        <div className="hero__ctas">
          <a className="cta-hero" href="/contact">Get your custom plan <Arrow /></a>
          <a className="cta-wa" href={waLink(waTemplate("24/7 VIP Concierge"))} target="_blank" rel="noopener"><WaGlyph /> Concierge 24/7</a>
        </div>
        <ul className="hero__trust mono">
          <li>Luxury villas</li><li>VIP reservations</li><li>High Season 2027</li><li>Yachts</li><li>24/7</li>
        </ul>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <a className="marq" href="/tulum-festival-season" aria-label="High Season 2027 lineup">
      <div className="marq__track">
        {row.map((m, i) => (
          <span key={i} className="marq__i"><em>{m}</em><span className="marq__dot" aria-hidden="true">✦</span></span>
        ))}
      </div>
    </a>
  );
}

function Services() {
  return (
    <section id="services" className="sec wrap" aria-labelledby="svc-h">
      <Eyebrow>Service catalogue</Eyebrow>
      <div id="svc-h"><H2 a="One team. One contact." b="Your whole Tulum" /></div>
      <p className="sub">From the airport pickup to the last table of the night, you deal with one person.</p>
      <div className="svc">
        {services.map((s, i) => (
          <a key={s.slug} href={`/${s.slug}`} className={`svc__c ${i % 3 === 0 ? "svc__c--up" : ""}`} data-rise>
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

function Portfolio() {
  return (
    <section id="villas" className="sec wrap" aria-labelledby="pf-h">
      <Eyebrow>The portfolio</Eyebrow>
      <div className="pf__head">
        <div id="pf-h"><H2 a="Villas we manage." b="And access to the ones we don't" /></div>
        <a href="/villas" className="cta-pill">All villas <Arrow /></a>
      </div>
      <p className="sub">Starting with our signature stay and growing every week. Found a villa somewhere else? We'll book that one too.</p>
      <div className="vgrid">
        {villas.map((v) => <VillaCard key={v.slug} v={v} />)}
      </div>
    </section>
  );
}

function Venues() {
  const track = useRef<HTMLDivElement>(null);
  const go = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section id="venues" className="sec sec--dark" aria-labelledby="ven-h">
      <div className="wrap">
        <Eyebrow>Where the city goes</Eyebrow>
        <div className="pf__head">
          <div id="ven-h"><H2 a="Tables at the places" b="that say they're full" /></div>
          <div className="arrows">
            <button onClick={() => go(-1)} aria-label="Previous venues">←</button>
            <button onClick={() => go(1)} aria-label="Next venues">→</button>
          </div>
        </div>
      </div>
      <div className="ven" ref={track}>
        {venues.map((v) => (
          <article key={v.name} className="ven__c">
            <div className="ven__img"><img src={v.image} alt={v.name} loading="lazy" width={800} height={600} /></div>
            <span className="mono ven__tag">{v.tag}</span>
            <h3>{v.name}</h3>
            <ul>{v.points.map((p) => <li key={p}>{p}</li>)}</ul>
            {v.page ? (
              <a href={v.page} className="ven__go">Open the night page <Arrow /></a>
            ) : (
              <a href={waLink(waTemplate(`Table at ${v.name}`))} target="_blank" rel="noopener" className="ven__go">Book a table <Arrow /></a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Upcoming() {
  const list = events.filter((e) => e.festival || e.title.startsWith("NYE")).slice(0, 8);
  return (
    <section className="sec wrap" aria-labelledby="up-h">
      <Eyebrow>High Season 2027</Eyebrow>
      <div className="pf__head">
        <div id="up-h"><H2 a="NYE to Day Zero." b="Pick your nights" /></div>
        <a href="/tulum-festival-season" className="cta-pill">Full calendar <Arrow /></a>
      </div>
      <ol className="up">
        {list.map((e, i) => {
          const d = fmtDate(e.date);
          return (
            <li key={i} className="up__r" data-rise>
              <span className="up__d"><b>{d.day}</b><span className="mono">{d.mon}</span></span>
              <span className="up__t"><b>{e.title}</b><span>{e.venue}{e.tbd ? " · lineup TBA" : ""}</span></span>
              {e.ticketUrl ? (
                <a href={e.ticketUrl} target="_blank" rel="noopener sponsored" className="up__go">Tickets <Arrow /></a>
              ) : (
                <a href={waLink(waTemplate(`${e.title} @ ${e.venue} (${d.long})`))} target="_blank" rel="noopener" className="up__go">Reserve <Arrow /></a>
              )}
            </li>
          );
        })}
      </ol>
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
        <p>Want it all mapped out? Get a personalized schedule for your trip.</p>
        <a className="cta-hero" href="/contact">Get my schedule <Arrow /></a>
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
      <Services />
      <Portfolio />
      <Venues />
      <Upcoming />
      <Team />
      <Reviews />
      <How />
      <section className="sec wrap" aria-labelledby="faq-h">
        <Eyebrow>FAQ</Eyebrow>
        <div id="faq-h"><H2 a="What groups" b="are asking" tail="" /></div>
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
