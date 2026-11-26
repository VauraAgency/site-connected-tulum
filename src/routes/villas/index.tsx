import { u } from "../../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { site, villas, waLink, waTemplate } from "../../content/site";
import { useState } from "react";
import { VillaSearch } from "../../components/site/villasearch";
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

const ZONES = ["Aldea Zama", "La Veleta", "Tankah Bay", "Soliman Bay"];
const zoneOf = (area: string) => ZONES.find((z) => area.includes(z)) ?? "More Tulum";

function VillasPage() {
  useReveal();
  const [zone, setZone] = useState("All");
  const shown = zone === "All" ? villas : villas.filter((v) => zoneOf(v.area) === zone);
  const href = waLink(waTemplate("Villa for high season"));
  return (
    <Shell>
      <section className="page-head wrap">
        <nav className="crumbs mono" aria-label="Breadcrumb"><a href={u("/")}>Connected</a> / Villas</nav>
        <Eyebrow>The collection</Eyebrow>
        <h1 className="h1">Villas in Tulum, <em className="accent">handled</em>.</h1>
        <p className="sub">Private villas for high season. Tell us your dates and group size, then let us line up the nights, the rides and the tables around your stay.</p>
        <VillaSearch placement="villas-page" />
        <p className="vsearch__note mono">Pick your dates here. You land on the villas that are free, with the total price.</p>
        <div className="hero__ctas">
          <a className="cta-wa" href={href} target="_blank" rel="noopener"><WaGlyph /> Ask us for a villa</a>
        </div>
      </section>
      <section className="sec sec--tight wrap">
        <div className="vfilter" role="group" aria-label="Filter villas by area">
          {["All", ...ZONES, "More Tulum"].map((z) => {
            const n = z === "All" ? villas.length : villas.filter((v) => zoneOf(v.area) === z).length;
            return (
              <button key={z} type="button" className={`vfilter__b${zone === z ? " is-on" : ""}`} aria-pressed={zone === z} onClick={() => setZone(z)}>
                {z} <small>{n}</small>
              </button>
            );
          })}
        </div>
        <Carousel key={zone} className="vgrid" label="Villas">
          {shown.map((v) => (
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
