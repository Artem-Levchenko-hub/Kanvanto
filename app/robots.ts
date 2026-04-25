import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kanavto.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/admin", "/api", "/booking/success"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
