import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/how-it-works",
    "/idp-guide",
    "/required-documents",
    "/packages",
    "/faq",
    "/track",
    "/apply",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/refund-policy",
  ];
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
