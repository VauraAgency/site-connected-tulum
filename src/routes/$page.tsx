import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  site, events, festivalPages, landingPages, serviceBySlug, services, villas, fmtDate, waLink, waTemplate, img,
  type Service, type FestivalPage, type LandingPage, type TEvent,
} from "../content/site";
import { Shell, Eyebrow, H2, Arrow, ClosingCTA, Faq, WaGlyph, Icon, useReveal } from "../components/site/ui";

type Resolved =
  | { kind: "service"; s: Service }
  | { kind: "festival"; p: FestivalPage }
  | { kind: "landing"; p: LandingPage };

function resolve(slug: string): Resolved | null {
  const s = serviceBySlug(slug);
  if (s) return { kind: "service", s };
  const f = festivalPages.find((x) => x.slug === slug);
  if (f) return { kind: "festival", p: f };
  const l = landingPages.find((x) => x.slug === slug);
  if (l) return { kind: "landing", p: l };
  return null;
}

export const Route = createFileRoute("/$page")({
  loader: ({ params }) => {
    if (!resolve(params.page)) throw notFound();
    return { slug: params.page };
  },
  head: ({ params }) => {
    const r = resolve(params.page);
    if (!r) return {};
    const title = r.kind === "service" ? `${r.s.h1} | Connected Tulum` : r.p.title;
    const description = r.kind === "service" ? `${r.s.short} ${r.s.intro}`.trim() : r.p.description;
    const image = r.kind === "service" ? r.s.image : r.p.image;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
      ],
      links: [{ rel: "canonical", href: `${site.domain}/${params.page}` }],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useLoaderData();
  const r = resolve(slug)!;
  useReveal();
  return (
    <Shell>
      {r.kind === "service" && <ServicePage s={r.s} />}
      {r.kind === "festival" && <Festival p={r.p} />}
      {r.kind === "landing" && <Landing p={r.p} />}
    </Shell>
  );
}

function RestOfTrip({ skip }: { skip: string }) {
  const list = services.filter((s) => s.slug !== skip).slice(0, 6);
  return (
    <section className="sec wrap" aria-label="Plan the rest of the trip">
      <Eyebrow>Plan the rest of the trip</Eyebrow>
      <div className="rest">
        {list.map((s) => (
          <a key={s.slug} href={`/${s.slug}`} className="rest__c" data-rise>
            <img src={s.image} alt="" loading="lazy" width={600} height={450} />
            <span><Icon name={s.icon} size={16} /> {s.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ================================================================ SERVICE */
function ServicePage({ s }: { s: Service }) {
  return (
    <>
      <section className="page-head wrap svcp">
        <div>
          <nav className="crumbs mono" aria-label="Breadcrumb"><a href="/">Connected</a> / {s.title}</nav>
          <h1 className="h1">{s.h1} <em className="accent">({s.items.length})</em></h1>
          <p className="sub">{s.short}</p>
          {s.included.length > 0 && <p className="mono svcp__inc">{s.included.join(" · ")}</p>}
          <p className="sub">{s.intro}</p>
          <div className="hero__ctas">
            <a className="cta-wa" href={waLink(waTemplate(s.title))} target="_blank" rel="noopener"><WaGlyph /> Get matched on WhatsApp</a>
          </div>
        </div>
        <img className="svcp__img" src={s.image} alt={s.title} width={1200} height={900} />
      </section>

      <section className="sec sec--tight wrap">
        <H2 a="Choose your" b={s.title.toLowerCase()} />
        <div className="items">
          {s.items.map((it) => (
            <article key={it.name} className="item" data-rise>
              {it.badge && <span className="item__badge mono">{it.badge}</span>}
              <h3>{it.name}</h3>
              {it.meta && <p className="item__meta">{it.meta}</p>}
              <p className="item__price">{it.price || "Rate on request"}</p>
              <a className="item__go" href={it.link || waLink(waTemplate(`${s.title}: ${it.name}`))} target="_blank" rel={it.link ? "noopener sponsored" : "noopener"}>
                {it.link ? "Book now" : "Inquire"} <Arrow />
              </a>
            </article>
          ))}
        </div>
        {s.included.length > 0 && (
          <div className="incl"><span className="mono">Always included</span><p>{s.included.join(" · ")}</p></div>
        )}
        {s.notes.length > 0 && (
          <dl className="notes">{s.notes.map((n) => <div key={n.label}><dt className="mono">{n.label}</dt><dd>{n.text}</dd></div>)}</dl>
        )}
      </section>
      <RestOfTrip skip={s.slug} />
      <ClosingCTA a={`${s.title},`} b="handled" topic={s.title} />
    </>
  );
}

/* ================================================================ FESTIVAL / EVENTS */
function eventsFor(p: FestivalPage): TEvent[] {
  if (p.slug === "tulum-festival-season") return events;
  if (p.slug === "nye-2027") return events.filter((e) => e.date.endsWith("12-31"));
  return events.filter((e) => e.festival === p.festival);
}

function EventCard({ e }: { e: TEvent }) {
  const d = fmtDate(e.date);
  const name = `${e.title}${e.venue && !e.title.includes(e.venue) && e.title !== e.venue ? ` @ ${e.venue}` : ""}`;
  return (
    <article className="ev" data-rise>
      <div className="ev__flyer">
        {e.flyer ? (
          <img src={e.flyer} alt={`${name} flyer`} loading="lazy" width={800} height={1000} />
        ) : (
          <div className="ev__ph">
            <img src={e.festival ? img.festival : img.beachClub} alt="" loading="lazy" width={800} height={600} />
            <span className="ev__ph-t">{e.tbd ? "Lineup TBA" : e.lineup || e.title}</span>
          </div>
        )}
        <span className="ev__date"><b>{d.day}</b><span>{d.mon}</span></span>
      </div>
      <div className="ev__b">
        <p className="mono">{d.wk} · {e.venue}{e.time ? ` · ${e.time}` : ""}</p>
        <h3>{name}</h3>
        {e.lineup && <p className="ev__lu">Lineup: {e.lineup}</p>}
        <div className="ev__ctas">
          {e.ticketUrl ? (
            <a className="cta-ticket" href={e.ticketUrl} target="_blank" rel="noopener sponsored">Tickets <Arrow /></a>
          ) : null}
          <a className={e.ticketUrl ? "linkish" : "cta-ticket"} href={waLink(waTemplate(`${name} (${d.long}): ${e.ticketUrl ? "VIP table" : "tickets / VIP table"}`))} target="_blank" rel="noopener">
            {e.ticketUrl ? "Book a table" : "Reserve a table"} <Arrow />
          </a>
        </div>
      </div>
    </article>
  );
}

function Festival({ p }: { p: FestivalPage }) {
  const list = eventsFor(p);
  return (
    <>
      <section className="fhero">
        <img src={p.image} alt="" className="fhero__bg" width={1600} height={1200} />
        <div className="fhero__shade" aria-hidden="true" />
        <div className="wrap fhero__in">
          <p className="mono">{p.eyebrow}</p>
          <h1 className="h1 h1--light">{p.h1a} <em className="accent">{p.h1b}</em></h1>
          <p className="fhero__lead">{p.lead}</p>
          <div className="hero__ctas">
            <a className="cta-hero" href="#nights">See the nights <Arrow /></a>
            <a className="cta-wa" href={waLink(waTemplate(p.h1a + " VIP table"))} target="_blank" rel="noopener"><WaGlyph /> Request a VIP table</a>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <Eyebrow>01 · The season</Eyebrow>
        <H2 a="How it works." b="Choose the night" />
        <dl className="facts">{p.facts.map((f) => <div key={f.k}><dt className="mono">{f.k}</dt><dd>{f.v}</dd></div>)}</dl>
      </section>

      <section id="nights" className="sec sec--tight wrap">
        <Eyebrow>02 · Announced nights</Eyebrow>
        <H2 a="The calendar." b="More coming" />
        <div className="evgrid">{list.map((e, i) => <EventCard key={i} e={e} />)}</div>
        <p className="sub">Dates update as lineups are announced. Flyers, set times and ticket links drop here first.</p>
      </section>

      <section className="sec wrap">
        <Eyebrow>03 · Field guide</Eyebrow>
        <div className="guide">
          {p.guide.map((g, i) => <div key={g.t} className="guide__c" data-rise><span className="how__n">0{i + 1}</span><h3>{g.t}</h3><p>{g.d}</p></div>)}
        </div>
      </section>

      <section className="sec wrap">
        <Eyebrow>04 · Beyond the table</Eyebrow>
        <H2 a="Stay, ride," b="recover" />
        <div className="rest">
          {[
            { t: "Villas", to: "/villas", im: villas[0].images[0] },
            { t: "Transport", to: "/transportation", im: img.transport },
            { t: "Recovery", to: "/wellness", im: img.spa },
            { t: "Yachts", to: "/boats", im: img.boat },
          ].map((x) => (
            <a key={x.t} href={x.to} className="rest__c" data-rise><img src={x.im} alt="" loading="lazy" width={600} height={450} /><span>{x.t} <Arrow /></span></a>
          ))}
        </div>
      </section>

      {p.faqs.length > 0 && (
        <section className="sec wrap">
          <Eyebrow>05 · Direct answers</Eyebrow>
          <Faq items={p.faqs} />
        </section>
      )}
      <ClosingCTA a="Plan the night" b="with Connected" topic={p.h1a} />
    </>
  );
}

/* ================================================================ LANDING */
function Landing({ p }: { p: LandingPage }) {
  return (
    <>
      <section className="fhero">
        <img src={p.image} alt="" className="fhero__bg" width={1600} height={1200} />
        <div className="fhero__shade" aria-hidden="true" />
        <div className="wrap fhero__in">
          <p className="mono">{p.eyebrow}</p>
          <h1 className="h1 h1--light">{p.h1a} <em className="accent">{p.h1b}</em></h1>
          <p className="fhero__lead">{p.lead}</p>
          <div className="hero__ctas">
            <a className="cta-hero" href="#plan">See the plan ↓</a>
            <a className="cta-ghost" href="/tulum-festival-season">High Season 2027 dates <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <Eyebrow>01 · The brief</Eyebrow>
        <h2 className="h2">{p.problem.h}</h2>
        <p className="sub">{p.problem.p}</p>
        <dl className="facts">{p.stats.map((f) => <div key={f.k}><dt className="mono">{f.k}</dt><dd>{f.v}</dd></div>)}</dl>
      </section>

      <section id="plan" className="sec wrap">
        <Eyebrow>02 · The plan</Eyebrow>
        <H2 a="Every day." b="No dead time" />
        <div className="days">
          {p.plan.map((d) => (
            <article key={d.label} className="day" data-rise>
              <img src={d.image} alt="" loading="lazy" width={800} height={600} />
              <p className="mono">{d.label}</p>
              <h3>{d.h}</h3>
              <ul>{d.points.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="sec wrap">
        <Eyebrow>03 · The stay</Eyebrow>
        <div className="stay">
          {villas.slice(0, 3).map((v) => (
            <a key={v.slug} href={`/villas/${v.slug}`} className="stay__c" data-rise>
              <img src={v.images[0]} alt={v.name} loading="lazy" width={800} height={600} />
              <b>{v.name}</b><span>{v.area} · {v.guests ? `Up to ${v.guests}` : "Capacity on request"}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="wrap">
          <Eyebrow>04 · Everything handled</Eyebrow>
          <div className="tiles">{p.tiles.map((t) => <div key={t.h} className="tile"><h3>{t.h}</h3><p>{t.p}</p></div>)}</div>
        </div>
      </section>

      {p.faqs.length > 0 && (
        <section className="sec wrap">
          <Eyebrow>05 · Direct answers</Eyebrow>
          <Faq items={p.faqs} />
        </section>
      )}
      <ClosingCTA a="Two details:" b="dates and headcount" topic={p.eyebrow} label={p.ctaLabel} />
    </>
  );
}
