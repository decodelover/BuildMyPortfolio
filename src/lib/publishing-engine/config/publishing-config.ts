export class PublishingConfig {
  public static readonly engineVersion = "1.0.0";

  public static readonly defaultPlatform = "vercel";

  public static readonly baseDomain = "buildmyportfolio.app";

  public static readonly dnsTargets = {
    cname: "cname.buildmyportfolio.app",
    ipA: "76.76.21.21"
  };

  public static readonly defaultSecurityHeaders = {
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: res.cloudinary.com images.unsplash.com;"
  };

  public static readonly defaultCacheHeaders = {
    staticAssets: "public, max-age=31536000, immutable",
    htmlPages: "public, max-age=0, must-revalidate"
  };
}
