import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/account", "/admin", "/list-property/success"],
      },
    ],
    sitemap: "https://nivora.example/sitemap.xml",
  };
}
