// Downloads the placeholder images (generated in Higgsfield) into public/assets as optimized WebP.
// Runs automatically before every build. Files that already exist are skipped, so once you
// commit real photos to public/assets this script does nothing. Safe to delete later.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const A = "https://d8j0ntlcm91z4.cloudfront.net/user_3CN3UXh1D263zf8X3g6u6vZ47fu/";
const B = "https://d2ol7oe51mr4n9.cloudfront.net/user_3CN3UXh1D263zf8X3g6u6vZ47fu/";
const images = {
  "hero-canopy.webp": [A + "hf_20261030_022253_ad7d685c-4fb7-4672-b76d-b61b58361825.png", 1920],
  "villa-jungle.webp": [A + "hf_20261030_022200_cef31b22-137e-41ae-975e-67356ba55b59.png", 1400],
  "villa-modern.webp": [A + "hf_20261030_022253_9d0cd726-bfa9-4a0b-9870-220cb7f4d143.png", 1400],
  "villa-beach.webp": [A + "hf_20261030_022253_9f063eed-939b-4295-9300-8d2f3cc38dd7.png", 1400],
  "beach-club.webp": [A + "hf_20261030_022200_3c661062-e1a0-47f6-b378-b92b1325bce7.png", 1400],
  "chef.webp": [A + "hf_20261030_022200_9c61ba1c-19c0-4660-8ff3-87b380219133.png", 1400],
  "transport.webp": [A + "hf_20261030_022200_54800808-6b4a-4fc4-99e3-0012da3fcc6f.png", 1400],
  "festival.webp": [A + "hf_20261030_023050_cbb9b69b-c160-4fa2-8986-2223d37dab68.png", 1400],
  "boat.webp": [A + "hf_20261030_023048_1582b617-06cc-4a4a-9cc3-10f7266afc0b.png", 1400],
  "cenote.webp": [A + "hf_20261030_023048_d756a219-8491-4d8a-85ec-9fbbc140faa6.png", 1400],
  "spa.webp": [A + "hf_20261030_023055_64d655a9-c18b-4f4e-abc3-2b3b9bc00225.png", 1400],
  "party.webp": [A + "hf_20261030_024105_f15143f6-e286-4574-9280-56cd7684a000.png", 1400],
};
const raw = {
  "og.jpg": B + "12332be5-4f32-4ab0-8a84-b26e9a5a97b7.jpg",
  "favicon.png": B + "39e21fc1-0424-4e94-8d0e-b0d8b4cbca21.png",
  "apple-touch-icon.png": B + "62c6cc6b-f053-44d9-8f37-49073179ab52.png",
};

const dir = new URL("../public/assets/", import.meta.url);
mkdirSync(dir, { recursive: true });

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

let missing = 0;
for (const [name, [url, w]] of Object.entries(images)) {
  const out = new URL(name, dir);
  if (existsSync(out)) continue;
  try {
    const buf = await get(url);
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out.pathname);
    console.log("fetched", name);
  } catch (e) { missing++; console.warn("could not fetch", name, String(e)); }
}
for (const [name, url] of Object.entries(raw)) {
  const out = new URL(name, dir);
  if (existsSync(out)) continue;
  try { writeFileSync(out, await get(url)); console.log("fetched", name); }
  catch (e) { missing++; console.warn("could not fetch", name, String(e)); }
}
if (missing) console.warn(`${missing} asset(s) missing. Add them to public/assets manually.`);
