/*
 * Beach Please booking links, tagged so every click is attributable to Connected Tulum.
 *
 * Two layers of attribution:
 * 1. BP_ENGINE: Hector's dedicated Guesty booking engine (built by Beach Please), so their
 *    reports show Connected Tulum as the source. All 35 villas live there.
 * 2. UTM tags on every link as a backup (utm_source=connectedtulum), plus a GTM event on click.
 */
export const BP_ENGINE = "https://connectedtulum.guestybookings.com";
export const BP_SOURCE = "connectedtulum";

export const BP_SITE = "https://beachpleasetulum.com";

type BpVilla = { slug: string; gid?: string; bpPage?: string };

export type Stay = { checkIn?: string; checkOut?: string; guests?: number };

/** Tracked link for a villa, or null when it has no Beach Please listing. Dates carry through when known. */
export function bpLink(v: BpVilla, placement = "villa-page", stay?: Stay) {
  if (v.gid) return bpUrl(v.gid, v.slug, placement, undefined, stay);
  if (v.bpPage) return bpUrl("", v.slug, placement, `${BP_SITE}/properties/details/${v.bpPage}`);
  return null;
}

export function stayParams(stay?: Stay) {
  const q = new URLSearchParams();
  if (stay?.checkIn && stay?.checkOut) {
    q.set("checkIn", stay.checkIn);
    q.set("checkOut", stay.checkOut);
  }
  if (stay?.guests) {
    q.set("minOccupancy", String(stay.guests));
    q.set("adults", String(stay.guests));
  }
  return q;
}

/** Search results page on the engine: every villa available for the dates, with totals. */
export function bpSearchUrl(stay?: Stay, placement = "search") {
  const q = stayParams(stay);
  q.set("utm_source", BP_SOURCE);
  q.set("utm_medium", "referral");
  q.set("utm_campaign", "villas");
  q.set("utm_content", `all__${placement}`);
  q.set("ref", BP_SOURCE);
  return `${BP_ENGINE}/en/properties?${q.toString()}`;
}

export function bpUrl(gid: string, slug: string, placement = "villa-page", base?: string, stay?: Stay) {
  const q = stayParams(stay);
  for (const [k, v] of Object.entries({
    utm_source: BP_SOURCE,
    utm_medium: "referral",
    utm_campaign: "villas",
    utm_content: `${slug}__${placement}`,
    ref: BP_SOURCE,
  })) q.set(k, v);
  return `${base ?? `${BP_ENGINE}/en/properties/${gid}`}?${q.toString()}`;
}

type DL = { push: (o: Record<string, unknown>) => void };

export function trackBP(slug: string, name: string, placement = "villa-page") {
  try {
    const w = window as unknown as { dataLayer?: DL };
    (w.dataLayer = w.dataLayer || ([] as unknown as DL)).push({
      event: "beach_please_click",
      partner: "beach_please",
      villa_slug: slug,
      villa_name: name,
      placement,
    });
  } catch {
    /* tracking must never block the click */
  }
}
