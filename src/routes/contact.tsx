import { u } from "../lib/url";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { site, waLink } from "../content/site";
import { Shell, Arrow, WaGlyph } from "../components/site/ui";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Plan Your Tulum Trip: Book a Call | Connected Tulum" },
      { name: "description", content: "Book a free planning call with Connected Tulum. Villas, transport, VIP tables, festivals, yachts and private events." },
    ],
    links: [{ rel: "canonical", href: `${site.domain}/contact` }],
  }),
  component: Contact,
});

const NYE = ["NYE @ Ahau", "NYE @ Papaya Playa Project", "NYE @ Nomade", "NYE @ Gitano Beach & Jungle", "Renaissance @ Zamna", "Not sure yet"];
const TABLES = ["Zamna", "Tehmplo", "Day Zero", "Papaya Playa", "Nomade"];
const NEEDS = ["Villa", "Transportation", "VIP tables", "Yacht / catamaran", "Private chef", "Spa & wellness", "DJ", "Photo & video", "Private event", "Bachelor / bachelorette"];

type ListKey = "nye" | "tables" | "needs";
type F = { name: string; method: string; phone: string; email: string; dates: string; group: string; nye: string[]; tables: string[]; needs: string[]; notes: string };

function Chips({ k, opts, legend, f, tog }: { k: ListKey; opts: string[]; legend: string; f: F; tog: (k: ListKey, v: string) => void }) {
  return (
    <fieldset className="chips">
      <legend>{legend}</legend>
      {opts.map((o) => (
        <label key={o} className={`chip ${f[k].includes(o) ? "chip--on" : ""}`}>
          <input type="checkbox" checked={f[k].includes(o)} onChange={() => tog(k, o)} />{o}
        </label>
      ))}
    </fieldset>
  );
}

function Contact() {
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState<F>({ name: "", method: "WhatsApp", phone: "", email: "", dates: "", group: "", nye: [], tables: [], needs: [], notes: "" });
  const set = (k: keyof F, v: string) => setF({ ...f, [k]: v });
  const tog = (k: ListKey, v: string) =>
    setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  const summary = [
    `Hi Connected Tulum! New trip request.`,
    `Name: ${f.name}`,
    `Preferred contact: ${f.method}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    `Dates: ${f.dates || "TBD"}`,
    `Group size: ${f.group || "TBD"}`,
    f.needs.length ? `Looking for: ${f.needs.join(", ")}` : "",
    f.nye.length ? `NYE 2027 interest: ${f.nye.join(", ")}` : "",
    f.tables.length ? `Festival tables: ${f.tables.join(", ")}` : "",
    f.notes ? `Notes: ${f.notes}` : "",
  ].filter(Boolean).join("\n");

  const cal = site.calendlyUrl
    ? `${site.calendlyUrl}${site.calendlyUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(f.name)}&email=${encodeURIComponent(f.email)}&a1=${encodeURIComponent(summary)}`
    : "";

  return (
    <Shell>
      <section className="page-head wrap contact">
        <a href={u("/")} className="back mono">← Back to home</a>
        <h1 className="h1">Plan your Tulum trip, <em className="accent">connected</em>.</h1>
        <p className="sub">A free call to map out villas, transport, tables, festivals, boats and anything else. Answer a few quick questions so we can fast track it.</p>

        <div className="cform">
          <ol className="cform__steps mono" aria-label="Progress">
            <li className={step === 1 ? "on" : "done"}>01 · Your details</li>
            <li className={step === 2 ? "on" : ""}>02 · Pick a time</li>
          </ol>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <div className="cform__grid">
                <label>Full name *<input required value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></label>
                <label>Preferred contact
                  <select value={f.method} onChange={(e) => set("method", e.target.value)}>
                    <option>WhatsApp</option><option>iMessage</option><option>Email</option>
                  </select>
                </label>
                <label>Phone / WhatsApp *<input required type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></label>
                <label>Email *<input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
                <label>Travel dates<input placeholder="e.g. Dec 29 to Jan 4" value={f.dates} onChange={(e) => set("dates", e.target.value)} /></label>
                <label>Group size<input inputMode="numeric" placeholder="e.g. 12" value={f.group} onChange={(e) => set("group", e.target.value)} /></label>
              </div>
              <Chips k="needs" opts={NEEDS} legend="What do you need?" f={f} tog={tog} />
              <Chips k="nye" opts={NYE} legend="Which NYE 2027 events are you looking at?" f={f} tog={tog} />
              <Chips k="tables" opts={TABLES} legend="Want a table at any of these?" f={f} tog={tog} />
              <label className="cform__full">Trip details (optional)<textarea rows={4} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></label>
              <button className="cta-hero" type="submit">Next: pick a time <Arrow /></button>
            </form>
          ) : (
            <div className="cform__done">
              {cal ? (
                <iframe title="Book a call" src={cal} className="cform__cal" loading="lazy" />
              ) : (
                <>
                  <h2 className="h2">You're <em className="accent">almost set</em>.</h2>
                  <p className="sub">Send your details below and we'll confirm a call time on {f.method} and come back with a custom plan.</p>
                </>
              )}
              <div className="hero__ctas">
                <a className="cta-wa" href={waLink(summary)} target="_blank" rel="noopener"><WaGlyph /> Send on WhatsApp</a>
                <a className="cta-ghost cta-ghost--dark" href={`mailto:${site.email}?subject=${encodeURIComponent("Trip request: " + f.name)}&body=${encodeURIComponent(summary)}`}>Send by email <Arrow /></a>
              </div>
              <button className="linkish mono" onClick={() => setStep(1)}>← Edit details</button>
            </div>
          )}
        </div>
      </section>

      <section className="sec wrap here">
        <h3 className="h3">We're here for you</h3>
        <ul>
          <li><span className="mono">WhatsApp</span><a href={waLink("Hi Connected Tulum!")} target="_blank" rel="noopener">{site.whatsappDisplay}</a></li>
          <li><span className="mono">Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><span className="mono">Instagram</span><a href={site.socials.instagram} target="_blank" rel="noopener">@connected_tulum</a></li>
          <li><span className="mono">TikTok</span><a href={site.socials.tiktok} target="_blank" rel="noopener">@connected.tulum</a></li>
          <li><span className="mono">Hours</span><span>{site.callHours}</span></li>
        </ul>
      </section>
    </Shell>
  );
}
