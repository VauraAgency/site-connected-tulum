import { u } from "../../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { site, villas } from "../../content/site";
import { Shell, Eyebrow, H2, ClosingCTA, useReveal } from "../../components/site/ui";
import { VillaCard } from "../../components/site/cards";

export const Route = createFileRoute("/villas/")({
  head: () => ({
    meta: [
      { title: "Luxury Villas in Tulum | Connected Tulum" },
      { name: "description", content: "Private luxury villas in Tulum for groups, bachelor and bachelorette parties and high season. Direct rates with Connected Tulum." },
    ],
    links: [{ rel: "canonical", href: `${site.domain}/villas` }],
  }),
  component: VillasPage,
});

function VillasPage() {
  useReveal();
  return (
    <Shell>
      <section className="page-head wrap">
        <nav className="crumbs mono" aria-label="Breadcrumb"><a href={u("/")}>Connected</a> / Villas</nav>
        <Eyebrow>The portfolio</Eyebrow>
        <h1 className="h1">Luxury villas in Tulum <em className="accent">({villas.length})</em></h1>
        <p className="sub">Jungle, beach and modern stays for groups. Every villa comes with the full concierge: chef, transport, tables and festival nights.</p>
      </section>
      <section className="sec sec--tight wrap">
        <div className="vgrid">{villas.map((v) => <VillaCard key={v.slug} v={v} />)}</div>
      </section>
      <section className="sec wrap">
        <Eyebrow>Not seeing it?</Eyebrow>
        <H2 a="Found a villa somewhere else?" b="We'll book that one too" />
        <p className="sub">Send us the link with your dates and group size and we take it from there.</p>
      </section>
      <ClosingCTA a="Tell us the dates," b="we'll find the villa" topic="Finding a villa" />
    </Shell>
  );
}
