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
};

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waTemplate = (topic: string) =>
  `Hi Connected Tulum! I'm interested in: ${topic}\n\nName:\nTravel dates:\nGroup size:\nCelebrating anything?`;

/* ------------------------------------------------------------------ IMAGES */
export const img = {
  hero: "/assets/hero-canopy.webp",
  villaJungle: "/assets/villa-jungle.webp",
  villaModern: "/assets/villa-modern.webp",
  villaBeach: "/assets/villa-beach.webp",
  beachClub: "/assets/beach-club.webp",
  festival: "/assets/festival.webp",
  boat: "/assets/boat.webp",
  cenote: "/assets/cenote.webp",
  chef: "/assets/chef.webp",
  spa: "/assets/spa.webp",
  transport: "/assets/transport.webp",
  party: "/assets/party.webp",
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
    slug: "tulum-bachelor-party", num: "01", kicker: "Celebrate", title: "Bachelor & Bachelorette", icon: "glass",
    short: "One villa, every table and nothing left to the group chat. The whole weekend, planned end to end.",
    cardCta: "Plan the weekend", image: img.party,
    h1: "Bachelor & Bachelorette", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "tulum-group-beach-clubs", num: "02", kicker: "Reservations", title: "VIP Reservations", icon: "crown",
    short: "Priority tables at Tulum's beach clubs, restaurants and late-night spots. Skip the guesswork, skip the line.",
    cardCta: "See venues", image: img.beachClub,
    h1: "VIP Reservations", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "boats", num: "03", kicker: "Sea", title: "Yachts & Catamarans", icon: "boat",
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
  {
    slug: "tulum-festival-season", num: "04", kicker: "Access", title: "VIP Event Access", icon: "ticket",
    short: "Zamna, Tehmplo, Day Zero and every high season night. Tickets, tables and the plan around them.",
    cardCta: "High season 2027", image: img.festival,
    h1: "VIP Event Access", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "transportation", num: "05", kicker: "Transit", title: "Ground & Air Transport", icon: "car",
    short: "Airport pickups, private drivers, Sprinters and SUVs for the group. Air transfers on request.",
    cardCta: "Get moving", image: img.transport,
    h1: "Private Transportation in Tulum",
    intro: "From the moment you land to the last ride home after the after party. Tell us your flights and headcount.",
    items: [
      { name: "Airport transfer", meta: "Cancún / Tulum airport · Private" },
      { name: "Hourly driver", meta: "SUV or Sprinter · Nights out and day trips" },
      { name: "Air transfer", meta: "Private flights · On request" },
    ],
    included: ["Bilingual drivers", "Meet & greet", "Water on board"],
    notes: [{ label: "Pricing", text: "Quoted per route and vehicle." }],
  },
  {
    slug: "chef", num: "06", kicker: "Table", title: "Private Chef & Bartender", icon: "chef",
    short: "In-villa breakfasts, dinners and open bar. Tasting menus, family style, recovery brunch.",
    cardCta: "See menus", image: img.chef,
    h1: "Private Chef & Bartender in Tulum",
    intro: "A chef and bartender in your villa so the group never has to pick a restaurant at 1am.",
    items: [
      { name: "Breakfast & brunch", meta: "Daily in-villa service" },
      { name: "Private dinner", meta: "Family style or tasting menu" },
      { name: "Open bar", meta: "Bartender and full bar setup" },
    ],
    included: ["Shopping", "Setup", "Service", "Cleanup"],
    notes: [{ label: "Pricing", text: "Per person, quoted on your menu." }],
  },
  {
    slug: "wellness", num: "07", kicker: "Energy", title: "Spa & Wellness", icon: "leaf",
    short: "In-villa massages, yoga, facials, ice baths and IV drips. Reset between nights.",
    cardCta: "Wellness menu", image: img.spa,
    h1: "Spa & Wellness in Tulum",
    intro: "Recovery that comes to you. Book for one or for the whole group.",
    items: [
      { name: "Massage", meta: "In-villa · Individual or group" },
      { name: "Yoga & breathwork", meta: "Private sessions" },
      { name: "IV therapy", meta: "Hydration and recovery drips" },
      { name: "Ice bath & sauna", meta: "On request" },
    ],
    included: ["Licensed therapists", "All equipment brought to you"],
    notes: [],
  },
  {
    slug: "dj", num: "08", kicker: "Night", title: "DJ Services", icon: "disc",
    short: "Turn the villa into a club. DJs, decks, speakers and lights, set up and run for you.",
    cardCta: "Book a DJ", image: img.party,
    h1: "DJ Services & Equipment in Tulum",
    intro: "From sunset sets by the pool to a full club night in the villa.",
    items: [
      { name: "DJ set", meta: "House, afro house, open format" },
      { name: "Equipment package", meta: "Decks, speakers, lights" },
    ],
    included: ["Setup", "Sound check", "Breakdown"],
    notes: [],
  },
  {
    slug: "content-creation", num: "09", kicker: "Capture", title: "Photo & Video", icon: "camera",
    short: "Photographers and videographers for the trip, the party or the proposal. Content that hits.",
    cardCta: "Book a shoot", image: img.festival,
    h1: "Photography & Videography in Tulum",
    intro: "Professional content of your trip, delivered fast. Drone, reels and edits available.",
    items: [
      { name: "Photography", meta: "Hourly or full day" },
      { name: "Videography & reels", meta: "Edited for social" },
      { name: "Drone", meta: "Aerials of villa, beach and boat" },
    ],
    included: ["Edited delivery", "Social ready formats"],
    notes: [],
  },
  {
    slug: "private-events", num: "10", kicker: "Produce", title: "Private Events", icon: "spark",
    short: "Birthdays, proposals, brand dinners and buyouts. Logistics, execution and coordination.",
    cardCta: "Plan an event", image: img.beachClub,
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
    slug: "adventure", num: "11", kicker: "Adventure", title: "Adventure & Cenotes", icon: "compass",
    short: "Cenotes, ruins, ATVs and ziplines. Private tours with transport handled.",
    cardCta: "Tour options", image: img.cenote,
    h1: "Tulum Adventures & Cenote Tours",
    intro: "Daytime Tulum, done privately. Pick a mood and we build the day.",
    items: [
      { name: "Cenote tour", meta: "Private · Transport included" },
      { name: "Tulum ruins", meta: "Guided" },
      { name: "ATVs & ziplines", meta: "Half day" },
    ],
    included: ["Private guide", "Transport"],
    notes: [],
  },
  {
    slug: "personal-shopper", num: "12", kicker: "Style", title: "Personal Shopper", icon: "bag",
    short: "Outfits for every night, sourced and delivered. Festival looks, white parties, dinner fits.",
    cardCta: "Get styled", image: img.villaModern,
    h1: "Personal Shopper in Tulum",
    intro: "Show up with nothing to plan. We source looks and essentials and deliver them to the villa.",
    items: [
      { name: "Festival & party looks", meta: "Curated for the lineup" },
      { name: "Essentials delivery", meta: "Groceries, supplies, gifts" },
    ],
    included: ["Sourcing", "Delivery to the villa"],
    notes: [],
  },
];

export const serviceBySlug = (s: string) => services.find((x) => x.slug === s && x.items.length);

/* ------------------------------------------------------------------ EVENTS (High Season 2027)
 * Add flyer (image path), time, DJ lineup, and ticketUrl (promoter / affiliate link).
 * No ticketUrl = button goes to WhatsApp to book tables.
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
};

export const events: TEvent[] = [
  { date: "2026-12-31", title: "NYE", venue: "Tulum" },
  { date: "2026-12-31", title: "NYE @ Ahau", venue: "Ahau" },
  { date: "2026-12-31", title: "NYE @ PPP", venue: "Papaya Playa Project" },
  { date: "2026-12-31", title: "NYE @ Nomade", venue: "Nomade" },
  { date: "2026-12-31", title: "NYE @ Gitano Beach & Jungle", venue: "Gitano" },
  { date: "2026-12-31", title: "Renaissance", venue: "Zamna", festival: "zamna" },
  { date: "2027-01-01", title: "Por Qué No", venue: "Kuul" },
  { date: "2027-01-02", title: "Por Qué No", venue: "Vesica" },
  { date: "2027-01-02", title: "Afrodise", venue: "Ahau" },
  { date: "2027-01-02", title: "TBA", venue: "Zamna", festival: "zamna", tbd: true },
  { date: "2027-01-03", title: "Por Qué No", venue: "Vesica" },
  { date: "2027-01-03", title: "Tehmplo", venue: "Tehmplo", festival: "tehmplo" },
  { date: "2027-01-04", title: "Anyma", venue: "Zamna", lineup: "Anyma", festival: "zamna" },
  { date: "2027-01-05", title: "7 Realms", venue: "Kuul" },
  { date: "2027-01-05", title: "Tehmplo", venue: "Tehmplo", festival: "tehmplo" },
  { date: "2027-01-06", title: "TBA", venue: "Zamna", festival: "zamna", tbd: true },
  { date: "2027-01-07", title: "Solomun", venue: "Tehmplo", lineup: "Solomun", festival: "tehmplo" },
  { date: "2027-01-08", title: "Adriatique", venue: "Zamna", lineup: "Adriatique", festival: "zamna" },
  { date: "2027-01-09", title: "Day Zero", venue: "Day Zero", festival: "day-zero" },
  { date: "2027-01-10", title: "Adam Port", venue: "Zamna", lineup: "Adam Port", festival: "zamna" },
];

export const marquee = ["Anyma", "Solomun", "Adriatique", "Adam Port", "Day Zero", "Zamna", "Tehmplo", "Afrodise", "7 Realms", "Por Qué No", "Renaissance"];

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
  { q: "How far in advance should we book?", a: "As early as you can. High season (late December into January) is when Zamna, Tehmplo, Day Zero and the beach clubs sell out first, and the best villas go with them." },
  { q: "What can Connected handle?", a: "The whole trip: villa, transport, tables, festival access, boats, chefs, wellness, DJs, content and private events. One contact for all of it." },
  { q: "How big can our group be?", a: "Couples to large groups. Tell us the headcount and we build around it." },
  { q: "Can you just get us tickets or a table?", a: "Yes. If there is a ticket link for the night we send you straight to it. If not, message us on WhatsApp and we reserve the table." },
  { q: "How do we start?", a: "Send your dates and group size on WhatsApp, or book a quick call. We send back a custom plan." },
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
  { t: "Pick the night", d: "Choose from the calendar or tell us the vibe." },
  { t: "Send the details", d: "Dates, group size and budget on WhatsApp." },
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
      { t: "Recovery", d: "Book the IV drips and massages before you need them." },
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
  { h: "Food", p: "Private chef in the villa, tables everywhere else." },
  { h: "Recovery", p: "Massages, IV drips and pool days." },
  { h: "At home", p: "DJ, decor and the villa turned club." },
];

export const landingPages: LandingPage[] = [
  {
    kind: "landing", slug: "tulum-concierge", eyebrow: "Tulum · 24/7 VIP Concierge",
    h1a: "Your Tulum concierge.", h1b: "On call, all trip.",
    lead: "Villas, transport, VIP tables, festivals, boats, chefs and wellness. One number, every answer.",
    image: img.villaJungle,
    problem: { h: "Ten tabs, five WhatsApp groups. Not this time.", p: "Tulum rewards people who know who to call. That's us." },
    stats: [{ k: "Support", v: "24/7" }, { k: "Services", v: "12+" }, { k: "Contact", v: "1" }, { k: "Season", v: "All year" }],
    plan: [
      { label: "Arrive", h: "Land and go.", points: ["Airport pickup", "Villa check-in", "Groceries stocked"], image: img.transport },
      { label: "Day", h: "Sun, sea, cenotes.", points: ["Beach club beds", "Boat day", "Cenote tour"], image: img.boat },
      { label: "Night", h: "Tables that matter.", points: ["Dinner reservation", "VIP table", "Ride home"], image: img.festival },
    ],
    tiles: handledTiles, faqs: [], ctaLabel: "Start with your dates",
    title: "Tulum VIP Concierge 24/7 | Connected Tulum",
    description: "24/7 VIP concierge in Tulum. Villas, transport, tables, festivals, yachts, chefs and wellness with one contact.",
  },
  {
    kind: "landing", slug: "tulum-bachelor-party", eyebrow: "Tulum · Bachelor Party · Fully handled",
    h1a: "The groom shows up.", h1b: "We handle the rest.",
    lead: "Villa, tables, boat day, chef, DJ and drivers. A Tulum bachelor weekend with no dead time.",
    image: img.party,
    problem: { h: "Most bachelor trips stall in the group chat.", p: "Not this one. Send dates and headcount and we build the weekend." },
    stats: [{ k: "Days", v: "3 to 5" }, { k: "Group", v: "Any size" }, { k: "Team", v: "Local" }, { k: "Support", v: "24/7" }],
    plan: [
      { label: "Day 1", h: "Arrive and set the tone.", points: ["Airport pickup", "Villa welcome", "Chef dinner"], image: img.chef },
      { label: "Day 2", h: "Boat day into club night.", points: ["Catamaran", "Beach club", "VIP table"], image: img.boat },
      { label: "Day 3", h: "Festival night.", points: ["Recovery brunch", "Pool & DJ", "Zamna or Tehmplo"], image: img.festival },
    ],
    tiles: handledTiles,
    faqs: [{ q: "Can you plan around a festival night?", a: "Yes, most high season trips are built around one or two headliner nights." }],
    ctaLabel: "Plan the weekend",
    title: "Tulum Bachelor Party Planning | Connected Tulum",
    description: "Tulum bachelor party, fully planned. Villa, VIP tables, boat day, chef, DJ and transport.",
  },
  {
    kind: "landing", slug: "tulum-bachelorette-party", eyebrow: "Tulum · Bachelorette · Fully handled",
    h1a: "She says yes.", h1b: "Tulum says welcome.",
    lead: "Villa, beach clubs, boat day, spa, photographer and the best tables in town. The bachelorette, planned end to end.",
    image: img.villaBeach,
    problem: { h: "Planning shouldn't be the maid of honor's full-time job.", p: "Hand it to us. You get the itinerary, the bookings and the content." },
    stats: [{ k: "Days", v: "3 to 5" }, { k: "Group", v: "Any size" }, { k: "Team", v: "Local" }, { k: "Support", v: "24/7" }],
    plan: [
      { label: "Day 1", h: "Welcome to the villa.", points: ["Decor & balloons", "Chef dinner", "Sunset photos"], image: img.chef },
      { label: "Day 2", h: "Sea and spa.", points: ["Catamaran", "In-villa massages", "Beach club"], image: img.spa },
      { label: "Day 3", h: "The big night.", points: ["Getting ready", "VIP table", "Content team"], image: img.beachClub },
    ],
    tiles: handledTiles, faqs: [], ctaLabel: "Plan the trip",
    title: "Tulum Bachelorette Party Planning | Connected Tulum",
    description: "Tulum bachelorette trips, fully planned. Villa, beach clubs, boat, spa, photographer and VIP tables.",
  },
  {
    kind: "landing", slug: "tulum-group-beach-clubs", eyebrow: "Tulum · Beach Clubs · Group tables",
    h1a: "Beds on the sand.", h1b: "Booked before you land.",
    lead: "Papaya Playa, Gitano, Vagalume, Mia, Ahau and more. Group reservations and VIP tables.",
    image: img.beachClub,
    problem: { h: "Walk-ins get turned away in high season.", p: "We reserve ahead so the group stays together." },
    stats: [{ k: "Venues", v: "10+" }, { k: "Group", v: "Any size" }, { k: "Booking", v: "Direct" }, { k: "Support", v: "24/7" }],
    plan: [
      { label: "Day", h: "Beach club day.", points: ["Beds & umbrellas", "Lunch", "Sunset set"], image: img.beachClub },
      { label: "Night", h: "Into the night.", points: ["Dinner", "VIP table", "Ride home"], image: img.festival },
    ],
    tiles: handledTiles, faqs: [], ctaLabel: "Reserve the beds",
    title: "Tulum Beach Club Reservations for Groups | Connected Tulum",
    description: "Group reservations and VIP tables at Tulum beach clubs: Papaya Playa, Gitano, Vagalume, Mia, Ahau.",
  },
  {
    kind: "landing", slug: "tulum-group-restaurant-reservations", eyebrow: "Tulum · Restaurants · Group tables",
    h1a: "Dinner for twelve.", h1b: "At 9pm. Tonight.",
    lead: "Group reservations at Tulum's best restaurants, timed around the night out.",
    image: img.chef,
    problem: { h: "Big groups are the hardest table in Tulum.", p: "We know who can seat you and when." },
    stats: [{ k: "Group", v: "Any size" }, { k: "Booking", v: "Direct" }, { k: "Timing", v: "Planned" }, { k: "Support", v: "24/7" }],
    plan: [{ label: "Night", h: "Dinner into the party.", points: ["Reservation", "Transport", "Table after"], image: img.chef }],
    tiles: handledTiles, faqs: [], ctaLabel: "Book the dinner",
    title: "Tulum Group Restaurant Reservations | Connected Tulum",
    description: "Group restaurant reservations in Tulum, timed around your night out.",
  },
  {
    kind: "landing", slug: "tulum-bachelorette-nightlife", eyebrow: "Tulum · Nightlife · VIP",
    h1a: "Tables at the places", h1b: "that say they're full.",
    lead: "Tulum after dark: festivals, beach parties and late-night spots with VIP tables held for you.",
    image: img.festival,
    problem: { h: "The best nights don't take walk-ins.", p: "We hold the table, you bring the energy." },
    stats: [{ k: "Venues", v: "10+" }, { k: "Season", v: "High" }, { k: "Booking", v: "Direct" }, { k: "Support", v: "24/7" }],
    plan: [{ label: "Night", h: "The full night.", points: ["Pre-party at the villa", "VIP table", "Driver home"], image: img.party }],
    tiles: handledTiles, faqs: [], ctaLabel: "Get the table",
    title: "Tulum Nightlife & VIP Tables | Connected Tulum",
    description: "Tulum nightlife, VIP tables and festival access for groups and bachelorettes.",
  },
];

export const footerPlan = [
  { label: "Tulum Concierge", to: "/tulum-concierge" },
  { label: "High Season 2027", to: "/tulum-festival-season" },
  { label: "NYE 2027", to: "/nye-2027" },
  { label: "Bachelor Party", to: "/tulum-bachelor-party" },
  { label: "Bachelorette Trips", to: "/tulum-bachelorette-party" },
  { label: "Beach Clubs", to: "/tulum-group-beach-clubs" },
  { label: "Restaurant Reservations", to: "/tulum-group-restaurant-reservations" },
  { label: "Nightlife", to: "/tulum-bachelorette-nightlife" },
];

export const footerExplore = [
  { label: "Villas", to: "/villas" },
  { label: "Yachts & Catamarans", to: "/boats" },
  { label: "Zamna Tulum", to: "/zamna-tulum" },
  { label: "Tehmplo Tulum", to: "/tehmplo-tulum" },
  { label: "Day Zero", to: "/day-zero-tulum" },
  { label: "Transportation", to: "/transportation" },
  { label: "Private Chef", to: "/chef" },
  { label: "Spa & Wellness", to: "/wellness" },
  { label: "DJ Services", to: "/dj" },
  { label: "Photo & Video", to: "/content-creation" },
  { label: "Private Events", to: "/private-events" },
  { label: "Personal Shopper", to: "/personal-shopper" },
  { label: "Adventure", to: "/adventure" },
];
