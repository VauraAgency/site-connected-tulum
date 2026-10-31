import { createFileRoute } from "@tanstack/react-router";
import { site, services, festivalPages, landingPages } from "../content/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const paths = [
          "/", "/villas", "/contact",
          ...services.filter((s) => s.items.length).map((s) => `/${s.slug}`),
          ...festivalPages.map((p) => `/${p.slug}`),
          ...landingPages.map((p) => `/${p.slug}`),
        ];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...paths.map((p) => `  <url><loc>${site.domain}${p}</loc><lastmod>${today}</lastmod></url>`),
          "</urlset>",
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
