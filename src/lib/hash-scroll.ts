import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Landing on "/#services" (or any /#section) from another page: the page above the section is still
 * settling (lazy images, the pinned season rotator measuring itself), so the router's one-shot scroll
 * lands a little low. Keep re-aligning to the section for a moment, instantly, until the layout stops
 * moving or the visitor scrolls themselves. Same-page hash clicks keep the normal smooth scroll.
 */
function alignToHash(hash: string): () => void {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return () => {};
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  let done = false;
  let stable = 0;
  const t0 = performance.now();
  const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  const finish = () => {
    if (done) return;
    done = true;
    html.style.scrollBehavior = prev;
    events.forEach((ev) => window.removeEventListener(ev, finish));
  };
  events.forEach((ev) => window.addEventListener(ev, finish, { passive: true }));
  const tick = () => {
    if (done) return;
    const el = document.getElementById(id);
    if (el) {
      const max = Math.max(0, html.scrollHeight - window.innerHeight);
      const y = Math.min(max, Math.max(0, el.getBoundingClientRect().top + window.scrollY));
      if (Math.abs(window.scrollY - y) > 2) { window.scrollTo(0, y); stable = 0; } else stable += 1;
    }
    if (stable > 25 || performance.now() - t0 > 3000) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return finish;
}

export function useHashScroll() {
  const { pathname, hash } = useRouterState({ select: (s) => s.location });
  const prevPath = useRef<string | null>(null);
  useEffect(() => {
    const changedPage = prevPath.current !== pathname;
    prevPath.current = pathname;
    if (!hash || !changedPage) return;
    return alignToHash(hash);
  }, [pathname, hash]);
}
