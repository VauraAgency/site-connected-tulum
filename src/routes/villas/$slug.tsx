import { createFileRoute, notFound } from "@tanstack/react-router";
import { site, villas, waLink } from "../../content/site";
import { Shell, Eyebrow, H2, Arrow, WaGlyph } from "../../components/site/ui";

export const Route = createFileRoute("/villas/$slug")({
  loader: ({ params }) => {
    const i = villas.findIndex((v) => v.slug === params.slug);
    if (i < 0) throw notFound();
    return { i };
  },
  head: ({ params }) => {
    const v = villas.find((x) => x.slug === params.slug);
    return {
      meta: v
        ? [
            { title: `${v.name} Tulum${v.guests ? `: Villa for ${v.guests} Guests` : ""} | Connected Tulum` },
            { name: "description", content: `${v.name}, ${v.area}. ${v.hook} Book direct with Connected Tulum.` },
            { property: "og:image", content: v.images[0] },
          ]
        : [],
      links: [{ rel: "canonical", href: `${site.domain}/villas/${params.slug}` }],
    };
  },
  component: VillaPage,
});

function VillaPage() {
  const { i } = Route.useLoaderData();
  const v = villas[i];
  const next = villas[(i + 1) % villas.length];
  const prev = villas[(i - 1 + villas.length) % villas.length];
  const msg = `Hi Connected Tulum! I'd like to book ${v.name}.\n\nName:\nEmail:\nTravel dates:\nGroup size:\nCelebrating anything?`;
  const spec = (n: number | null) => (n ? String(n) : "On request");
  return (
    <Shell>
      <section className="page-head wrap">
        <a href="/villas" className="back mono">← Back to all villas</a>
        <p className="eyebrow"><span className="eyebrow__rule" />{v.area}</p>
        <h1 className="h1">{v.name} <em className="accent">Tulum</em></h1>
        <dl className="specs">
          <div><dt className="mono">Guests</dt><dd>{v.guests ? `Up to ${v.guests}` : "On request"}</dd></div>
          <div><dt className="mono">Bedrooms</dt><dd>{spec(v.bedrooms)}</dd></div>
          <div><dt className="mono">Bathrooms</dt><dd>{spec(v.bathrooms)}</dd></div>
          <div><dt className="mono">Style</dt><dd>{v.style}</dd></div>
        </dl>
        <div className="hero__ctas">
          <a className="cta-wa" href={waLink(msg)} target="_blank" rel="noopener"><WaGlyph /> Book on WhatsApp</a>
          {v.bookingUrl && <a className="cta-ghost cta-ghost--dark" href={v.bookingUrl} target="_blank" rel="noopener sponsored">Book online <Arrow /></a>}
        </div>
      </section>
      <section className="wrap gal" aria-label="Gallery">
        {v.images.map((src, k) => (
          <img key={src + k} src={src} alt={`${v.name} photo ${k + 1}`} loading={k ? "lazy" : "eager"} width={1200} height={900} className={k === 0 ? "gal__main" : ""} />
        ))}
      </section>
      <section className="sec wrap villa__ov">
        <div>
          <Eyebrow>Overview</Eyebrow>
          <H2 a={v.name} b="in detail" />
          {v.overview.map((p) => <p key={p} className="sub">{p}</p>)}
        </div>
        <div className="villa__am">
          <h3>Property & amenities</h3>
          <ul>{v.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      </section>
      <section className="closing">
        <div className="closing__glow" aria-hidden="true" />
        <div className="wrap closing__in">
          <h2 className="h2 h2--light">{v.name}, <em className="accent">your week</em>.</h2>
          <p className="closing__p">Send your dates. We confirm availability and the direct rate fast.</p>
          <div className="closing__ctas">
            <a className="cta-wa" href={waLink(msg)} target="_blank" rel="noopener"><WaGlyph /> Book via WhatsApp</a>
            <a className="cta-ghost" href={`mailto:${site.email}?subject=${encodeURIComponent(v.name + " inquiry")}`}>Email the concierge <Arrow /></a>
          </div>
        </div>
      </section>
      <nav className="wrap pager" aria-label="More villas">
        <a href={`/villas/${prev.slug}`}><span className="mono">Previous</span>{prev.name}</a>
        <a href="/villas" className="pager__all">All villas</a>
        <a href={`/villas/${next.slug}`} className="pager__next"><span className="mono">Next villa</span>{next.name}</a>
      </nav>
    </Shell>
  );
}
