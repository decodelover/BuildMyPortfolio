import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buildmyportfolio.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/portfolio/manage/", "/verify-email/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
