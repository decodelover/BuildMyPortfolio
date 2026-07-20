export class RobotsGenerator {
  public static generateRobotsTxt(baseUrl: string, allowIndexing: boolean = true): string {
    const cleanBase = baseUrl.replace(/\/$/, "");

    if (!allowIndexing) {
      return `User-agent: *\nDisallow: /\n`;
    }

    return `User-agent: *\nAllow: /\n\nSitemap: ${cleanBase}/sitemap.xml\n`;
  }
}
