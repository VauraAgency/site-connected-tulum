import { u } from "../../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { site, img, waLink, waTemplate } from "../../content/site";
import { Shell, Eyebrow, H2, ClosingCTA, Arrow, WaGlyph, useReveal } from "../../components/site/ui";

export const Route = createFileRoute("/villas/")({
  head: () => ({
    meta: [
      { title: "Villas in Tulum | Connected Tulum" },
      { name: "description", content: `Private villas in Tulum for groups and high season, booked through our partner ${site.villaPartner}. Pair your stay with tickets, tables and transport from Connected Tulum.` },
    ],
    links: [{ rel: "canonical", href: `${site.domain}/villas` }],
  }),
  component: VillasPage,
});

const styles = [
  { t: "Jungle retreats", d: "Private pools, hidden in the trees.", image: img.villaJungle },
  { t: "Modern in town", d: "Rooftops and plunge pools by Aldea Zamá.", image: img.villaModern },
  { t: "Beachfront", d: "Sand outside the door.", image: img.villaBeach },
];

function VillasPage() {
  useReveal();
  const href = site.villaAffiliateUrl || waLink(waTemplate("Villa for high season"));
  const ext = !!site.villaAffiliateUrl;
  return (
    <Shell>
      <section className="page-head wrap">
        <nav className="crumbs mono" aria-label="Breadcrumb"><a href={u("/")}>Connected</a> / Villas</nav>
        <Eyebrow>Villa partner · {site.villaPartner}</Eyebrow>
        <h1 className="h1">Villas in Tulum, <em className="accent">handled</em>.</h1>
        <p className="sub">Browse the full villa collection with our partner {site.villaPartner}. Then let us line up the nights, the rides and the tables around your stay.</p>
        <div className="hero__ctas">
          <a className="cta-hero" href={href} target="_blank" rel={ext ? "noopener sponsored" : "noopener"}>{ext ? "Browse villas" : "Ask for villas"} <Arrow /></a>
          <a className="cta-wa" href={waLink(waTemplate("Villa for high season"))} target="_blank" rel="noopener"><WaGlyph /> WhatsApp {site.whatsappDisplay}</a>
        </div>
      </section>
      <section className="sec sec--tight wrap">
        <div className="stay">
          {styles.map((s) => (
            <a key={s.t} href={href} target="_blank" rel={ext ? "noopener sponsored" : "noopener"} className="stay__c" data-rise>
              <img src={s.image} alt="" loading="lazy" width={800} height={600} />
              <b>{s.t}</b><span>{s.d}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="sec wrap">
        <Eyebrow>Not seeing it?</Eyebrow>
        <H2 a="Found a villa somewhere else?" b="Send it over" />
        <p className="sub">Send us the link with your dates and group size. We build the rest of the trip around it.</p>
      </section>
      <ClosingCTA a="Tell us the dates," b="we'll sort the villa" topic="Villa for high season" />
    </Shell>
  );
}
