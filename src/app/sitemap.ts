import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buildmyportfolio.com";

  const routes = [
    "",
    "/features",
    "/pricing",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/features" || route === "/pricing" ? 0.9 : 0.7,
  }));
}
