export class RenderingConfig {
  public static readonly engineVersion = "1.0.0";

  public static readonly defaultBreakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  };

  public static readonly fallbackFonts = {
    headings: "Inter, system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
    mono: "Fira Code, monospace"
  };

  public static readonly defaultAnimationTiming = {
    durationMs: 300,
    staggerMs: 50,
    ease: "easeOut"
  };

  public static readonly defaultGridColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };
}
