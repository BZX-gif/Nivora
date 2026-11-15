import type { MetadataRoute } from "next";
import { DEMO_PROPERTIES } from "@/data/demo-properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nivora.example";
  const staticRoutes = [
    "",
    "/buy",
    "/rent",
    "/explore",
    "/list-property",
    "/sign-in",
    "/sign-up",
    "/account",
    "/saved",
    "/dashboard",
    "/dashboard/listings",
    "/dashboard/enquiries",
    "/admin",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...DEMO_PROPERTIES.map((p) => ({
      url: `${base}/property/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
