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
  callHours: "Open every day, all day · Tulum time (EST, UTC−5)",
  // Villas are presented as Connected's own collection. Never link out to or name the sourcing partner on the public site.
  // PENDING: promoter / affiliate ticket links per festival. Empty = "Get tickets" opens a WhatsApp request instead.
  promoterUrls: { zamna: "", tehmplo: "", "day-zero": "", other: "" } as Record<string, string>,
  // Transport: client price = our cost + this markup (30%). Transport items use withMarkup(cost in MXN).
  transportMarkup: 0.3,
};

export const mxn = (n: number) => `$${n.toLocaleString("en-US")} MXN`;
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
 * Presented as Connected's own collection. Rates are "on request": never show or link to the sourcing company.
 * Photos live in /public/assets/villas/<slug>-<n>.webp (resized, 1600px max).
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
  bookingUrl?: string; // optional outbound booking link (leave empty: booking goes through WhatsApp)
  owned?: boolean;
  placeholder?: boolean;
  gid?: string; // Beach Please (Guesty) listing id: drives the tracked Book link
  bpPage?: string; // fallback when the id is not on their booking engine: link to their property page instead
};

/* Beach Please photos are served from their Guesty CDN. gi() asks the CDN for a 1200px, auto-format copy. */
const gi = (p: string) => (p.startsWith("http") ? p : `https://assets.guesty.com/image/upload/w_1200,c_limit,q_auto,f_auto/${p}`);

export const villas: Villa[] = [
  {
    slug: "casa-isla",
    gid: "674e4cbc83201d00136d0c3a",
    name: "Casa Isla",
    area: "Tulum · Region 8",
    style: "Jungle architecture",
    guests: 14,
    bedrooms: 7,
    bathrooms: 6,
    hook: "Seven bedrooms of concrete, jungle and a private pool.",
    overview: [
      "A seven bedroom home of about 1,287 m² built from concrete and jungle, five minutes from the beach zone and fifteen from downtown Tulum.",
      "Private pool and gardens, living and dining spaces that open to the water, and a concierge who can set up a private chef, mixology, airport transfers and decor for the occasion.",
    ],
    amenities: ["Private pool and gardens", "Daily housekeeping", "Private chef on request", "Cocktail and mixology experiences", "Private airport transfers", "Bikes and golf arranged by concierge", "Special occasion decor"],
    images: [
      u("/assets/villas/casa-isla-5.webp"),
      u("/assets/villas/casa-isla-1.webp"),
      u("/assets/villas/casa-isla-2.webp"),
      u("/assets/villas/casa-isla-3.webp"),
      u("/assets/villas/casa-isla-4.webp"),
    ],
  },
  {
    slug: "piedras-negras",
    gid: "6a1f4101a3c0d200120fc7bf",
    name: "Casa Piedras Negras",
    area: "Tulum · Gated community",
    style: "Jungle villa",
    guests: 16,
    bedrooms: 6,
    bathrooms: 6,
    hook: "Six bedrooms, three private pools and a jungle rooftop.",
    overview: [
      "Six bedrooms and three private pools, including a rooftop plunge pool with jungle views, inside a gated community with 24/7 security.",
      "A BBQ area, terraces and balconies make it an easy base for a big group, with a paddle court about a minute away.",
    ],
    amenities: ["Three private pools", "Rooftop plunge pool", "BBQ area", "Balconies and terraces", "Paddle court nearby", "24/7 security", "Fully equipped kitchen", "Living and dining areas"],
    images: [
      u("/assets/villas/piedras-negras-1.webp"),
      u("/assets/villas/piedras-negras-2.webp"),
      u("/assets/villas/piedras-negras-3.webp"),
      u("/assets/villas/piedras-negras-4.webp"),
      u("/assets/villas/piedras-negras-5.webp"),
      u("/assets/villas/piedras-negras-6.webp"),
    ],
  },
  {
    slug: "karanda-4br",
    gid: "6876c5cd5e9da3000fa9582d",
    name: "Villa Karanda",
    area: "Tulum · La Veleta",
    style: "Resort villa",
    guests: 14,
    bedrooms: 4,
    bathrooms: 4,
    hook: "Four en-suite bedrooms with a private pool and rooftop plunge pool.",
    overview: [
      "Four en-suite bedrooms in a private villa with its own pool and a rooftop plunge pool, set inside a resort style community.",
      "Shared pools with loungers and hammocks, a paddle court and 24/7 security. Add a private chef, DJ, mixology, ATV tours, yachts or nightlife access through our concierge.",
    ],
    amenities: ["Private pool", "Rooftop plunge pool", "Three shared pools", "Paddle court", "Terrace with grill", "Open living, dining and kitchen", "24/7 security"],
    images: [
      u("/assets/villas/karanda-4br-1.webp"),
      u("/assets/villas/karanda-4br-2.webp"),
      u("/assets/villas/karanda-4br-3.webp"),
      u("/assets/villas/karanda-4br-4.webp"),
    ],
  },
  {
    slug: "mantaray",
    gid: "676487c918c1cd001088538d",
    name: "MantaRay Casa",
    area: "Tulum · Soliman Bay",
    style: "Beachfront",
    guests: 8,
    bedrooms: 3,
    bathrooms: 2,
    hook: "Three bedrooms with white sand at the door.",
    overview: [
      "A three bedroom oceanfront home with white sand just outside, air conditioning throughout and sea views from the terrace and living room.",
      "Shared pool with ocean views, an on-site restaurant, a game room with a pool table, and kayaks and paddle boards. Continental breakfast is included.",
    ],
    amenities: ["Direct beach access", "Air conditioning", "On-site restaurant", "Shared pool with ocean views", "Game room with pool table", "Kayaks and paddle boards", "Continental breakfast included", "Private airport transfers on request"],
    images: [
      u("/assets/villas/mantaray-1.webp"),
      u("/assets/villas/mantaray-2.webp"),
      u("/assets/villas/mantaray-3.webp"),
      u("/assets/villas/mantaray-4.webp"),
      u("/assets/villas/mantaray-5.webp"),
    ],
  },
  {
    slug: "casa-bespoke",
    gid: "6a5aa01cf1902400131774b2",
    name: "Casa Bespoke",
    area: "Tulum · Private bay",
    style: "Beachfront",
    guests: 6,
    bedrooms: 2,
    bathrooms: 3,
    hook: "Two bedrooms on a private bay with beach club access.",
    overview: [
      "A two bedroom beachfront villa on a private bay about twenty minutes from Tulum, with ocean views, its own terrace and direct beach access.",
      "Guests can use the neighboring beach club, with an infinity pool and gym, and the villa sits close to cenotes and the reef.",
    ],
    amenities: ["Private terrace", "Direct beach access", "Beach club with infinity pool and gym", "Full kitchen", "Air conditioning", "Wifi"],
    images: [
      u("/assets/villas/casa-bespoke-1.webp"),
      u("/assets/villas/casa-bespoke-2.webp"),
      u("/assets/villas/casa-bespoke-3.webp"),
      u("/assets/villas/casa-bespoke-4.webp"),
      u("/assets/villas/casa-bespoke-5.webp"),
      u("/assets/villas/casa-bespoke-6.webp"),
      u("/assets/villas/casa-bespoke-7.webp"),
    ],
  },
  {
    slug: "antal-104",
    gid: "65525bf5ea27b6003ff360b5",
    name: "Antal 104",
    area: "Tulum · Tankah Bay",
    style: "Oceanfront",
    guests: 8,
    bedrooms: 3,
    bathrooms: 4,
    hook: "Oceanfront in Tankah Bay with a private rooftop plunge pool.",
    overview: [
      "A modern three bedroom oceanfront apartment in Tankah Bay with a private terrace, direct beach access and Caribbean views. Every bedroom has its own bathroom.",
      "Private rooftop with a plunge pool, a shared pool, and kayaks and snorkel gear, in a secure beachfront building about ten to fifteen minutes from downtown.",
    ],
    amenities: ["Direct beach access", "Private terrace", "Private rooftop with plunge pool", "Shared pool", "Kayaks and snorkel gear", "Air conditioning in every bedroom", "24/7 security", "Wifi"],
    images: [
      u("/assets/villas/antal-104-1.webp"),
      u("/assets/villas/antal-104-2.webp"),
      u("/assets/villas/antal-104-3.webp"),
      u("/assets/villas/antal-104-4.webp"),
      u("/assets/villas/antal-104-5.webp"),
    ],
  },
  {
    slug: "kune-201",
    gid: "6a4c22b2eeca1600128e47e5",
    name: "Kune 201",
    area: "Tulum · Kune community",
    style: "Modern apartment",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    hook: "Three bedrooms, rooftop pools and five minutes to the beach.",
    overview: [
      "A stylish three bedroom apartment in a modern, jungle side complex, about five minutes from the beach and downtown.",
      "Shared rooftop with jungle views, several pools including a semi-Olympic lap pool, a gym, co-working spaces, kids areas and 24/7 security.",
    ],
    amenities: ["Rooftop with jungle views", "Multiple pools", "Gym", "Co-working spaces", "Kids areas", "24/7 security", "Fully equipped kitchen", "Sofa bed in living area"],
    images: [
      u("/assets/villas/kune-201-1.webp"),
      u("/assets/villas/kune-201-2.webp"),
      u("/assets/villas/kune-201-3.webp"),
      u("/assets/villas/kune-201-4.webp"),
      u("/assets/villas/kune-201-5.webp"),
      u("/assets/villas/kune-201-6.webp"),
    ],
  },
  {
    slug: "yaxkin",
    gid: "65525ad755ab6a003d7bc95b",
    name: "Villa Yaxkin",
    area: "Tulum · Aldea Zama",
    style: "Private pool villa",
    guests: 9,
    bedrooms: 4,
    bathrooms: 5,
    hook: "Four bedrooms, a private pool and a paddle court in Aldea Zama.",
    overview: ["A four bedroom villa in Aldea Zama with a private pool, a paddle court and indoor-outdoor living areas, set up for up to 9 guests.", "Mayan-inspired architecture in natural wood and local stone."],
    amenities: ["Private pool", "Paddle court", "Indoor-outdoor living areas", "Natural wood and local stone finishes"],
    images: [
      gi("v1771874595/production/65401681c66d810b8ce078a5/ifmk5fm19ubuuo6euc6y.jpg"),
      gi("v1713836195/vt0jnq4xo3ft1lksermk.jpg"),
      gi("v1771874596/production/65401681c66d810b8ce078a5/crjlcvoey7x6tjq4ngon.jpg"),
      gi("v1771874596/production/65401681c66d810b8ce078a5/wouuxpqgkepi6xzvqgar.jpg"),
      gi("v1735591101/production/65401681c66d810b8ce078a5/auklbri7qaot1aesggpe.jpg"),
      gi("v1713836194/fuo01bkghddlcwqfo7hp.jpg"),
      gi("v1713836194/xjitoye2cjijmgblxeua.jpg"),
      gi("v1713836194/u704hmczv3qb0tyfs3c5.jpg"),
    ],
  },
  {
    slug: "omara",
    gid: "65529112120f4c00335b0cb5",
    name: "Omara",
    area: "Tulum · Aldea Zama",
    style: "Gated condo",
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A stylish two bedroom condo in a gated Aldea Zama community.",
    overview: ["A two bedroom condo in the prestigious Aldea Zama with double security in a gated community, hosting up to 6 guests.", "Pool and lounge chairs on site, close to the beach."],
    amenities: ["Pool and lounge chairs", "Gated community", "Double security", "Near the beach"],
    images: [
      gi("v1713836517/oqekw6suq2jyd5nakl7c.jpg"),
      gi("v1713836517/ftc4ozauzdh437dkgkum.jpg"),
      gi("v1713836518/jyp0lu0jzx4ethgsasqd.jpg"),
      gi("v1713836517/uz2eoasiqeou69oydprr.jpg"),
      gi("v1713836517/sektshsxmjg3aifnkc5x.jpg"),
      gi("v1713836518/dcao2ko8s5omkdrityyc.jpg"),
      gi("v1713836516/h4lvhtvfkndr3ns2hhyh.jpg"),
      gi("v1770319559/production/65401681c66d810b8ce078a5/ej39twl6adogyif0adtj.jpg"),
    ],
  },
  {
    slug: "kokoon-coati-1",
    gid: "65567fb349dc6c003fa06ae2",
    name: "Casa Coatí",
    area: "Tulum · La Veleta",
    style: "Boho home",
    guests: 6,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A chic three bedroom boho home with a rooftop plunge pool.",
    overview: ["A three bedroom boho retreat in La Veleta, inside a gated complex with 24/7 security.", "Private rooftop with plunge pool and grill, plus a spacious shared pool."],
    amenities: ["Rooftop plunge pool", "Grill", "Shared pool", "Gated complex", "24/7 security"],
    images: [
      gi("v1709248426/mpzrfa1wlu0c4uyhr2mp.jpg"),
      gi("v1709248427/uzlocvciwcvlftiup8oc.jpg"),
      gi("v1709248426/jo0jjblqmr0imwwkvkyz.jpg"),
      gi("v1709248427/v5xrcls0ktzsroztnxgt.jpg"),
      gi("v1709248426/vf1dui0eq8rdvdwgueyy.jpg"),
      gi("v1769808966/production/65401681c66d810b8ce078a5/hfedygbcha4yxuigtqvl.jpg"),
      gi("v1709248426/fu3xfvr6y1snqhjxaoor.jpg"),
      gi("v1709248426/ahhi7e1eu8mhqvvsu0sf.jpg"),
    ],
  },
  {
    slug: "kokoon-oyamel",
    gid: "65567f9b6088630032af0cdc",
    name: "Villa Oyamel",
    area: "Tulum · Kokoon Pueblo",
    style: "Boho home",
    guests: 9,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A boho three bedroom home with a private rooftop pool, surrounded by jungle.",
    overview: ["Three bedrooms in the exclusive Kokoon Pueblo, surrounded by jungle, with 24/7 security and three pools on the property.", "A private rooftop for nights under the stars."],
    amenities: ["Private rooftop pool", "Three pools", "Patio", "24/7 security", "Gated community"],
    images: [
      gi("v1713836537/u6rafkjrdkzsbzjw4cp4.jpg"),
      gi("v1713836537/vxzam0bwupqptp9wed2a.jpg"),
      gi("v1713836537/nqk3my05kg70r7ledzob.jpg"),
      gi("v1713836537/gzcyiakj1u6gbqyaddqu.jpg"),
      gi("v1713836537/xsimiy2zjhbwmw5k9pwo.jpg"),
      gi("v1769809223/production/65401681c66d810b8ce078a5/u6jwq9qo6cjzxgdjq0j6.jpg"),
      gi("v1713836538/svrvqrbvnghmx2efywma.jpg"),
      gi("v1713836538/zgvhhhyiwixy2dh8fuwx.jpg"),
    ],
  },
  {
    slug: "t52-m201-2br-oziel",
    gid: "66a95fee160c810013cd71fb",
    name: "Tankah 52 M201",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront apartment",
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A beachfront two bedroom apartment with a shared pool and ocean views.",
    overview: ["A two bedroom beachfront apartment at Tankah 52 with ocean views, good for a family or a couple.", "Shared pool and 24/7 security."],
    amenities: ["Beachfront", "Shared pool", "24/7 security", "Ocean views"],
    images: [
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965197744.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965198334.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965197878.jpg"),
      gi("v1765410261/production/65401681c66d810b8ce078a5/gac8ke7dlccw33sgisvh.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965197880.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965198345.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212434156870174226_1965197742.jpg"),
      gi("v1770320069/production/65401681c66d810b8ce078a5/tcfa71tkvxtq8xbaqyfh.jpg"),
    ],
  },
  {
    slug: "casa-de-amar",
    gid: "65526003120f4c003355c03c",
    name: "Casa de Amar",
    area: "Tulum · Yaaxté",
    style: "Eco-chic townvilla",
    guests: 6,
    bedrooms: 3,
    bathrooms: 4,
    hook: "An eco-chic three bedroom townvilla with its own pool, gated at Yaaxté.",
    overview: ["Elegant decor, a private pool and jungle views inside the gated Yaaxté complex with 24/7 security.", "Walkable to cafés, with full concierge."],
    amenities: ["Private pool", "Jungle views", "Gated complex", "24/7 security", "Concierge"],
    images: [
      gi("v1713836263/slghmb3zpn9nkspng2zn.jpg"),
      gi("v1713836263/ehicu3ylwkfcoolieiwx.jpg"),
      gi("v1713836264/mhzcfhwywqyurbfeaxw5.jpg"),
      gi("v1713836262/busszbm94ilvawlgzioy.jpg"),
      gi("v1713836261/pg9ki3mawukrtbp4mbt4.jpg"),
      gi("v1713836262/wnv5ayplg6jxf3twlhpp.jpg"),
      gi("v1713836265/sb817igzwpatn25i0ywn.jpg"),
      gi("v1713836261/rvyqia6bdhgofc9yxdi6.jpg"),
    ],
  },
  {
    slug: "mantaray-bf-lower",
    gid: "673b8833b5614b00114c9d1c",
    name: "MantaRay Beachfront Lower",
    area: "Tulum · Soliman Bay",
    style: "Beachfront room",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hook: "An oceanfront room in Soliman Bay with a plunge pool terrace.",
    overview: ["A king bed, private bathroom and kitchenette in Soliman Bay, with a private balcony and terrace with plunge pool.", "Direct access to the beach."],
    amenities: ["King bed", "Kitchenette", "Private terrace with plunge pool", "Direct beach access"],
    images: [
      gi("v1731956036/production/65401681c66d810b8ce078a5/dx9f2zfpzdr1reqnq15u.jpg"),
      gi("v1764193490/production/65401681c66d810b8ce078a5/ouafnuirqzx7ldok9y2n.jpg"),
      gi("v1764616018/production/65401681c66d810b8ce078a5/q7dpc6usvltxugrcou7z.jpg"),
      gi("v1769811289/production/65401681c66d810b8ce078a5/tztb2xst0jmpho2mh4tr.jpg"),
      gi("v1764615990/production/65401681c66d810b8ce078a5/czkdh7mbq6hgjkytehv0.jpg"),
      gi("v1731954730/production/65401681c66d810b8ce078a5/erqiqwvdymxtxaqismec.jpg"),
      gi("v1731956028/production/65401681c66d810b8ce078a5/nhblsh0f7hqzdevhpmez.jpg"),
      gi("v1731956031/production/65401681c66d810b8ce078a5/bwzjmnn5po7yun8rfbxm.jpg"),
    ],
  },
  {
    slug: "antal-203",
    gid: "67608b1b1b87d400138e4517",
    name: "Antal 203",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront villa",
    guests: 10,
    bedrooms: 3,
    bathrooms: 3,
    hook: "A beachfront three bedroom with a private rooftop and plunge pool.",
    overview: ["A three bedroom villa in exclusive Tankah Bay with ocean views, a private rooftop with plunge pool and BBQ, and a terrace for dinners by the sea.", "24/7 security, on a sandy beach."],
    amenities: ["Private rooftop plunge pool", "BBQ", "Sea-view terrace", "Sandy beach", "24/7 security"],
    images: [
      gi("v1772576234/production/65401681c66d810b8ce078a5/tj0gqr74btlxwwuw5aoi.jpg"),
      gi("v1772576233/production/65401681c66d810b8ce078a5/guegfwdpyolmbzeodl9v.jpg"),
      gi("v1772576236/production/65401681c66d810b8ce078a5/xukijlvbq9t9r0otw9au.jpg"),
      gi("v1772576202/production/65401681c66d810b8ce078a5/dehc3ar8uosqzekhzqac.jpg"),
      gi("v1766429793/production/65401681c66d810b8ce078a5/rhfcqcc3bslcochjzysz.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67608b1b1b87d400138e4517/011e0a7f-e6a5-4b-WjzO9"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67608b1b1b87d400138e4517/e356f5c5-6b28-4f-NFMqF"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67608b1b1b87d400138e4517/3afe3300-8303-4e-6t_5V"),
    ],
  },
  {
    slug: "mantaray-bf-upper",
    gid: "673b924312346d001279b061",
    name: "MantaRay Beachfront Upper",
    area: "Tulum · Soliman Bay",
    style: "Beachfront room",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hook: "An upper floor oceanfront room in Soliman Bay with a private balcony.",
    overview: ["A king bed, private bathroom and kitchenette in Soliman Bay, with a private balcony and access to the beach.", "Use of the beach club and on-site restaurant."],
    amenities: ["King bed", "Kitchenette", "Private balcony", "Beach access", "Beach club and restaurant"],
    images: [
      gi("v1731964943/production/65401681c66d810b8ce078a5/hgosqobobdbpjqsx26c6.jpg"),
      gi("v1731964933/production/65401681c66d810b8ce078a5/aysjbwd0xmxcqghgbiah.jpg"),
      gi("v1731964943/production/65401681c66d810b8ce078a5/fooki3idutfylhr7cr7w.jpg"),
      gi("v1776109946/production/65401681c66d810b8ce078a5/gz1s1xe0pdytewzilkav.jpg"),
      gi("v1776109946/production/65401681c66d810b8ce078a5/kvoyhwopes9mxjhfyhms.jpg"),
      gi("v1776110117/production/65401681c66d810b8ce078a5/btamhi6piordjxs3cvhc.jpg"),
      gi("v1776110324/production/65401681c66d810b8ce078a5/q6osojmtobjpbej6g7aw.jpg"),
      gi("v1776110324/production/65401681c66d810b8ce078a5/uiwolkaolaqp2r6rtrah.jpg"),
    ],
  },
  {
    slug: "t52-e401-ph-oziel",
    gid: "66a96038f4391b00114b3936",
    name: "Tankah 52 E401 Penthouse",
    area: "Mayan Riviera · Tankah Bay",
    style: "Oceanfront penthouse",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hook: "An oceanfront penthouse with its own plunge pool.",
    overview: ["A king bed, private balcony and your own plunge pool, with ocean views at Tankah 52.", "Access to a shared pool and 24/7 security."],
    amenities: ["King bed", "Private plunge pool", "Private balcony", "Shared pool", "24/7 security"],
    images: [
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200862.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200438.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200863.jpg"),
      gi("v1764793830/production/65401681c66d810b8ce078a5/toswrpmjxzvet9vybt3j.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200441.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200795.jpg"),
      gi("https://guesty-listing-images.s3.amazonaws.com/production/original_1212437200684995756_1965200430.jpg"),
      gi("v1770320021/production/65401681c66d810b8ce078a5/lny3pf46g0fhljpqlue5.jpg"),
    ],
  },
  {
    slug: "panoramic-105b",
    bpPage: "panoramic-105b",
    name: "Panoramic 105B",
    area: "Tulum · La Veleta",
    style: "Studio",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hook: "A studio with a 360° rooftop pool and gym, built for couples.",
    overview: ["A studio in the Panoramic complex with warm, elegant architecture, set in La Veleta close to restaurants and cafés.", "Complex amenities include a 360° rooftop pool and a gym."],
    amenities: ["360° rooftop pool", "Gym", "La Veleta location"],
    images: [
      gi("v1713836473/b07wiexhosdgllw93bnx.jpg"),
      gi("v1713836473/eqo1jjb8e19yfqgpuxdo.jpg"),
      gi("v1713836473/q1iqdnxfjug5s48yyrwx.jpg"),
      gi("v1765491265/production/65401681c66d810b8ce078a5/o8jwl652j0jmpqrtheya.jpg"),
      gi("v1767912234/production/65401681c66d810b8ce078a5/tej8tvwha9v7livexhlt.jpg"),
      gi("v1713836473/rpwlkgvmc5qrcte507ca.jpg"),
      gi("v1713836473/qufr32t1ykhpgn24bxfh.jpg"),
      gi("v1774458999/production/65401681c66d810b8ce078a5/gefdab97v07z5unwpjqw.jpg"),
    ],
  },
  {
    slug: "villa-raes",
    gid: "69d6b2cb621a7a0013540930",
    name: "Villa RAES",
    area: "Tulum",
    style: "Villa compound",
    guests: 16,
    bedrooms: 8,
    bathrooms: 10,
    hook: "An eight bedroom estate across several villas, with pool and spa.",
    overview: ["A private eight bedroom estate spanning multiple villas, minutes from the beach, with a pool, spa and privacy for groups and fitness retreats.", "Fully paved access and complimentary daily housekeeping."],
    amenities: ["Pool", "Spa", "Complimentary daily housekeeping", "Paved access", "Minutes from the beach"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/ded591c0-cbd8-4e-v_TpF"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/2c7474f5-5451-4f-k9NIw"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/c608826e-1e03-43-L601t"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/f2e6380b-74fc-43-UQDED"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/70e8e454-ef9d-41-fxL4A"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/8f83c07b-5096-46-p4o4i"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/53194a80-c310-43-gu5cu"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69d6b2cb621a7a0013540930/76377ee5-5e30-47-FYKNI"),
    ],
  },
  {
    slug: "t52-401-ph-barabara",
    gid: "69111977ff17ca0010c28fb8",
    name: "Tankah 52 401 Penthouse",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront penthouse",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A beachfront two bedroom with a private plunge pool.",
    overview: ["A two bedroom in the exclusive Tankah 52 complex with the ocean steps away, a private plunge pool and modern design.", "Shared pool to lounge by."],
    amenities: ["Private plunge pool", "Shared pool", "Beachfront", "Modern design"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69111977ff17ca0010c28fb8/1c497e90-8981-47-zIOQl"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69111977ff17ca0010c28fb8/a5af0f6d-44dc-4c-c628n"),
      gi("v1764795941/production/65401681c66d810b8ce078a5/oe5yo27madouqnft8g8f.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69111977ff17ca0010c28fb8/49ae2c86-f102-4a-QtLXN"),
      gi("v1764795924/production/65401681c66d810b8ce078a5/ff3c4cqtrkc7yf9wwdgn.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69111977ff17ca0010c28fb8/b86b7cc9-7e82-4d-dmySB"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/69111977ff17ca0010c28fb8/6a0bbddf-25e0-4c-5E8nx"),
      gi("v1770319894/production/65401681c66d810b8ce078a5/a82aok2sranzuhm6zwe7.jpg"),
    ],
  },
  {
    slug: "antal-204",
    gid: "687b02ac88ac4300101ccdd6",
    name: "Antal 204",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront villa",
    guests: 8,
    bedrooms: 3,
    bathrooms: 4,
    hook: "Three bedrooms on the sand in Tankah Bay, with a rooftop plunge pool.",
    overview: ["An elegant three bedroom in exclusive Tankah Bay with ocean views, a private rooftop with plunge pool and BBQ, and a terrace for dinners by the sea.", "24/7 security, on a sandy beach."],
    amenities: ["Private rooftop plunge pool", "BBQ", "Sea-view terrace", "Sandy beach", "24/7 security"],
    images: [
      gi("v1772576757/production/65401681c66d810b8ce078a5/ipsx0btij8whb1745obo.jpg"),
      gi("v1772576757/production/65401681c66d810b8ce078a5/dbupvcmkpoohxwfh35ua.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/4d4bf2a6-23b0-43-x9AI4"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/bb036077-617f-45-G0pJ7"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/5f4d270f-9997-49-yUYz2"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/6cf81e06-fed6-40-SPfwa"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/28774ef2-0ee5-43-ivlsv"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02ac88ac4300101ccdd6/1f169ef3-4207-4b-9lqbV"),
    ],
  },
  {
    slug: "casa-arcana",
    bpPage: "casa-arcana",
    name: "Casa Arcana",
    area: "Tulum",
    style: "Five bedroom villa",
    guests: 14,
    bedrooms: 5,
    bathrooms: 5,
    hook: "Five bedrooms with a private jacuzzi, waterfall and cinema room.",
    overview: ["A spacious five bedroom villa for families and groups, with a private jacuzzi, a waterfall, a cinema room and an outdoor terrace.", "Fully equipped kitchen and dedicated concierge service."],
    amenities: ["Private jacuzzi", "Waterfall", "Cinema room", "Outdoor terrace", "Fully equipped kitchen", "Concierge"],
    images: [
      gi("v1793910507/production/65401681c66d810b8ce078a5/krhzqwb8acszv7wfwrr0.jpg"),
      gi("v1793910506/production/65401681c66d810b8ce078a5/stkyqpyfdxtrevafuuin.jpg"),
      gi("v1793910507/production/65401681c66d810b8ce078a5/kdsla03dahfnqym4tnvk.jpg"),
      gi("v1793910508/production/65401681c66d810b8ce078a5/rk7sdbykqiz6kggz2ld5.jpg"),
      gi("v1793910505/production/65401681c66d810b8ce078a5/hq1tngdyjf7thklzwedw.jpg"),
      gi("v1793910506/production/65401681c66d810b8ce078a5/frhpc8rbtb8fsuq8hhki.jpg"),
      gi("v1793910505/production/65401681c66d810b8ce078a5/geovhaack429n15jdq9q.jpg"),
      gi("v1793910503/production/65401681c66d810b8ce078a5/hyekprrf3cgtt0tvsc12.jpg"),
    ],
  },
  {
    slug: "casa-kookay",
    gid: "65525b99ea27b6003ff34e73",
    name: "Casa Kookay",
    area: "Tulum · Aldea Zama",
    style: "Luxury villa",
    guests: 18,
    bedrooms: 6,
    bathrooms: 7,
    hook: "Six bedrooms and three pools in Aldea Zama, built for big groups.",
    overview: ["A six bedroom villa in Aldea Zama, ideal for large groups, retreats and family stays.", "Minutes from beach clubs, cenotes, restaurants, cafés and gyms."],
    amenities: ["Three pools", "Aldea Zama location", "Near beach clubs and cenotes"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/fngpknympl2d90q1-wud-u"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/q9l6actx8xi7gyvt-l6TCu"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/wcofg4gl6ub6vnsx-DdS2c"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/doketjapzycw4duk-8Kr0k"),
      gi("v1778615576/production/65401681c66d810b8ce078a5/n7qj0pepzlw8lc38uedq.jpg"),
      gi("v1776201457/production/65401681c66d810b8ce078a5/alqygplvtbuakg5woawy.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/mxel0vesnl6or7ge-uDGFr"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/65525b99ea27b6003ff34e73/e7fhuemaxn0ehyfl-NJKWQ"),
    ],
  },
  {
    slug: "mantaray-garden",
    gid: "67b4faea58a58600205dfdb1",
    name: "MantaRay Garden Villa",
    area: "Tulum · Soliman Bay",
    style: "Garden villa",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hook: "A king bedroom with a private plunge pool, steps from the beach.",
    overview: ["A designed king bedroom with kitchenette in Soliman Bay, with a private plunge pool and garden view.", "Steps from the beach, with daily housekeeping."],
    amenities: ["King bed", "Kitchenette", "Private plunge pool", "Garden view", "Daily housekeeping"],
    images: [
      gi("v1776114743/production/65401681c66d810b8ce078a5/oauijgimrrzlijquh6f0.jpg"),
      gi("v1739913943/production/65401681c66d810b8ce078a5/hdabwlpbcxdpskhmf0lu.jpg"),
      gi("v1769724487/production/65401681c66d810b8ce078a5/g7d4uxqxjgyoahjvjmua.jpg"),
      gi("v1739913946/production/65401681c66d810b8ce078a5/lcrucopkgwuziuwgpj3d.jpg"),
      gi("v1769724416/production/65401681c66d810b8ce078a5/ux7cwl0lrm437y1meyss.jpg"),
      gi("v1769724464/production/65401681c66d810b8ce078a5/ran1rkoik9h8mkjkim7q.jpg"),
      gi("v1739913943/production/65401681c66d810b8ce078a5/eluntcjvxlzlr3ddmo2z.jpg"),
      gi("v1739913945/production/65401681c66d810b8ce078a5/lr7swqrdudsiv5tz2gzu.jpg"),
    ],
  },
  {
    slug: "ph-2",
    gid: "6552608855ab6a003d7c8f29",
    name: "Aldea Zama Penthouse 2",
    area: "Tulum · Aldea Zama",
    style: "Penthouse",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A top floor jungle penthouse with a private plunge pool.",
    overview: ["A two bedroom top floor penthouse with jungle views in an exclusive gated community in Aldea Zama.", "Private plunge pool, outdoor dining area and BBQ, about 10 minutes from the beaches."],
    amenities: ["Private plunge pool", "Outdoor dining area", "BBQ", "Gated community", "Jungle views"],
    images: [
      gi("v1713836278/plzboqmim5cagxbw5jn8.jpg"),
      gi("v1713836279/yed9boqmtvfjyudomo0h.jpg"),
      gi("v1713836279/rnsx4gidlqhpqujseufb.jpg"),
      gi("v1713836279/z8turihmoerwgwjje0h9.jpg"),
      gi("v1713836278/xkr2d3dicuzmqcyc6vjs.jpg"),
      gi("v1770320581/production/65401681c66d810b8ce078a5/kkhwsdcnhjq5969xbkeo.jpg"),
      gi("v1765494702/production/65401681c66d810b8ce078a5/wfcd44dun32edpza047k.jpg"),
      gi("v1774462417/production/65401681c66d810b8ce078a5/h0n8u6cfey5jcz8cs30b.jpg"),
    ],
  },
  {
    slug: "ph-1",
    gid: "65526040120f4c003355ca36",
    name: "Aldea Zama Penthouse 1",
    area: "Tulum · Aldea Zama",
    style: "Penthouse",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A top floor jungle penthouse with a private plunge pool.",
    overview: ["A two bedroom top floor penthouse with jungle views in an exclusive gated community in Aldea Zama.", "Private plunge pool, outdoor dining area and BBQ, about 10 minutes from the beaches."],
    amenities: ["Private plunge pool", "Outdoor dining area", "BBQ", "Gated community", "Jungle views"],
    images: [
      gi("v1713836272/fddyucihvmuspeixbgsq.jpg"),
      gi("v1765494433/production/65401681c66d810b8ce078a5/gfix2j4ayfd0lkkgjjeu.jpg"),
      gi("v1713836271/mtqznippdc8jhxsdlyjd.jpg"),
      gi("v1713836270/rtf0jen36nm2icqi2dmz.jpg"),
      gi("v1713836271/juirsbfttkim0s9kdsmc.jpg"),
      gi("v1770320419/production/65401681c66d810b8ce078a5/bgwvkf8je7es6zdqhym7.jpg"),
      gi("v1713836271/m4nkj0oourggory5yw8s.jpg"),
      gi("v1713836272/ncvc4cduthy50xzgbcsj.jpg"),
    ],
  },
  {
    slug: "casa-zenica",
    gid: "696ffac4fb67c5001474a0d0",
    name: "Casa Zenica",
    area: "Tulum",
    style: "Hacienda villa",
    guests: 6,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A private three bedroom hacienda with a pool, five minutes from the beach.",
    overview: ["A hacienda-style villa, spacious and open, surrounded by lush tropical vegetation.", "A large private patio for family and friends."],
    amenities: ["Private pool", "Large private patio", "Five minutes to the beach"],
    images: [
      gi("v1771873392/production/65401681c66d810b8ce078a5/vckv74err26kphjm34nc.jpg"),
      gi("v1771873398/production/65401681c66d810b8ce078a5/hix2vlx7vlg2qimjs6sh.jpg"),
      gi("v1771873379/production/65401681c66d810b8ce078a5/m9izumz9s23mixuvuosg.jpg"),
      gi("v1771873401/production/65401681c66d810b8ce078a5/cfsyxec3vdmtysh6x2mc.jpg"),
      gi("v1770153670/production/65401681c66d810b8ce078a5/cxjouodaekgvkrnwuu6q.jpg"),
      gi("v1771873372/production/65401681c66d810b8ce078a5/y5jkxivdk9jrejmw5rjv.jpg"),
      gi("v1770153703/production/65401681c66d810b8ce078a5/o98lgthedoksi5uo0fmk.jpg"),
      gi("v1771873402/production/65401681c66d810b8ce078a5/x4psqa68iwcwrgvezej5.jpg"),
    ],
  },
  {
    slug: "t52-m202-3br-phil",
    gid: "689c39e91459c4000fb6cc7a",
    name: "Tankah 52 M202",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront apartment",
    guests: 8,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A three bedroom beachfront apartment with panoramic Caribbean views.",
    overview: ["Step straight onto the beach from a stylish three bedroom apartment at exclusive Tankah 52, with panoramic Caribbean Sea views."],
    amenities: ["Beachfront", "Panoramic sea views", "Exclusive Tankah 52 complex"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/d5e5890c-6262-47-vxx0h"),
      gi("v1757101557/production/65401681c66d810b8ce078a5/vowqfpvpggylymauztho.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/850952e0-9caf-43-3qch6"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/ad6e9567-caaf-49-LSjvi"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/1861cb36-9510-4f-jTNLq"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/ce4b9327-7aa1-43-4YH7P"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/689c39e91459c4000fb6cc7a/48be2952-0cb3-43-Wmm9R"),
      gi("v1770320156/production/65401681c66d810b8ce078a5/srnqk4rrthokc1k8bjrj.jpg"),
    ],
  },
  {
    slug: "kokoon-2-d10",
    gid: "687ee4310a2fbc00105bb52a",
    name: "Kokoon Pueblo II D10",
    area: "Tulum · Kokoon Pueblo",
    style: "Plunge pool villa",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A brand-new two bedroom with a private plunge pool, built for couples.",
    overview: ["A chic two bedroom villa nestled among trees in Kokoon Pueblo, designed for privacy and a connection with nature.", "Private plunge pool and a garden."],
    amenities: ["Private plunge pool", "Garden", "Brand new"],
    images: [
      gi("v1783115652/production/65401681c66d810b8ce078a5/shljd208atngxdbruuuo.jpg"),
      gi("v1783115674/production/65401681c66d810b8ce078a5/sqopgvme5mvzm1uba5lk.jpg"),
      gi("v1785870681/production/65401681c66d810b8ce078a5/ebea7fnwe7ssr4c3bqfm.jpg"),
      gi("v1783115659/production/65401681c66d810b8ce078a5/ofm9iikr3txcx9ttfssb.jpg"),
      gi("v1783115666/production/65401681c66d810b8ce078a5/ubrvgrvfinlp0w96yyhh.jpg"),
      gi("v1783115667/production/65401681c66d810b8ce078a5/rr4aqc7fdli61gf0oy5i.jpg"),
      gi("v1783115665/production/65401681c66d810b8ce078a5/tnhmfdy30muln3gucy8f.jpg"),
      gi("v1783115659/production/65401681c66d810b8ce078a5/xghp1uoka66ktlhjy7y9.jpg"),
    ],
  },
  {
    slug: "antal-201",
    gid: "687b02be1830b700127fa434",
    name: "Antal 201",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront villa",
    guests: 10,
    bedrooms: 3,
    bathrooms: 4,
    hook: "Three bedrooms on Tankah Bay with a rooftop plunge pool and BBQ.",
    overview: ["A stylish three bedroom in exclusive Tankah Bay with sophisticated decor and ocean views.", "Terrace dinners over the sea, plus a private rooftop with plunge pool, BBQ area and panoramic views."],
    amenities: ["Private rooftop plunge pool", "BBQ area", "Sea-view terrace", "Sandy beach"],
    images: [
      gi("v1776963666/production/65401681c66d810b8ce078a5/jb7pa47myunzegabo2ob.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/4b986b57-203f-4b-xpCSW"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/092e398c-83b5-4e-56cSg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/80f2fdfb-0f1e-4d-ggU48"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/e48fe679-0c8a-48-aHkyZ"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/77344c91-8137-44-7XuVi"),
      gi("v1766429655/production/65401681c66d810b8ce078a5/cfi2vfev1mbmovqqebzp.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/687b02be1830b700127fa434/7df25450-1b64-4e-oFlm6"),
    ],
  },
  {
    slug: "casa-ahal",
    gid: "6552600bea27b6003ff3f396",
    name: "Casa Ahal",
    area: "Tulum",
    style: "Townhouse",
    guests: 7,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A three bedroom townhouse with a private pool and a lock-off.",
    overview: ["A three bedroom house with a private pool in a private community, with spaces that balance privacy and connection.", "Includes a private lock-off."],
    amenities: ["Private pool", "Private lock-off", "Private community"],
    images: [
      gi("v1773788349/production/65401681c66d810b8ce078a5/iktgcpxvk0ovvqfkvjn1.jpg"),
      gi("v1765223737/production/65401681c66d810b8ce078a5/vi4gls4fun09cjcbpsnx.jpg"),
      gi("v1773788636/production/65401681c66d810b8ce078a5/obuqqaxdnumghsaemipw.jpg"),
      gi("v1773788636/production/65401681c66d810b8ce078a5/njkybicuskuzzcn4vzip.jpg"),
      gi("v1773788524/production/65401681c66d810b8ce078a5/vf06tylpyjvqdcsesdxc.jpg"),
      gi("v1765223731/production/65401681c66d810b8ce078a5/eafeps7bkjgqoctqh4l8.jpg"),
      gi("v1765223725/production/65401681c66d810b8ce078a5/wauccf7wpcwoosr1hgli.jpg"),
      gi("v1765223732/production/65401681c66d810b8ce078a5/wdkfibbntjy1a73rmsq5.jpg"),
    ],
  },
  {
    slug: "t52-402-2br-erick",
    gid: "67c9dcd18362bc0010254b9d",
    name: "Tankah 52 402",
    area: "Mayan Riviera · Tankah Bay",
    style: "Beachfront apartment",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hook: "A two bedroom apartment with ocean views and a private rooftop pool.",
    overview: ["A two bedroom at Tankah 52 with magical ocean views, good for family or a couple.", "Shared pool and 24/7 security."],
    amenities: ["Private rooftop pool", "Shared pool", "24/7 security", "Ocean views"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/0167e497-e6a3-4e-vRzyt"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/b58f34d9-f03b-4d-DuEn2"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/d3db8b28-c8c2-4a-hBEBN"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/6aa0f42b-af2d-47-DIypt"),
      gi("v1765405989/production/65401681c66d810b8ce078a5/t08iymwnhuomlmp15udb.jpg"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/0dd00c8f-4c60-4e-khdYh"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/67c9dcd18362bc0010254b9d/f3b2a270-83ca-42-mOKvC"),
      gi("v1770319763/production/65401681c66d810b8ce078a5/vwgigshrdfpsigtxgopg.jpg"),
    ],
  },
  {
    slug: "karanda-1-fuego",
    bpPage: "karanda-1-fuego",
    name: "Villa Karanda Fuego",
    area: "Tulum · La Veleta",
    style: "Jungle villa",
    guests: 14,
    bedrooms: 4,
    bathrooms: 4,
    hook: "A jungle villa in La Veleta with pools, built for bachelor groups.",
    overview: ["A modern villa in La Veleta that sleeps up to 14, with a private pool, rooftop plunge pool and open living areas.", "24/7 security, minutes from Tulum's best spots."],
    amenities: ["Private pool", "Rooftop plunge pool", "Open living areas", "24/7 security"],
    images: [
      gi("v1713836494/wjwifablxabyi39uex5v.jpg"),
      gi("v1774292958/production/65401681c66d810b8ce078a5/pkqfeplmei8bbzq7e4lf.jpg"),
      gi("v1774292555/production/65401681c66d810b8ce078a5/rbnixdzcrkw2uvay82do.jpg"),
      gi("v1757713879/production/65401681c66d810b8ce078a5/eaeambzui3qnidvk36po.jpg"),
      gi("v1776203400/production/65401681c66d810b8ce078a5/p6s5ol1rbe7vaonme8d5.jpg"),
      gi("v1774292555/production/65401681c66d810b8ce078a5/hhbb2luvsaqfyew0jimq.jpg"),
      gi("v1713836494/zfb9sbpe52uy7my8bd3z.jpg"),
      gi("v1757713877/production/65401681c66d810b8ce078a5/e7dckporjvjk22g2y81s.jpg"),
    ],
  },
  {
    slug: "karanda-double-8-br",
    gid: "6876cad3dcf77d002229eccb",
    name: "Karanda Double 8BR",
    area: "Tulum · La Veleta",
    style: "Resort villa",
    guests: 24,
    bedrooms: 8,
    bathrooms: 8,
    hook: "Eight en-suite bedrooms in La Veleta, with a pool and paddle court.",
    overview: ["A private eight bedroom villa in La Veleta with eight en-suite bedrooms, a pool and a paddle court.", "Made for bachelorette weekends and big group stays."],
    amenities: ["Eight en-suite bedrooms", "Pool", "Paddle court", "Resort amenities"],
    images: [
      gi("v1756166045/production/65401681c66d810b8ce078a5/lnok1rscdphvmdqc8pb8.jpg"),
      gi("v1764195691/production/65401681c66d810b8ce078a5/jr2tyjqobtktwfpfhweo.jpg"),
      gi("v1756166042/production/65401681c66d810b8ce078a5/lzqpe814vmq6z4atzojw.jpg"),
      gi("v1758471803/production/65401681c66d810b8ce078a5/trctvihy43qqd4ijq8m6.jpg"),
      gi("v1756166040/production/65401681c66d810b8ce078a5/r0qzlk3pxmax847rvbhk.jpg"),
      gi("v1712886868/production/65401681c66d810b8ce078a5/gsu9k2oqkdzcphok88xs.jpg"),
      gi("v1764195687/production/65401681c66d810b8ce078a5/whd1u8dvooqjbqu3dxj7.jpg"),
      gi("v1774305837/production/65401681c66d810b8ce078a5/vm4qhecd3mmpoufuw8jl.jpg"),
    ],
  },
  {
    slug: "mantaray-residence",
    gid: "681e84e4950c04001414176f",
    name: "MantaRay Residence",
    area: "Tulum · Soliman Bay",
    style: "Beachfront villa",
    guests: 10,
    bedrooms: 3,
    bathrooms: 4,
    hook: "A private three bedroom oceanfront villa with its own ocean-view pool.",
    overview: ["A private villa overlooking the Caribbean with a private ocean-view pool and direct access to a peaceful bay.", "Three bedrooms for family and friends."],
    amenities: ["Private ocean-view pool", "Direct bay access", "Oceanfront", "Caribbean views"],
    images: [
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/dca4b06e-126f-4d-3bbtI"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/5ae67d43-81bf-4c-eTQs6"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/2f555aba-7cf0-47-KwQrI"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/8c6e8815-7307-41-EAtPt"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/a9657d7b-a0d8-49-gHZku"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/2fcc75e1-bff9-43-KKorM"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/7727d16a-109c-4a-I0eyY"),
      gi("listing_images_s3/production/property-photos/37f68880503fd8909b40748904e634d76a83c5d0569f89c1/681e84e4950c04001414176f/56c4cc6d-5e41-4f-kOAeK"),
    ],
  },
];

/* ------------------------------------------------------------------ SERVICES
 * Each service gets its own page at /<slug>. Items = the cards on that page.
 */
export type ServiceItem = {
  name: string;
  meta?: string; // e.g. "Up to 15 guests"
  price?: string; // e.g. "From $38,000 MXN" (leave empty until Hector confirms)
  cost?: number; // our cost in MXN (optional, not displayed)
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

/* ------------------------------------------------------------------ FLEET (boat charters)
 * Rates are NOT stored here on purpose. Every boat is "rate on request" and quotes go through WhatsApp.
 * Photos live in public/assets/boats/<slug>-<n>.webp (first one is the cover).
 */
export type Boat = {
  slug: string;
  name: string;
  kind: "Catamaran" | "Motor yacht";
  ft: number;
  guests: number; // included in the base rate
  maxGuests: number;
  badge?: string;
  blurb: string;
  features: string[];
  photos: string[];
};

const bp = (slug: string, n: number) => Array.from({ length: n }, (_, i) => u(`/assets/boats/${slug}-${i + 1}.webp`));

export const boats: Boat[] = [
  {
    slug: "lagoon-41", name: "Lagoon 41", kind: "Catamaran", ft: 41, guests: 15, maxGuests: 22, badge: "Top rated",
    blurb: "Our top rated catamaran. Shaded cockpit, wide trampolines and room to spread out.",
    features: ["WiFi and Bluetooth audio", "Snorkel gear and paddle boards", "Open bar"],
    photos: bp("lagoon-41", 10),
  },
  {
    slug: "chapter-two", name: "Chapter Two", kind: "Catamaran", ft: 45, guests: 15, maxGuests: 30, badge: "Premium open bar",
    blurb: "The largest Lagoon in the fleet. Flybridge helm, big sun pads and a wide teak cockpit.",
    features: ["Premium open bar", "Fits up to 30 guests", "Reduced rate for small groups"],
    photos: bp("chapter-two", 6),
  },
  {
    slug: "bang-bang-lulu", name: "Bang Bang Lulu", kind: "Catamaran", ft: 42, guests: 15, maxGuests: 25, badge: "Premium open bar",
    blurb: "Modern Lagoon 42 with a panoramic salon, a front lounge and nets over the water.",
    features: ["Premium open bar", "Panoramic salon", "Front sun pads and trampolines"],
    photos: bp("bang-bang", 7),
  },
  {
    slug: "blue-iris", name: "Blue Iris", kind: "Catamaran", ft: 40, guests: 15, maxGuests: 20, badge: "Premium open bar",
    blurb: "Lagoon 40 that sails properly. Good for couples and mid size groups.",
    features: ["Premium open bar", "Sails under full canvas", "Front lounge and trampolines"],
    photos: bp("blue-iris", 4),
  },
  {
    slug: "leopard-47", name: "Leopard 47", kind: "Catamaran", ft: 47, guests: 15, maxGuests: 35, badge: "Most guests",
    blurb: "The big group boat. Open front deck, a full salon and space for up to 35.",
    features: ["Babies free, kids 2 to 6 half price", "Vegetarian and vegan menu", "Fits up to 35 guests"],
    photos: bp("leopard-47", 8),
  },
  {
    slug: "sea-ray-flybridge-48", name: "Sea Ray Flybridge 48", kind: "Motor yacht", ft: 48, guests: 15, maxGuests: 20, badge: "Flybridge",
    blurb: "Flybridge cruiser with an upper deck for the best view and a stern made for swimming.",
    features: ["Upper deck lounge", "Fits up to 20 guests", "Open bar"],
    photos: bp("flybridge-48", 9),
  },
  {
    slug: "sea-ray-sundancer-48", name: "Sea Ray Sundancer 48", kind: "Motor yacht", ft: 48, guests: 15, maxGuests: 20,
    blurb: "Sundancer with a wraparound cockpit, a bow sun pad and a cabin below.",
    features: ["Wraparound cockpit seating", "Fits up to 20 guests", "Open bar"],
    photos: bp("sundancer-48", 7),
  },
  {
    slug: "sea-ray-55", name: "Sea Ray 55", kind: "Motor yacht", ft: 55, guests: 12, maxGuests: 22, badge: "Biggest yacht",
    blurb: "Our largest motor yacht. Lounge seating, a full galley and bunks below.",
    features: ["Children's menu available", "Coast or Cozumel day trips", "Fits up to 22 guests"],
    photos: bp("sea-ray-55", 12),
  },
];

export const services: Service[] = [
  {
    slug: "tulum-festival-season", num: "01", kicker: "Access", title: "VIP Event Access", icon: "ticket",
    short: "Zamna, Tehmplo, Day Zero and every high season night. Tickets, VIP tables and the plan around them.",
    cardCta: "See the nights", image: img.festival,
    h1: "VIP Event Access", intro: "", items: [], included: [], notes: [],
  },
  {
    slug: "transportation", num: "02", kicker: "Transit", title: "Ground Transportation", icon: "car",
    short: "Airport transfers, private drivers, Sprinters and SUVs for the group and every night out.",
    cardCta: "Get moving", image: img.transport,
    h1: "Private Ground Transportation in Tulum",
    intro: "From the moment you land to the last ride home after the after party. Tell us your flights and headcount.",
    items: [
      // Prices below are Transportation Services Tulum's rates (MXN) + site.transportMarkup. The markup itself is never shown.
      { name: "Tulum Airport (TQO) to Tulum centro", meta: `Private · 1 to 3 pax. 4 to 7 pax: ${mxn(withMarkup(1600))} in / ${mxn(withMarkup(1400))} out`, price: `${mxn(withMarkup(1400))} in · ${mxn(withMarkup(1200))} out` },
      { name: "Tulum Airport (TQO) to Hotel Zone", meta: `Private · 1 to 3 pax. 4 to 7 pax: ${mxn(withMarkup(1800))} in / ${mxn(withMarkup(1700))} out`, price: `${mxn(withMarkup(1700))} in · ${mxn(withMarkup(1600))} out` },
      { name: "Cancún Airport (CUN) to Tulum centro", meta: `Private · 1 to 3 pax. 4 to 7 pax: ${mxn(withMarkup(2100))} each way`, price: `${mxn(withMarkup(1900))} each way` },
      { name: "Cancún Airport (CUN) to Hotel Zone", meta: `Private · 1 to 3 pax. 4 to 7 pax: ${mxn(withMarkup(2400))} each way`, price: `${mxn(withMarkup(2100))} each way` },
      { name: "Event night rides", meta: "Round trip to Zamna, Tehmplo, Day Zero and the beach clubs" },
      { name: "Hourly driver", meta: "SUV or Sprinter · Nights out and day trips" },
    ],
    included: ["Bilingual drivers", "Meet & greet", "Water on board"],
    notes: [
      { label: "Pricing", text: "Per vehicle, not per person. Event nights and other routes quoted on request." },
      { label: "Extras", text: "Night transfers (12 AM to 6 AM), extra waiting time, pet carriers and terminal changes carry a small extra charge. We confirm everything before you book." },
      { label: "Cancellations", text: "Cancel more than 3 hours before pickup at no charge." },
    ],
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
    cardCta: "See the fleet", image: u("/assets/boats/leopard-47-1.webp"),
    h1: "Tulum Yacht & Catamaran Charters",
    intro: "Eight private boats, from a 40 ft catamaran to a 55 ft yacht and a catamaran for 35. Tell us the date, the headcount and the vibe and we match you with the right one.",
    items: boats.map((b) => ({ name: b.name, meta: `${b.kind} · ${b.ft} ft · Up to ${b.maxGuests} guests`, badge: b.badge })),
    included: ["Captain, crew, chef & host", "Open bar", "Snorkel gear & paddle boards", "Photographer with drone"],
    notes: [
      { label: "Pricing", text: "Rates depend on the boat, group size and hours. Send us the date and headcount and we quote direct." },
      { label: "Duration", text: "Charters run from 3 to 8 hours. Day trips to Cozumel available on select boats." },
    ],
  },
];

export const serviceBySlug = (s: string) => services.find((x) => x.slug === s && x.items.length);

/* ------------------------------------------------------------------ EVENTS (High Season 2027)
 * Source: "Tulum High Season Calendar 2027" sheet in the Connected Drive.
 * ready: true  = flyer + info are ready (sheet: "Flyer at Drive = Yes"). Shown as a full flyer card.
 * ready: false = date is on the calendar but details are not out yet. Calendar + table inquiry only.
 * Per event: flyer (image path in /public/assets, optional: otherwise a designed poster is drawn),
 * ticketUrl (promoter / affiliate link), lineup, time, prices (MXN).
 * "Get tickets" -> ticketUrl, else the festival's link in site.promoterUrls, else a WhatsApp request.
 * manual: true = Hector processes the tickets by hand with the Zamna contact, so Get tickets is always a WhatsApp request.
 * key: true = headline night, shown in the big season scroller on the home page.
 */
export type EventType = "Dinner only" | "Dinner + party" | "Party only" | "Festival" | "Beach club" | "Night club";

export type TEvent = {
  date: string; // ISO yyyy-mm-dd
  title: string;
  venue: string;
  type?: EventType;
  lineup?: string;
  desc?: string;
  time?: string;
  ready?: boolean;
  prices?: { label: string; mxn: number }[]; // per person, Mexican pesos
  priceNote?: string;
  table?: string; // VIP table starting point, shown on the card
  flyer?: string;
  flyerVideo?: string; // optional looping video flyer (the flyer image is its poster)
  skipGrid?: boolean; // repeat of a weekly night: shown in the calendar, hidden from the card grids
  cta?: "reserve"; // restaurant / club nights: one "Request a reservation" button instead of tickets + table
  flyerH?: number; // flyer height when scaled to 900px wide (keeps the frame the flyer's own shape)
  ticketUrl?: string;
  festival?: "zamna" | "tehmplo" | "day-zero";
  tbd?: boolean;
  key?: boolean;
  manual?: boolean;
  bg?: string;
};

const rawEvents: TEvent[] = [
  // ---- Dec 31 · New Year's Eve
  { date: "2026-12-31", title: "NYE Dinner at Casa Malca", venue: "Casa Malca", type: "Dinner only", time: "8:00 PM", desc: "Beachfront dinner experience", flyer: u("/assets/flyers/casa-malca.webp"), flyerH: 1740, ready: true, manual: true, bg: img.villaBeach,
    prices: [{ label: "Adult, early", mxn: 4360 }, { label: "Child 6 to 12, early", mxn: 2183 }], priceNote: "Early rate through Dec 21. Regular $6,216 adult / $3,180 child. Includes VAT and service." },
  { date: "2026-12-31", title: "NYE at Nomade", venue: "Nomade", type: "Dinner + party", time: "7 PM to 8 AM", desc: "Beachfront dinner or party only. The ticket link covers both.", flyer: u("/assets/flyers/nomade.webp"), flyerH: 1600, ready: true, ticketUrl: "https://tf.link/j0pdyrjs", bg: img.villaBeach,
    prices: [{ label: "Dinner + party", mxn: 9000 }, { label: "Party only, early bird", mxn: 4200 }] },
  { date: "2026-12-31", title: "Renaissance Tulum NYE", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Ida Engberg, Maceo Plex, Sasha, Sébastien Léger, Sirsax, Unders, Vhaera", flyer: u("/assets/flyers/renaissance.webp"), flyerVideo: u("/assets/flyers/renaissance.mp4"), flyerH: 1600, ready: true, festival: "zamna", key: true, manual: true, bg: img.festival,
    prices: [{ label: "General, early", mxn: 1925 }, { label: "VIP, early", mxn: 4130 }], table: "Tables from $3,200 USD" },
  { date: "2026-12-31", title: "NYE at Papaya Playa Project", venue: "Papaya Playa Project", type: "Dinner + party", desc: "Beachfront dinner or party only. The ticket link covers both.", flyer: u("/assets/flyers/papaya.webp"), flyerH: 1200, ready: true, ticketUrl: "https://tf.link/fkosugyk", bg: img.beachClub,
    prices: [{ label: "Dinner + party, early", mxn: 9790 }, { label: "Party only, early bird", mxn: 4697 }] },
  { date: "2026-11-28", title: "Joezi at Ikal Arena", venue: "Ikal Arena", type: "Beach club", time: "9:00 PM", lineup: "Joezi", desc: "Wave Society presents Joezi", flyer: u("/assets/flyers/joezi.webp"), flyerH: 1601, ready: true, manual: true, ticketUrl: "https://tf.link/dplgcklt", bg: img.party },
  { date: "2026-12-30", title: "Darco at Bonbonniere", venue: "Bonbonniere Tulum", type: "Night club", time: "10:00 PM", lineup: "Darco, Renê, Gio de Lira", desc: "Renê / Gio de Lira", flyer: u("/assets/flyers/darco.webp"), flyerH: 1600, ready: true, manual: true, bg: img.party },
  { date: "2026-12-31", title: "Le Tropical NYE at Bagatelle", venue: "Bagatelle Tulum", type: "Dinner + party", time: "Doors 10:00 PM", lineup: "Guy Gerber, Kimonos, Monobase, Story Behind", desc: "Guy Gerber / Kimonos", flyer: u("/assets/flyers/le-tropical.webp"), flyerH: 1600, ready: true, manual: true, bg: img.beachClub },
  { date: "2026-12-31", title: "NYE at Ahau", venue: "Ahau Tulum", type: "Dinner + party", time: "10:00 PM", desc: "Ahau's New Year's White Party. Curated by David Graziano, produced by Set Underground. Lineup announced soon", flyer: u("/assets/flyers/ahau-nye.webp"), flyerH: 1200, ready: true, manual: true, ticketUrl: "https://tf.link/zjaeicbn", bg: img.beachClub },
  { date: "2026-12-26", title: "Gala Ibiza at Bagatelle", venue: "Bagatelle Tulum", type: "Dinner + party", time: "8:00 PM", lineup: "Ibán Mendoza, Marco Norma, Sidartha Siliceo, Ananta", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2026-12-27", title: "Pendulum: Steve Lawler at Bagatelle", venue: "Bagatelle Tulum", type: "Dinner + party", time: "Doors 7:00 PM", lineup: "Steve Lawler, Jesse Zotti", flyer: u("/assets/flyers/pendulum.webp"), flyerH: 1600, ready: true, manual: true, bg: img.beachClub },
  { date: "2026-12-29", title: "Guy Mantzur presents Moments", venue: "Bagatelle Tulum", type: "Dinner + party", time: "8:00 PM", lineup: "Guy Mantzur, Rodriguez Jr., Eli Nissan, Ermakova", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2026-12-30", title: "Arodes at Bagatelle", venue: "Bagatelle Tulum", type: "Dinner + party", time: "8:00 PM", lineup: "Arodes, Loen, Negrinm", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2026-12-31", title: "NYE at Bonbonniere", venue: "Bonbonniere Tulum", type: "Night club", time: "10:00 PM", lineup: "Cuevas, Xandro", desc: "New Year's Eve, Beyond Temptation", flyer: u("/assets/flyers/bonbonniere-nye.webp"), flyerH: 1600, ready: true, manual: true, bg: img.party },
  // ---- January
  { date: "2027-01-01", title: "Maxi Meraki at Bonbonniere", venue: "Bonbonniere Tulum", type: "Night club", time: "10:00 PM", lineup: "Maxi Meraki, Miul, Fer Delgado", desc: "Miul / Fer Delgado", flyer: u("/assets/flyers/maxi-meraki.webp"), flyerH: 1600, ready: true, manual: true, bg: img.party },
  { date: "2027-01-01", title: "Tuluminecto", venue: "Kuul Tulum", type: "Beach club", time: "11:00 AM to 7:00 PM", flyer: u("/assets/flyers/tuluminecto.webp"), flyerH: 1117, ready: true, manual: true, ticketUrl: "https://tf.link/llw7zbgh", bg: img.beachClub },
  { date: "2027-01-02", title: "Amnesia 50 Years World Tour", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Josh Baker, DJ Tennis, Adam Ten, Mar-T, Natalia Roth and more", flyer: u("/assets/flyers/amnesia.webp"), flyerH: 1601, ready: true, festival: "zamna", manual: true, bg: img.festival },
  { date: "2027-01-02", title: "Afrodise Tulum", venue: "Ahau Tulum", type: "Festival", time: "2:00 PM to 1:00 AM", lineup: "Aaron Sevilla", desc: "Aaron Sevilla at Ahau", flyer: u("/assets/flyers/afrodise.webp"), flyerH: 1600, ready: true, manual: true, ticketUrl: "https://tf.link/rxaafes3", bg: img.beachClub },
  { date: "2027-01-02", title: "Por Que No Festival", venue: "Vesica Tulum", type: "Festival", time: "9 AM to 10 PM", lineup: "Indo Warehouse, Eran and more", desc: "Cenote festival, 2 stages", flyer: u("/assets/flyers/por-que-no.webp"), flyerH: 1600, ready: true, manual: true, ticketUrl: "https://www.eventbrite.com/e/1982357459525/?discount=connected20", bg: img.party },
  { date: "2027-01-04", title: "Monolink at Bagatelle", venue: "Bagatelle Tulum", type: "Festival", time: "Doors 7:00 PM", lineup: "Monolink, Gio de Lira, Renatta", desc: "Gio de Lira / Renatta", flyer: u("/assets/flyers/monolink.webp"), flyerH: 1600, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-05", title: "Mahmut Orhan at Bagatelle", venue: "Bagatelle Tulum", type: "Festival", time: "Doors 7:00 PM", lineup: "Mahmut Orhan, Renê, Spinoff", desc: "Renê / Spinoff", flyer: u("/assets/flyers/mahmut-orhan.webp"), flyerH: 1572, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-05", title: "Iluminal", venue: "Cenote", type: "Festival", time: "6:00 PM to 9:00 AM", lineup: "Traumer", desc: "Cenote festival", flyer: u("/assets/flyers/iluminal.webp"), flyerH: 1600, ready: true, manual: true, ticketUrl: "https://es-mx.ra.co/events/2567024?p=HECTORCONECCTED", bg: img.party },
  { date: "2027-01-03", title: "Por Que No Festival", venue: "Vesica Tulum", type: "Festival", time: "9 AM to 11 PM", lineup: "Améme, Matt Sassari, Savage & Shē and more", desc: "Cenote festival", flyer: u("/assets/flyers/por-que-no-jan3.webp"), flyerH: 1200, ready: true, manual: true, ticketUrl: "https://www.eventbrite.com/e/2001730130706/?discount=connected20", bg: img.party },
  { date: "2027-01-03", title: "&ME Tulum", venue: "Ikal Arena", type: "Festival", time: "8:00 PM", desc: "&ME", ticketUrl: "https://boletomovil.com/evento/and-me-tulum-2027-01-03?rp=AHCT", flyer: u("/assets/flyers/andme.webp"), flyerVideo: u("/assets/flyers/andme.mp4"), flyerH: 1125, ready: true, key: true, bg: img.party,
    prices: [{ label: "General, stage 1", mxn: 2900 }, { label: "Backstage, early bird", mxn: 4800 }] },
  { date: "2027-01-03", title: "Scenarios", venue: "Papaya Playa Project", type: "Festival", time: "9:00 PM", desc: "Papaya Playa Project presents One Eternal Flow", flyer: u("/assets/flyers/scenarios.webp"), flyerH: 1600, ready: true, manual: true, ticketUrl: "https://tf.link/ixtnvful", bg: img.beachClub },
  { date: "2027-01-04", title: "Anyma presents ÆDEN: The Lost Temple", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Anyma, CamelPhat, Cassian, Volkoder and more", flyer: u("/assets/flyers/anyma.webp"), flyerH: 1600, ready: true, festival: "zamna", key: true, manual: true, bg: img.party,
    prices: [{ label: "General, phase 1", mxn: 3325 }, { label: "VIP, early", mxn: 7158 }] },
  { date: "2027-01-05", title: "Cheetah Print", venue: "Papaya Playa Project", type: "Festival", time: "4:00 PM", desc: "Papaya Playa Project and Rafael present", flyer: u("/assets/flyers/cheetah-print.webp"), flyerH: 1600, ready: true, manual: true, ticketUrl: "https://tf.link/kelwkk5j", bg: img.beachClub },
  { date: "2027-01-05", title: "7 Realms", venue: "Kuul Tulum", type: "Festival", tbd: true },
  { date: "2027-01-06", title: "Black Coffee at Zamna Tulum", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Black Coffee", flyer: u("/assets/flyers/black-coffee.webp"), flyerH: 1600, ready: true, festival: "zamna", key: true, manual: true, bg: img.festival,
    prices: [{ label: "General, early", mxn: 2520 }, { label: "VIP, early", mxn: 7158 }] },
  { date: "2027-01-07", title: "Solomun Tulum at Tehmplo", venue: "Tehmplo", type: "Festival", time: "10:00 PM", lineup: "Solomun", flyer: u("/assets/flyers/solomun.webp"), flyerH: 1125, ready: true, festival: "tehmplo", key: true, bg: img.cenote,
    table: "Tables from $15,000 USD minimum spend" },
  { date: "2027-01-08", title: "Marco Carola at Bagatelle", venue: "Bagatelle Tulum", type: "Beach club", time: "Doors 7:00 PM", lineup: "Marco Carola, Renê, Maubo", desc: "Renê / Maubo", flyer: u("/assets/flyers/marco-carola.webp"), flyerH: 1600, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-08", title: "Adriatique presents X: FOREVER", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Adriatique, Kotiër, Mind Against, Sama, WhoMadeWho (hybrid DJ set)", flyer: u("/assets/flyers/adriatique.webp"), flyerVideo: u("/assets/flyers/adriatique.mp4"), flyerH: 1600, ready: true, festival: "zamna", key: true, manual: true, bg: img.party,
    prices: [{ label: "General, early", mxn: 2520 }, { label: "VIP, early", mxn: 7158 }] },
  { date: "2027-01-09", title: "Day Zero 2027: Begin Again", venue: "Cenote Dos Ojos", type: "Festival", time: "10:00 PM", lineup: "Several artists", flyer: u("/assets/flyers/day-zero.webp"), flyerH: 1125, ready: true, festival: "day-zero", key: true, manual: true, bg: img.cenote },
  { date: "2027-01-09", title: "Day Zero after party", venue: "Villas behind Tehmplo", type: "Party only", time: "TBA", tbd: true },
  { date: "2027-01-09", title: "Franky Rizardo at Bagatelle", venue: "Bagatelle Tulum", type: "Beach club", time: "Doors 7:00 PM", lineup: "Franky Rizardo, Dualité, Mauro Torretta", desc: "Dualité / Mauro Torretta", flyer: u("/assets/flyers/franky-rizardo.webp"), flyerH: 1608, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-10", title: "Adam Port, season closing", venue: "Zamna Tulum", type: "Festival", time: "10:00 PM", lineup: "Adam Port", flyer: u("/assets/flyers/adam-port.webp"), flyerH: 1600, ready: true, festival: "zamna", key: true, manual: true, bg: img.festival,
    prices: [{ label: "General, early", mxn: 1925 }, { label: "VIP, early", mxn: 7158 }] },
  { date: "2027-01-01", title: "Tripolism at Bagatelle", venue: "Bagatelle Tulum", type: "Dinner + party", time: "8:00 PM", lineup: "Ruben Alegre, Fer Delgado", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-02", title: "Yamagucci at Bagatelle", venue: "Bagatelle Tulum", type: "Beach club", time: "8:00 PM", lineup: "Yamagucci, Dor Danino, Xandro", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-02", title: "Tom & Collins at Bonbonniere", venue: "Bonbonniere Tulum", type: "Night club", time: "10:00 PM", lineup: "Tom & Collins, Cuevas, Xandro", flyer: u("/assets/flyers/tom-collins.webp"), flyerH: 1600, ready: true, manual: true, bg: img.party },
  { date: "2027-01-03", title: "Lee Burridge presents All Day I Dream", venue: "Bagatelle Tulum", type: "Beach club", time: "7:00 PM to 1:00 AM", lineup: "Lee Burridge", flyer: u("/assets/flyers/lee-burridge.webp"), flyerH: 1600, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-05", title: "Damian Lazarus at Bonbonniere", venue: "Bonbonniere Tulum", type: "Night club", time: "10:00 PM", lineup: "Damian Lazarus, Story Behind, Loen b2b Diaaz", flyer: u("/assets/flyers/damian-lazarus.webp"), flyerH: 1600, ready: true, manual: true, bg: img.party },
  { date: "2027-01-15", title: "Nevermind by Ten Ibiza", venue: "Bagatelle Tulum", type: "Beach club", time: "10:00 PM", lineup: "Oriol Calvo, Musumeci, Renê", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
  { date: "2027-01-16", title: "Kintar presents Summerians", venue: "Bagatelle Tulum", type: "Beach club", time: "10:00 PM", flyer: u("/assets/flyers/bagatelle-placeholder.webp"), flyerH: 1581, ready: true, manual: true, bg: img.beachClub },
];

export const events: TEvent[] = [...rawEvents].sort((a, b) => a.date.localeCompare(b.date));
export const readyEvents = events.filter((e) => e.ready);
export const soonEvents = events.filter((e) => !e.ready);

/* ------------------------------------------------------------------ TABLE MAPS
 * "View tables" button on the events that have a venue map. Files live in public/assets/tables.
 *   Zamna: one map + price page per night (every Zamna Tulum event), all nights as the fallback.
 *   Bagatelle: one page per night, Mahmut's page covers Jan 2 as well as Jan 5.
 *   &ME: the single Ikal Arena map. */
export type TableMap = { title: string; pages: { src: string; alt: string }[] };
const tbl = (name: string) => u(`/assets/tables/${name}.webp`);

const ZAMNA_NIGHTS: Record<string, { key: string; label: string }> = {
  "2026-12-31": { key: "dec31", label: "Renaissance, Dec 31" },
  "2027-01-02": { key: "jan2", label: "Amnesia, Jan 2" },
  "2027-01-04": { key: "jan4", label: "Anyma, Jan 4" },
  "2027-01-06": { key: "jan6", label: "Black Coffee, Jan 6" },
  "2027-01-08": { key: "jan8", label: "Adriatique, Jan 8" },
  "2027-01-10": { key: "jan10", label: "Adam Port, Jan 10" },
};
const zamnaPages = (n: { key: string; label: string }) => [
  { src: tbl(`zamna-${n.key}-map`), alt: `Zamna Tulum table map, ${n.label}` },
  { src: tbl(`zamna-${n.key}-packages`), alt: `Zamna Tulum table packages and prices, ${n.label}` },
];

const BAGATELLE_NIGHTS: Record<string, string> = {
  "2026-12-31": "dec31", "2027-01-02": "jan5", "2027-01-04": "jan4", "2027-01-05": "jan5", "2027-01-08": "jan8", "2027-01-09": "jan9",
};

export function tableMapFor(e: TEvent): TableMap | null {
  if (e.venue === "Zamna Tulum" || e.festival === "zamna") {
    const n = ZAMNA_NIGHTS[e.date];
    return n
      ? { title: `Zamna Tulum tables, ${n.label}`, pages: zamnaPages(n) }
      : { title: "Zamna Tulum tables, all nights", pages: Object.values(ZAMNA_NIGHTS).flatMap(zamnaPages) };
  }
  if (e.venue === "Bagatelle Tulum") {
    const k = BAGATELLE_NIGHTS[e.date] || "jan5";
    return { title: "Bagatelle Tulum tables", pages: [{ src: tbl(`bagatelle-${k}`), alt: "Bagatelle Tulum VIP table map and prices" }] };
  }
  if (e.venue === "Ikal Arena" && e.title.includes("&ME")) {
    return { title: "&ME Tulum tables", pages: [{ src: tbl("me-tulum"), alt: "&ME Tulum table map and prices, Ikal Arena" }] };
  }
  return null;
}

/** Where "Get tickets" goes. Returns null when it should be a WhatsApp request (manual or no link yet). */
export function ticketHref(e: TEvent): string | null {
  if (e.manual && !e.ticketUrl) return null;
  const url = e.ticketUrl || (e.festival ? site.promoterUrls[e.festival] : site.promoterUrls.other);
  return url || null;
}

export const marquee = ["Renaissance", "Anyma", "Black Coffee", "Solomun", "Adriatique", "&ME", "Day Zero", "Adam Port", "Casa Malca", "Nomade"];

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
  { q: "What else can Connected handle?", a: "Ground transportation, private events, restaurant and beach club reservations, and yachts. Villas are part of our own collection." },
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
    lead: "Jungle festival, beachfront dinner or a beach party. Every NYE option we have, with tickets and tables handled.",
    facts: [{ k: "Date", v: "Dec 31" }, { k: "Options", v: "Zamna, Nomade, Casa Malca, Papaya Playa Project, Ahau" }, { k: "Format", v: "Parties & festivals" }, { k: "Access", v: "Tickets & VIP tables" }],
    guide: howToBook, faqs: [{ q: "Which NYE party is best?", a: "Depends on the group and the sound. Tell us the vibe and we'll match you." }],
    image: img.beachClub,
    title: "Tulum NYE 2027 Parties & Tables | Connected Tulum",
    description: "Every New Year's Eve party in Tulum: Zamna Renaissance, Nomade, Casa Malca, Papaya Playa Project and Ahau. Tickets, dinners and VIP tables.",
  },
  {
    kind: "festival", slug: "zamna-tulum", festival: "zamna", eyebrow: "Official Zamna ticket seller · Zamna 2027",
    h1a: "Zamna.", h1b: "Monumental jungle.",
    lead: "The jungle festival that defines Tulum's high season. Connected Tulum is an official Zamna ticket seller: pick the night, we handle the table, the tickets and the ride.",
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
