/** Prefix a root-relative path with the deploy base (so the site works on a subpath like GitHub Pages). */
export const u = (p: string): string => {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base + p;
};
