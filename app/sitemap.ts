import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/constants/services";
import { BRANCHES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kanavto.com";

  const staticRoutes = [
    "",
    "/services",
    "/services/diagnostika",
    "/locations",
    "/pricing",
    "/about",
    "/contacts",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: s.isFlagship ? 0.9 : 0.7,
  }));

  const branchRoutes = BRANCHES.map((b) => ({
    url: `${baseUrl}/locations/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...branchRoutes];
}
