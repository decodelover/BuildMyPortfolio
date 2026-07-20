export class BillingError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: string = "BILLING_ERROR", details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SubscriptionError extends BillingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "SUBSCRIPTION_ERROR", details);
  }
}

export class PaymentProcessingError extends BillingError {
  constructor(provider: string, message: string, details?: Record<string, any>) {
    super(`Payment processing failed on '${provider}': ${message}`, "PAYMENT_PROCESSING_ERROR", { provider, ...details });
  }
}

export class FeatureGatedError extends BillingError {
  constructor(featureKey: string, limit: number, currentUsage: number) {
    super(
      `Feature '${featureKey}' limit reached (${currentUsage}/${limit}). Please upgrade your subscription plan to continue.`,
      "FEATURE_GATED_ERROR",
      { featureKey, limit, currentUsage }
    );
  }
}

export class InvalidCouponError extends BillingError {
  constructor(code: string, reason: string) {
    super(`Coupon '${code}' is invalid: ${reason}`, "INVALID_COUPON_ERROR", { code, reason });
  }
}
