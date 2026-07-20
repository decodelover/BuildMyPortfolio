export class RouteResolver {
  public static resolveRoutePath(slug: string): string {
    if (!slug || slug === "home" || slug === "/") return "/";
    return slug.startsWith("/") ? slug : `/${slug}`;
  }
}
