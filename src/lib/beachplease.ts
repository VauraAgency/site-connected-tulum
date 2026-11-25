/*
 * Beach Please booking links, tagged so every click is attributable to Connected Tulum.
 *
 * Two layers of attribution:
 * 1. BP_ENGINE: Beach Please offered a dedicated Guesty booking engine named for Hector.
 *    When they send it, change the base below. Their reports then show the source name.
 * 2. UTM tags on every link as a backup (utm_source=connectedtulum), plus a GTM event on click.
 */
export const BP_ENGINE = "https://beachpleasetulum.guestybookings.com";
export const BP_SOURCE = "connectedtulum";

export const BP_SITE = "https://beachpleasetulum.com";

type BpVilla = { slug: string; gid?: string; bpPage?: string };

/** Tracked link for a villa, or null when it has no Beach Please listing. */
export function bpLink(v: BpVilla, placement = "villa-page") {
  if (v.gid) return bpUrl(v.gid, v.slug, placement);
  if (v.bpPage) return bpUrl("", v.slug, placement, `${BP_SITE}/properties/details/${v.bpPage}`);
  return null;
}

export function bpUrl(gid: string, slug: string, placement = "villa-page", base?: string) {
  const q = new URLSearchParams({
    utm_source: BP_SOURCE,
    utm_medium: "referral",
    utm_campaign: "villas",
    utm_content: `${slug}__${placement}`,
    ref: BP_SOURCE,
  });
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
