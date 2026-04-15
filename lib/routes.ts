import { getSurfaceRoute, pmSurfaces } from "@/lib/stageConfig";

export type SiteRouteGroup = {
  label: string;
  items: Array<{
    label: string;
    href: string;
    description: string;
  }>;
};

export function getSiteRouteGroups(projectId = "bloomfast"): SiteRouteGroup[] {
  return [
    {
      label: "Core",
      items: [
        { label: "Home", href: "/", description: "Demo landing page" },
        { label: "Login", href: "/login", description: "Role access and sign in" },
        { label: "PM Root", href: "/pm", description: "Redirects to dashboard" },
        { label: "Dashboard", href: "/pm/dashboard", description: "Portfolio overview" }
      ]
    },
    {
      label: "BloomFast Project",
      items: pmSurfaces.map((surface) => ({
        label: surface.label,
        href: getSurfaceRoute(projectId, surface.slug),
        description: surface.description
      }))
    }
  ];
}
