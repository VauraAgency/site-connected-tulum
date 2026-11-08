import { u } from "../../lib/url";
import { Arrow } from "./ui";

/* Flowing ribbon lines in the Connected greens, with a few glowing beams.
 * Deterministic math only (no Math.random) so server and client render the same markup. */
const W = 1600, H = 620, PTS = 64;
const r1 = (n: number) => Math.round(n * 10) / 10;

type Rib = { base: number; amp: number; lam: number; ph: number; spread: number; tw: number; tph: number; lines: number; grad: string; op: number; drift: string };

const ribs: Rib[] = [
  { base: 150, amp: 170, lam: 300, ph: 0.3, spread: 3.4, tw: 0.8, tph: 1.2, lines: 46, grad: "vb-a", op: 0.85, drift: "vb-d1" },
  { base: 320, amp: 150, lam: 250, ph: 2.1, spread: 3.0, tw: 0.9, tph: 0.4, lines: 44, grad: "vb-b", op: 0.8, drift: "vb-d2" },
  { base: 480, amp: 160, lam: 360, ph: 4.2, spread: 3.5, tw: 0.75, tph: 2.4, lines: 42, grad: "vb-c", op: 0.75, drift: "vb-d3" },
];

function ribPath(r: Rib, k: number) {
  const off = k - (r.lines - 1) / 2;
  let d = "";
  for (let i = 0; i <= PTS; i++) {
    const x = (i / PTS) * (W + 200) - 100;
    const cy = r.base + r.amp * Math.sin(x / r.lam + r.ph) + 28 * Math.sin(x / (r.lam * 0.43) + r.ph * 1.7);
    const sp = r.spread * (1 + r.tw * Math.sin(x / (r.lam * 1.35) + r.tph));
    const y = cy + off * sp;
    d += (i ? "L" : "M") + r1(x) + " " + r1(y);
  }
  return d;
}

const stars = Array.from({ length: 34 }, (_, i) => ({
  x: r1(((i * 211) % 1590) + 5),
  y: r1(((i * 137) % 600) + 8),
  r: r1(0.6 + ((i * 7) % 5) * 0.28),
  d: r1((i % 9) * 0.6),
}));

export function VauraBeams() {
  const beams = [
    { rib: 0, line: 10, dur: 7.5, delay: 0 },
    { rib: 1, line: 20, dur: 9, delay: 2.2 },
    { rib: 2, line: 8, dur: 8, delay: 4.5 },
    { rib: 0, line: 25, dur: 10.5, delay: 6 },
    { rib: 1, line: 6, dur: 8.5, delay: 3.4 },
  ];
  return (
    <section className="vb" aria-labelledby="vb-h">
      <svg className="vb__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="vb-a" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7dff2a" /><stop offset=".5" stopColor="#10f04a" /><stop offset="1" stopColor="#00dca6" />
          </linearGradient>
          <linearGradient id="vb-b" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#4fd8ff" /><stop offset=".3" stopColor="#00dca6" /><stop offset=".65" stopColor="#10f04a" /><stop offset="1" stopColor="#d4ff7a" />
          </linearGradient>
          <linearGradient id="vb-c" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#10f04a" /><stop offset=".45" stopColor="#2ee6c4" /><stop offset=".8" stopColor="#4fd8ff" /><stop offset="1" stopColor="#c8fff0" />
          </linearGradient>
          <linearGradient id="vb-beam" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#10f04a" stopOpacity="0" /><stop offset=".5" stopColor="#eafff0" /><stop offset="1" stopColor="#10f04a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vb-fade" cx=".5" cy=".5" r=".6">
            <stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
        </defs>
        <g className="vb__stars">
          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `${s.d}s` }} />)}
        </g>
        {ribs.map((r, ri) => (
          <g key={ri} className={`vb__rib ${r.drift}`} stroke={`url(#${r.grad})`} strokeWidth="1" fill="none" opacity={r.op}>
            {Array.from({ length: r.lines }, (_, k) => <path key={k} d={ribPath(r, k)} />)}
          </g>
        ))}
        <g className="vb__beams" fill="none" strokeLinecap="round">
          {beams.map((b, i) => (
            <g key={i} className={`vb__rib ${ribs[b.rib].drift}`}>
              <path d={ribPath(ribs[b.rib], b.line)} stroke="url(#vb-beam)" strokeWidth="2.2" pathLength={1000}
                style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} className="vb__beam" />
            </g>
          ))}
        </g>
      </svg>
      <div className="vb__shade" aria-hidden="true" />
      <div className="vb__in">
        <img className="vb__logo" src={u("/assets/vaura-logo.png")} alt="VAURA" width={560} height={367} />
        <p className="mono vb__k">Built by VAURA</p>
        <h3 id="vb-h" className="vb__h">Want a site like this <em className="accent">for your brand?</em></h3>
        <ul className="vb__chips" aria-label="What VAURA does">
          <li>Websites</li><li>Branding</li><li>Marketing</li><li>Photo &amp; video</li>
        </ul>
        <a className="cta-hero" href="https://vauraagency.com" target="_blank" rel="noopener">Visit VAURA <Arrow /></a>
      </div>
    </section>
  );
}
