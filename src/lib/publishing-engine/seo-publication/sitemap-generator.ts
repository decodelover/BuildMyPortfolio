export class SitemapGenerator {
  public static generateSitemapXML(routes: Array<{ path: string }>, baseUrl: string): string {
    const cleanBase = baseUrl.replace(/\/$/, "");
    const today = new Date().toISOString().split("T")[0];

    const urlElements = routes
      .map((r) => {
        const fullUrl = `${cleanBase}${r.path.startsWith("/") ? r.path : `/${r.path}`}`;
        return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${r.path === "/" ? "1.0" : "0.8"}</priority>\n  </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlElements}\n</urlset>`;
  }
}
