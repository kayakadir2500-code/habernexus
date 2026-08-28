import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["Googlebot", "Googlebot-News", "Google-InspectionTool", "Bingbot"],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],
  };
}