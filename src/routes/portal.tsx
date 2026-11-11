import { createFileRoute } from "@tanstack/react-router";
import { PortalApp } from "../components/portal/portal";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Team log | Connected Tulum" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <main id="main" className="ptw">
      <PortalApp />
    </main>
  ),
});
