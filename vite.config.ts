import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// BASE_PATH is only set for subpath hosts like GitHub Pages (e.g. "/site-connected-tulum/").
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [
    tanstackStart({
      // Every page is pre-rendered to static HTML: fast, SEO friendly, deploys anywhere.
      prerender: { enabled: true, crawlLinks: true, failOnError: false },
    }),
    viteReact(),
  ],
});
