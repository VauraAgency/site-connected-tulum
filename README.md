# Connected Tulum

Concierge site for Connected Tulum (connectedtulum.com). Built as a framework modeled on the Prestigia layout: every villa, service, event and venue lives in one content file, so the client's real inventory can be dropped in without touching layout code.

## Stack
TanStack Start (React 19) + Vite 7, prerendered to static HTML in `dist/client`. Deploys on Vercel, Netlify, Cloudflare Pages or any static host.

## Run
```bash
npm install
npm run dev       # local dev
npm run build     # fetches images, builds, prerenders every page
npm run preview
```
`npm run build` runs `scripts/fetch-assets.mjs` first, which downloads the generated hero/section images into `public/assets` (skipped if already present).

## Where to edit
Everything is in `src/content/site.ts`:

| Block | What it controls |
|---|---|
| `site` | WhatsApp number, email, Calendly URL, hero video, logo video, socials, call hours |
| `villas` | Villa cards and `/villas/<slug>` pages (add one object per villa) |
| `services` | Service catalogue and `/<slug>` service pages |
| `events` | High Season 2027 calendar (`ticketUrl` = promoter/affiliate link, falls back to WhatsApp) |
| `festivalPages`, `landingPages` | SEO pages (NYE, Zamna, Tehmplo, Day Zero, bachelor, beach clubs, etc.) |
| `venues`, `team`, `reviews`, `faqs` | Carousel, team, reviews (hidden while empty), FAQ |

Routes: `/`, `/villas`, `/villas/<slug>`, `/contact`, and `/<slug>` for any service, festival or landing page.

## Pending from the client (marked PENDING in `site.ts`)
- Confirm WhatsApp number
- Calendly (or similar) scheduler link, then set `site.calendlyUrl`
- Top banner video from the filmmaker, then set `site.heroVideo`
- Real villas, rates, photos; service pricing
- Affiliate / ticket promoter links per event and villa
- Reviews, team bios, domain access

Site by VAURA.
