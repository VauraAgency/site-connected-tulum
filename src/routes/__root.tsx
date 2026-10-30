import { u } from "../lib/url";
import {
  Outlet,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import siteCss from "../site.css?url";
import { Shell } from "../components/site/ui";


type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};
const appMeta: AppMeta = {
  og_title: "Connected Tulum",
  og_description: "Villas, VIP tables, High Season 2027 festivals, yachts and a 24/7 concierge in Tulum.",
  og_image_url: u("/assets/og.jpg"),
  favicon_url: u("/assets/logo-mark.svg"),
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400&family=Montserrat:wght@300;400&display=swap";

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? "Connected Tulum";
  const description = meta.og_description ?? "Villas, VIP tables, festivals and 24/7 concierge in Tulum.";
  const ogImage = meta.og_image_url ?? u("/assets/og.jpg");
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#050706" },
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: "Connected Tulum" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: FONTS },
      { rel: "stylesheet", href: siteCss },
      { rel: "icon", type: "image/svg+xml", href: meta.favicon_url ?? u("/assets/logo-mark.svg") },
      { rel: "icon", type: "image/png", sizes: "64x64", href: u("/assets/favicon.png") },
      { rel: "apple-touch-icon", href: u("/assets/apple-touch-icon.png") },
    ],
  };
}

function NotFoundComponent() {
  return (
    <Shell>
      <section className="page-head wrap" style={{ minHeight: "60vh" }}>
        <p className="eyebrow"><span className="eyebrow__rule" />404</p>
        <h1 className="h1">Lost in the <em className="accent">jungle</em>.</h1>
        <p className="sub">That page doesn't exist. Head back home or message the concierge.</p>
        <div className="hero__ctas"><a className="cta-hero" href={u("/")}>Back to home →</a></div>
      </section>
    </Shell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="page-head wrap" style={{ minHeight: "60vh" }}>
      <h1 className="h1">This page didn't <em className="accent">load</em>.</h1>
      <p className="sub">Try again, or head back home.</p>
      <div className="hero__ctas">
        <button className="cta-hero" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
        <a className="cta-ghost cta-ghost--dark" href={u("/")}>Go home</a>
      </div>
    </section>
  );
}

export const Route = createRootRoute({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body className="ct">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
