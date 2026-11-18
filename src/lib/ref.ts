import { PORTAL } from "./portal-config";

/**
 * Agent referral tracking for the public site.
 *  - connectedtulum.com/ref/<name> (served by public/404.html) lands on /?ref=<name>
 *  - the code is remembered for 30 days (last link wins) so a visitor who comes back later still counts for that agent
 *  - WhatsApp messages get "Ref: <name>" added so Hector sees who sent them
 *  - visits and clicks on WhatsApp / ticket links are counted per agent (shown in the team portal)
 * Nothing personal is stored or sent: just the agent's code, what was clicked and which page.
 */
const KEY = "ct-ref";
const TTL = 30 * 86_400_000;
const CODE = /^[a-z0-9-]{2,30}$/;
const TICKET_HOSTS = ["tf.link", "ticketfairy.com", "eventbrite.com", "ra.co"];

type Stored = { code: string; at: number };

function read(): Stored | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as Stored | null;
    if (v && CODE.test(v.code) && Date.now() - v.at < TTL) return v;
  } catch { /* private mode or bad value */ }
  return null;
}
function write(v: Stored) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode */ } }

function track(code: string, kind: "visit" | "whatsapp" | "ticket") {
  if (!PORTAL.url || !PORTAL.anonKey) return;
  try {
    fetch(`${PORTAL.url}/rest/v1/rpc/track_ref`, {
      method: "POST",
      keepalive: true,
      headers: { apikey: PORTAL.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ p_code: code, p_kind: kind, p_path: location.pathname }),
    }).catch(() => {});
  } catch { /* tracking must never break the site */ }
}

export function initReferral() {
  if (typeof window === "undefined" || location.pathname.startsWith("/portal")) return;

  const url = new URL(location.href);
  const fromUrl = (url.searchParams.get("ref") || "").trim().toLowerCase();
  if (CODE.test(fromUrl)) {
    write({ code: fromUrl, at: Date.now() });
    track(fromUrl, "visit");
  }
  if (url.searchParams.has("ref")) {
    url.searchParams.delete("ref");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }

  document.addEventListener("click", (e) => {
    const ref = read();
    if (!ref) return;
    const a = (e.target as Element | null)?.closest?.("a");
    if (!a || !a.href) return;
    let h: URL;
    try { h = new URL(a.href); } catch { return; }
    const host = h.hostname.replace(/^www\./, "");
    if (host === "wa.me") {
      const text = h.searchParams.get("text") || "";
      if (!/\bRef: /.test(text)) {
        h.searchParams.set("text", `${text}${text ? "\n\n" : ""}Ref: ${ref.code}`);
        a.href = h.toString();
      }
      track(ref.code, "whatsapp");
    } else if (TICKET_HOSTS.some((t) => host === t || host.endsWith(`.${t}`))) {
      track(ref.code, "ticket");
    }
  }, true);
}
