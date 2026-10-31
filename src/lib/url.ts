/** Prefix a root-relative path with the deploy base (so the site works on a subpath like GitHub Pages). */
export const u = (p: string): string => {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base + p;
};

/** Two design variants are built side by side for review: "light" (classic) and "dark" (reference-style). */
export const VARIANT: "light" | "dark" = import.meta.env.VITE_VARIANT === "dark" ? "dark" : "light";
/** Absolute-ish URL of the other variant's home page (only set when both are deployed together). */
export const OTHER_URL: string = (import.meta.env.VITE_OTHER_URL as string) || "";
