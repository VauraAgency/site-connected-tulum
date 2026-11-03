import { u } from "../../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { site, villas, waLink, waTemplate } from "../../content/site";
import { Shell, Eyebrow, H2, ClosingCTA, Arrow, WaGlyph, Carousel, useReveal } from "../../components/site/ui";

export const Route = createFileRoute("/villas/")({
  head: () => ({
    meta: [
      { title: "Villas in Tulum | Connected Tulum" },
      { name: "description", content: `Private villas in Tulum for groups and high season. Pair your stay with tickets, tables and transport from Connected Tulum.` },
    ],
    links: [{ rel: "canonical", href: `${site.domain}/villas` }],
  }),
  component: VillasPage,
});

function VillasPage() {
  useReveal();
  const href = waLink(waTemplate("Villa for high season"));
  return (
    <Shell>
      <section className="page-head wrap">
        <nav className="crumbs mono" aria-label="Breadcrumb"><a href={u("/")}>Connected</a> / Villas</nav>
        <Eyebrow>The collection</Eyebrow>
        <h1 className="h1">Villas in Tulum, <em className="accent">handled</em>.</h1>
        <p className="sub">Private villas for high season. Tell us your dates and group size, then let us line up the nights, the rides and the tables around your stay.</p>
        <div className="hero__ctas">
          <a className="cta-hero" href={href} target="_blank" rel="noopener">Ask for villas <Arrow /></a>
          <a className="cta-wa" href={waLink(waTemplate("Villa for high season"))} target="_blank" rel="noopener"><WaGlyph /> WhatsApp {site.whatsappDisplay}</a>
        </div>
      </section>
      <section className="sec sec--tight wrap">
        <Carousel className="vgrid" label="Villas">
          {villas.map((v) => (
            <a key={v.slug} href={u(`/villas/${v.slug}`)} className="vcard" data-rise>
              <div className="vcard__img">
                <img src={v.images[0]} alt={v.name} loading="lazy" width={800} height={660} />
                <span className="vcard__tag mono">{v.style}</span>
              </div>
              <div className="vcard__b">
                <h3>{v.name}</h3>
                <p className="vcard__m">
                  <span>{v.area}</span>
                  <span><b>{v.bedrooms} bd</b> · Up to {v.guests}</span>
                </p>
              </div>
            </a>
          ))}
        </Carousel>
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
