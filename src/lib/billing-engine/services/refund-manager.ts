import { RefundRecord, PaymentProviderId } from "../types";
import { PaymentGatewayManager } from "./payment-gateway-manager";

export class RefundManager {
  public static async processRefund(
    providerId: PaymentProviderId,
    invoiceId: string,
    amount: number,
    reason: string
  ): Promise<RefundRecord> {
    const provider = PaymentGatewayManager.getProvider(providerId);
    return await provider.processRefund(invoiceId, amount, reason);
  }
}
