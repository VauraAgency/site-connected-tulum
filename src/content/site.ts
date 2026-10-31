import { u } from "../lib/url";
/*
 * CONNECTED TULUM — SITE CONTENT
 * ------------------------------------------------------------------
 * Everything on the site is driven from this one file.
 * To add a villa, service, event or venue: copy an entry, edit, save, redeploy.
 * Fields marked "PENDING" are waiting on Hector.
 */

export const site = {
  name: "Connected Tulum",
  shortName: "connected",
  domain: "https://connectedtulum.com",
  tagline: "Tulum, connected. Villas, tables, festivals and everything in between.",
  email: "connectedtulum@gmail.com",
  // PENDING: confirm this is the WhatsApp number clients should message (digits only, with country code)
  whatsapp: "12032152254",
  whatsappDisplay: "+1 (203) 215-2254",
  // PENDING: Calendly / Google Calendar booking link (Google Meet from connectedtulum@gmail.com)
  calendlyUrl: "",
  // PENDING: filmmaker banner. Drop the file in /public/assets and set the path, e.g. "/assets/hero.mp4"
  heroVideo: "",
  // Optional: original Connected logo animation (Connected_Animaton.MP4). Drop it in /public/assets and set e.g. "/assets/logo-reveal.mp4"
  logoVideo: "",
  socials: {
    instagram: "https://www.instagram.com/connected_tulum",
    tiktok: "https://www.tiktok.com/@connected.tulum",
    facebook: "https://www.facebook.com/share/18M4RjEqWz/",
  },
  callHours: "Every day · Tulum time (EST, UTC−5)",
  // PENDING: Beach Please affiliate URL for villas (Hector gets a special code). Empty = villa buttons go to WhatsApp. Can be swapped any time.
  villaAffiliateUrl: "",
  villaPartner: "Beach Please",
  // PENDING: promoter / affiliate ticket links per festival. Empty = "Get tickets" opens a WhatsApp request instead.
  promoterUrls: { zamna: "", tehmplo: "", "day-zero": "", other: "" } as Record<string, string>,
  // Transport: client price = our cost + this markup (30%). Costs live on each transport item (cost field, USD).
  transportMarkup: 0.3,
};

export const withMarkup = (cost: number) => Math.round(cost * (1 + site.transportMarkup) / 5) * 5;

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waTemplate = (topic: string) =>
  `Hi Connected Tulum! I'm interested in: ${topic}\n\nName:\nTravel dates:\nGroup size:\nCelebrating anything?`;

/* ------------------------------------------------------------------ IMAGES */
export const img = {
  hero: u("/assets/hero-canopy.webp"),
  villaJungle: u("/assets/villa-jungle.webp"),
  villaModern: u("/assets/villa-modern.webp"),
  villaBeach: u("/assets/villa-beach.webp"),
  beachClub: u("/assets/beach-club.webp"),
  festival: u("/assets/festival.webp"),
  boat: u("/assets/boat.webp"),
  cenote: u("/assets/cenote.webp"),
  chef: u("/assets/chef.webp"),
  spa: u("/assets/spa.webp"),
  transport: u("/assets/transport.webp"),
  party: u("/assets/party.webp"),
};

/* ------------------------------------------------------------------ VILLAS
 * Hector: start with 1 villa, expand from there.
 * Replace the placeholder entries below with real villas (name, guests, photos, amenities).
 */
export type Villa = {
  slug: string;
  name: string;
  area: string;
  style: string;
  guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  hook: string;
  overview: string[];
  amenities: string[];
  images: string[];
  bookingUrl?: string; // optional outbound booking / affiliate link
  owned?: boolean; // true = Connected manages it directly
  placeholder?: boolean;
};

export const villas: Villa[] = [
  {
    slug: "signature-villa",
    name: "Signature Villa",
    area: "Tulum · Jungle",
    style: "Jungle retreat",
    guests: null,
    bedrooms: null,
    bathrooms: null,
    hook: "Our flagship stay. Details dropping soon.",
    overview: [
      "A private jungle home base for groups who want the whole of Tulum on call: tables, boats, chefs and festival nights, planned around the villa.",
      "Full photo gallery, capacity and amenities are being finalized. Message us for availability and the direct rate.",
    ],
    amenities: ["Private pool", "Chef on call", "In-villa wellness", "DJ setup on request", "24/7 concierge"],
    images: [img.villaJungle, img.party, img.chef],
    owned: true,
    placeholder: true,
  },
  {
    slug: "villa-two",
    name: "Villa Two",
    area: "Tulum · Aldea Zamá",
    style: "Modern",
    guests: null,
    bedrooms: null,
    bathrooms: null,
    hook: "Coming soon to the collection.",
    overview: ["Details, photos and capacity coming soon. Ask us for availability."],
    amenities: ["Rooftop", "Plunge pool", "Concierge"],
    images: [img.villaModern, img.spa],
    placeholder: true,
  },
  {
    slug: "villa-three",
    name: "Villa Three",
    area: "Tulum · Beach",
    style: "Beachfront",
    guests: null,
    bedrooms: null,
    bathrooms: null,
    hook: "Coming soon to the collection.",
    overview: ["Details, photos and capacity coming soon. Ask us for availability."],
    amenities: ["Beach access", "Concierge"],
    images: [img.villaBeach, img.boat],
    placeholder: true,
  },
];

/* ------------------------------------------------------------------ SERVICES
 * Each service gets its own page at /<slug>. Items = the cards on that page.
 */
export type ServiceItem = {
  name: string;
  meta?: string; // e.g. "Up to 15 guests"
  price?: string; // e.g. "From $38,000 MXN" (leave empty until Hector confirms)
  cost?: number; // our cost in USD. If set (and no price), client price = withMarkup(cost)
  badge?: string;
  link?: string; // optional affiliate / outbound link
};

export type Service = {
  slug: string;
  num: string;
  kicker: string;
  title: string;
  icon: IconName;
  short: string;
  cardCta: string;
  image: string;
  h1: string;
  intro: string;
  items: ServiceItem[];
  included: string[];
  notes: { label: string; text: string }[];
};

export type IconName =
  | "glass" | "crown" | "boat" | "compass" | "car" | "chef" | "leaf" | "disc"
  | "spark" | "camera" | "bag" | "calendar" | "home" | "ticket" | "moon" | "phone";

export const services: Service[] = [
  {
    slug: "tulum-festival-season", num: "01", kicker: "Access", title: "VIP Event Access", icon: "ticket",
    short: "Zamna, Tehmplo, Day Zero and every high season night. Tickets, VIP tables and the plan around them.",
    cardCta: "See the nights", image: img.festival,
    h1: "VIP Event Access", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "transportation", num: "02", kicker: "Transit", title: "Ground Transportation", icon: "car",
    short: "Airport pickups, private drivers, Sprinters and SUVs for the group and every night out.",
    cardCta: "Get moving", image: img.transport,
    h1: "Private Ground Transportation in Tulum",
    intro: "From the moment you land to the last ride home after the after party. Tell us your flights and headcount.",
    items: [
      // cost = what it costs Connected (USD). Price shown to clients = cost + site.transportMarkup. PENDING: Hector's costs.
      { name: "Airport transfer", meta: "Cancún / Tulum airport · Private" },
      { name: "Hourly driver", meta: "SUV or Sprinter · Nights out and day trips" },
      { name: "Event night rides", meta: "Round trip to Zamna, Tehmplo, Day Zero" },
    ],
    included: ["Bilingual drivers", "Meet & greet", "Water on board"],
    notes: [{ label: "Pricing", text: "Quoted per route and vehicle." }],
  },
  {
    slug: "private-events", num: "03", kicker: "Produce", title: "Private Events", icon: "spark",
    short: "Birthdays, proposals, brand dinners and buyouts. Logistics, execution and coordination.",
    cardCta: "Plan an event", image: img.party,
    h1: "Private Events in Tulum",
    intro: "We source the venue, the vendors and the timeline, then run it on the day.",
    items: [
      { name: "Celebrations & decor", meta: "Birthdays, proposals, anniversaries" },
      { name: "Corporate & brand events", meta: "Dinners, launches, offsites" },
      { name: "Venue buyouts", meta: "On request" },
    ],
    included: ["Planning", "Vendor management", "On-site coordination"],
    notes: [],
  },
  {
    slug: "tulum-group-beach-clubs", num: "04", kicker: "Reservations", title: "Restaurants & Beach Clubs", icon: "crown",
    short: "Priority tables at Tulum's beach clubs and restaurants. Skip the guesswork, skip the line.",
    cardCta: "Reserve a table", image: img.beachClub,
    h1: "Restaurants & Beach Clubs", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "boats", num: "05", kicker: "Sea", title: "Yachts & Catamarans", icon: "boat",
    short: "Private catamarans and yachts on the Caribbean. Open water, open bar, your crew only.",
    cardCta: "See the fleet", image: img.boat,
    h1: "Tulum Yacht & Catamaran Charters",
    intro: "Tell us the group size and the vibe. We match you with the right boat and handle the dock, the bar and the timing.",
    items: [
      // PENDING: Hector to send fleet (name, length, capacity, price, link)
      { name: "Sail Catamaran", meta: "Sail catamaran · Group size on request", badge: "Popular" },
      { name: "Motor Yacht", meta: "Motor yacht · Group size on request", badge: "Signature" },
    ],
    included: ["Captain & crew", "Drinks", "Snorkel gear", "Sound system"],
    notes: [
      { label: "Pricing", text: "Rates depend on vessel, group size and season. We quote direct." },
      { label: "Duration", text: "Half day and full day charters available." },
    ],
  },
];

export const serviceBySlug = (s: string) => services.find((x) => x.slug === s && x.items.length);

/* ------------------------------------------------------------------ EVENTS (High Season 2027)
 * Per event: flyer (image path in /public/assets), ticketUrl (promoter / affiliate link), lineup, time.
 * "Get tickets" -> ticketUrl, else the festival's link in site.promoterUrls, else a WhatsApp request.
 * manual: true = Hector processes the tickets by hand (Zamna), so Get tickets is always a WhatsApp request.
 * key: true = headline night, shown in the big season scroller on the home page.
 */
export type TEvent = {
  date: string; // ISO yyyy-mm-dd
  title: string;
  venue: string;
  lineup?: string;
  time?: string;
  flyer?: string;
  ticketUrl?: string;
  festival?: "zamna" | "tehmplo" | "day-zero";
  tbd?: boolean;
  key?: boolean;
  manual?: boolean;
  bg?: string;
};

export const events: TEvent[] = [
  { date: "2026-12-31", title: "Renaissance Tulum NYE", venue: "Zamna Tulum", lineup: "Sasha, Maceo Plex, Sébastien Léger, Ida Engberg and more", festival: "zamna", key: true, manual: true, bg: img.festival },
  { date: "2026-12-31", title: "NYE @ Ahau", venue: "Ahau" },
  { date: "2026-12-31", title: "NYE @ Papaya Playa Project", venue: "Papaya Playa Project" },
  { date: "2026-12-31", title: "NYE @ Nomade", venue: "Nomade" },
  { date: "2026-12-31", title: "NYE @ Gitano Beach & Jungle", venue: "Gitano" },
  { date: "2027-01-01", title: "Por Qué No", venue: "Kuul" },
  { date: "2027-01-02", title: "Por Qué No", venue: "Vesica" },
  { date: "2027-01-02", title: "Afrodise", venue: "Ahau" },
  { date: "2027-01-02", title: "Lineup TBA", venue: "Zamna Tulum", festival: "zamna", tbd: true, manual: true },
  { date: "2027-01-03", title: "Por Qué No", venue: "Vesica" },
  { date: "2027-01-03", title: "Tehmplo", venue: "Tehmplo", festival: "tehmplo" },
  { date: "2027-01-04", title: "Anyma presents ÆDEN: The Lost Temple", venue: "Zamna Tulum", lineup: "Anyma, CamelPhat, Cassian, Volkoder and more", festival: "zamna", key: true, manual: true, bg: img.party },
  { date: "2027-01-05", title: "7 Realms", venue: "Kuul" },
  { date: "2027-01-05", title: "Tehmplo", venue: "Tehmplo", festival: "tehmplo" },
  { date: "2027-01-06", title: "Black Coffee at Zamna Tulum", venue: "Zamna Tulum", lineup: "Black Coffee", festival: "zamna", key: true, manual: true, bg: img.festival },
  { date: "2027-01-07", title: "Solomun Tulum at Tehmplo", venue: "Tehmplo", lineup: "Solomun", festival: "tehmplo", key: true, bg: img.cenote },
  { date: "2027-01-08", title: "Adriatique presents X: FOREVER", venue: "Zamna Tulum", lineup: "Adriatique, Kotiër, Mind Against, Sama and more", festival: "zamna", key: true, manual: true, bg: img.party },
  { date: "2027-01-09", title: "Day Zero 2027: Begin Again", venue: "Day Zero", festival: "day-zero", key: true, bg: img.cenote },
  { date: "2027-01-10", title: "Adam Port, season closing", venue: "Zamna Tulum", lineup: "Adam Port", festival: "zamna", key: true, manual: true, bg: img.festival },
];

/** Where "Get tickets" goes. Returns null when it should be a WhatsApp request (manual or no link yet). */
export function ticketHref(e: TEvent): string | null {
  if (e.manual && !e.ticketUrl) return null;
  const url = e.ticketUrl || (e.festival ? site.promoterUrls[e.festival] : site.promoterUrls.other);
  return url || null;
}

export const marquee = ["Renaissance", "Anyma", "Black Coffee", "Solomun", "Adriatique", "Day Zero", "Adam Port", "Zamna", "Tehmplo"];

export function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit", timeZone: "UTC" }),
    mon: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase(),
    wk: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    long: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }),
  };
}

/* ------------------------------------------------------------------ VENUES */
export type Venue = { name: string; tag: string; image: string; points: string[]; page?: string; link?: string };

export const venues: Venue[] = [
  { name: "Zamna", tag: "Festival", image: img.festival, page: "/zamna-tulum", points: ["Open-air jungle festival", "High season headliners", "VIP tables & tickets"] },
  { name: "Tehmplo", tag: "Festival", image: img.festival, page: "/tehmplo-tulum", points: ["Jungle temple stage", "Marquee nights", "VIP tables & tickets"] },
  { name: "Day Zero", tag: "Festival", image: img.festival, page: "/day-zero-tulum", points: ["Mystical jungle festival", "One night only", "Tickets & transport"] },
  { name: "Papaya Playa Project", tag: "Beach club", image: img.beachClub, points: ["Beach parties", "NYE", "Tables"] },
  { name: "Gitano Beach", tag: "Beach club", image: img.beachClub, points: ["Beach & jungle", "Day to night", "Tables"] },
  { name: "Vagalume", tag: "Beach club", image: img.beachClub, points: ["Sunset sessions", "Beach beds", "Tables"] },
  { name: "Mia Beach Club", tag: "Beach club", image: img.villaBeach, points: ["Beach day", "Food & drinks", "Beds"] },
  { name: "Ahau", tag: "Beach club", image: img.beachClub, points: ["Beach parties", "NYE", "Tables"] },
  { name: "Nomade", tag: "Beach", image: img.villaBeach, points: ["Beachfront", "NYE", "Reservations"] },
  { name: "Vesica", tag: "Day club", image: img.cenote, points: ["Cenote setting", "Por Qué No", "Tables"] },
  { name: "Kuul", tag: "Late night", image: img.party, points: ["Night parties", "High season events", "Tables"] },
];

/* ------------------------------------------------------------------ TEAM / REVIEWS
 * Reviews section hides itself until real reviews are added here.
 */
export const team = [
  { name: "Hector Lizarraga", role: "Connected Tulum", note: "Your point of contact for villas, tables and every night of high season." },
];

export const reviews: { quote: string; name: string; source?: string }[] = [];

export const faqs = [
  { q: "How far in advance should we book?", a: "As early as you can. High season (late December into January) is when Zamna, Tehmplo, Day Zero and the beach clubs sell out first." },
  { q: "How do I get tickets?", a: "Tap Get tickets on any night. Where there is a ticket link it takes you straight there. Zamna tickets are handled by us directly: send the request and we confirm on WhatsApp." },
  { q: "Can I get a VIP table?", a: "Yes. Tap Inquire about a table on the night you want, tell us the group size, and we check availability and send options." },
  { q: "What else can Connected handle?", a: "Ground transportation, private events, restaurant and beach club reservations, and yachts. Villas run through our partner Beach Please." },
  { q: "How do we start?", a: "Pick a night and message us on WhatsApp, or book a quick call. We reply with ticket links, table options and a plan." },
];

/* ------------------------------------------------------------------ PAGES (festival + landing)
 */
export type FestivalPage = {
  kind: "festival";
  slug: string;
  festival?: TEvent["festival"];
  eyebrow: string;
  h1a: string;
  h1b: string;
  lead: string;
  facts: { k: string; v: string }[];
  guide: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
  image: string;
  title: string;
  description: string;
};

export type LandingPage = {
  kind: "landing";
  slug: string;
  eyebrow: string;
  h1a: string;
  h1b: string;
  lead: string;
  image: string;
  problem: { h: string; p: string };
  stats: { k: string; v: string }[];
  plan: { label: string; h: string; points: string[]; image: string }[];
  tiles: { h: string; p: string }[];
  faqs: { q: string; a: string }[];
  ctaLabel: string;
  title: string;
  description: string;
};

const howToBook = [
  { t: "Pick the night", d: "Choose from the calendar or the flyers." },
  { t: "Tickets or a table", d: "Tap Get tickets, or inquire about a table with your group size." },
  { t: "Lock it in", d: "Ticket link or table confirmation sent back to you." },
  { t: "Arrive", d: "Transport and timing handled. You just show up." },
];
export const steps = howToBook;

export const festivalPages: FestivalPage[] = [
  {
    kind: "festival", slug: "tulum-festival-season", eyebrow: "Connected Tulum presents · High Season 2027",
    h1a: "High Season.", h1b: "Every night that matters.",
    lead: "NYE through Day Zero: the parties, the festivals and the tables, all in one calendar. Tickets where there's a link, tables through us where there isn't.",
    facts: [{ k: "Season", v: "Dec 31 to Jan 10" }, { k: "Setting", v: "Jungle & beach" }, { k: "Format", v: "Festivals, beach clubs, villa parties" }, { k: "Access", v: "Tickets & VIP tables" }],
    guide: [
      { t: "Book early", d: "Zamna, Tehmplo and Day Zero tickets move fast once lineups drop." },
      { t: "Tables", d: "VIP tables are limited per night. Reserve with dates and headcount." },
      { t: "Transport", d: "Festival nights mean traffic. Let us handle drivers both ways." },
      { t: "Reservations", d: "Dinner and beach club tables around the big nights book out. Ask early." },
    ],
    faqs: [
      { q: "Are all dates confirmed?", a: "Dates marked TBA are still being announced. This calendar updates as lineups drop." },
      { q: "Do you sell tickets?", a: "Where there is an official ticket link we send you to it. For tables and VIP, we book directly with you on WhatsApp." },
    ],
    image: img.festival,
    title: "Tulum High Season 2027: NYE, Zamna, Tehmplo, Day Zero | Connected Tulum",
    description: "The Tulum High Season 2027 calendar. NYE parties, Zamna, Tehmplo, Day Zero, tickets and VIP tables in one place.",
  },
  {
    kind: "festival", slug: "nye-2027", eyebrow: "Connected Tulum · New Year's Eve",
    h1a: "NYE in Tulum.", h1b: "Pick your countdown.",
    lead: "Beach club, jungle festival or a private villa party. Every NYE option in Tulum, with tables and tickets handled.",
    facts: [{ k: "Date", v: "Dec 31" }, { k: "Options", v: "Ahau, PPP, Nomade, Gitano, Zamna" }, { k: "Format", v: "Parties & festivals" }, { k: "Access", v: "Tickets & VIP tables" }],
    guide: howToBook, faqs: [{ q: "Which NYE party is best?", a: "Depends on the group and the sound. Tell us the vibe and we'll match you." }],
    image: img.beachClub,
    title: "Tulum NYE 2027 Parties & Tables | Connected Tulum",
    description: "Every New Year's Eve party in Tulum: Ahau, Papaya Playa Project, Nomade, Gitano and Zamna. Tickets and VIP tables.",
  },
  {
    kind: "festival", slug: "zamna-tulum", festival: "zamna", eyebrow: "Connected Tulum presents · Zamna 2027",
    h1a: "Zamna.", h1b: "Monumental jungle.",
    lead: "The jungle festival that defines Tulum's high season. Pick the night, we handle the table, the tickets and the ride.",
    facts: [{ k: "Season", v: "High season 2027" }, { k: "Setting", v: "Open-air jungle" }, { k: "Format", v: "Night by night" }, { k: "Access", v: "Tickets & VIP" }],
    guide: howToBook,
    faqs: [{ q: "Can you get VIP tables at Zamna?", a: "Message us with the night and group size and we check availability." }],
    image: img.festival,
    title: "Zamna Tulum 2027: Tickets & VIP Tables | Connected Tulum",
    description: "Zamna Tulum high season 2027 nights: Anyma, Adriatique, Adam Port and more. Tickets and VIP tables with Connected Tulum.",
  },
  {
    kind: "festival", slug: "tehmplo-tulum", festival: "tehmplo", eyebrow: "Connected Tulum presents · Tehmplo 2027",
    h1a: "Tehmplo.", h1b: "The temple in the trees.",
    lead: "Solomun and the Tehmplo nights of high season. Get the table, get there, get home.",
    facts: [{ k: "Season", v: "High season 2027" }, { k: "Setting", v: "Jungle" }, { k: "Format", v: "Marquee nights" }, { k: "Access", v: "Tickets & VIP" }],
    guide: howToBook, faqs: [{ q: "Is Solomun confirmed?", a: "Solomun @ Tehmplo is on our calendar for Jan 7. Check back for ticket links." }],
    image: img.festival,
    title: "Tehmplo Tulum 2027: Solomun, Tickets & Tables | Connected Tulum",
    description: "Tehmplo Tulum high season 2027 including Solomun. Tickets and VIP tables with Connected Tulum.",
  },
  {
    kind: "festival", slug: "day-zero-tulum", festival: "day-zero", eyebrow: "Connected Tulum presents · Day Zero 2027",
    h1a: "Day Zero.", h1b: "One night. No repeats.",
    lead: "The mystical jungle festival that closes the season. Tickets, transport and the plan for the night.",
    facts: [{ k: "Date", v: "Jan 9" }, { k: "Setting", v: "Jungle" }, { k: "Format", v: "One night festival" }, { k: "Access", v: "Tickets & transport" }],
    guide: howToBook, faqs: [{ q: "How do we get there?", a: "We book private drivers for the group both ways." }],
    image: img.festival,
    title: "Day Zero Tulum 2027: Tickets & Transport | Connected Tulum",
    description: "Day Zero Tulum 2027. Tickets, transport and the full night planned with Connected Tulum.",
  },
];

const handledTiles = [
  { h: "Nightlife", p: "Tables at the clubs and festivals that say they're full." },
  { h: "Transport", p: "Drivers from landing to last call." },
  { h: "Dinner", p: "Restaurant tables for the whole group, timed around the night." },
  { h: "Beach days", p: "Beds and tables at Tulum's best beach clubs." },
  { h: "Events", p: "Private events and yachts when you want something custom." },
];

export const landingPages: LandingPage[] = [
  {
    kind: "landing", slug: "tulum-group-beach-clubs", eyebrow: "Tulum · Restaurants & Beach Clubs · Group tables",
    h1a: "Beds on the sand.", h1b: "Tables booked before you land.",
    lead: "Papaya Playa, Gitano, Vagalume, Mia, Ahau and the restaurants that fill up first. Group reservations and VIP tables.",
    image: img.beachClub,
    problem: { h: "Walk-ins get turned away in high season.", p: "We reserve ahead so the group stays together." },
    stats: [{ k: "Venues", v: "10+" }, { k: "Group", v: "Any size" }, { k: "Booking", v: "Direct" }, { k: "Support", v: "24/7" }],
    plan: [
      { label: "Day", h: "Beach club day.", points: ["Beds & umbrellas", "Lunch", "Sunset set"], image: img.beachClub },
      { label: "Night", h: "Dinner into the night.", points: ["Restaurant table", "VIP table", "Ride home"], image: img.festival },
    ],
    tiles: handledTiles, faqs: [], ctaLabel: "Reserve a table",
    title: "Tulum Restaurant & Beach Club Reservations | Connected Tulum",
    description: "Group reservations and VIP tables at Tulum beach clubs and restaurants: Papaya Playa, Gitano, Vagalume, Mia, Ahau.",
  },
];

export const footerPlan = [
  { label: "High Season 2027", to: "/tulum-festival-season" },
  { label: "NYE 2027", to: "/nye-2027" },
  { label: "Zamna Tulum", to: "/zamna-tulum" },
  { label: "Tehmplo Tulum", to: "/tehmplo-tulum" },
  { label: "Day Zero", to: "/day-zero-tulum" },
];

export const footerExplore = [
  { label: "Villas", to: "/villas" },
  { label: "Ground Transportation", to: "/transportation" },
  { label: "Private Events", to: "/private-events" },
  { label: "Restaurants & Beach Clubs", to: "/tulum-group-beach-clubs" },
  { label: "Yachts & Catamarans", to: "/boats" },
];
