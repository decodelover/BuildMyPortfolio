export class FeatureFlagService {
  private static flags = new Map<string, boolean>([
    ["ai_v2_generation", true],
    ["custom_domain_ssl_auto", true],
    ["resume_export_pdf", true],
    ["whitelabel_branding", true],
  ]);

  public static isEnabled(flagKey: string): boolean {
    return this.flags.get(flagKey) ?? true;
  }

  public static setFlag(flagKey: string, enabled: boolean): void {
    this.flags.set(flagKey, enabled);
  }
}
