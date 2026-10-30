import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return createRouter({
    routeTree,
    basepath: base || "/",
    scrollRestoration: true,
    defaultPreload: "intent",
  });
}
