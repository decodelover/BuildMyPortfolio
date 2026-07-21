import { UserSubscription } from "../types";
import { SubscriptionService } from "../services/subscription-service";

export class CancellationManager {
  public static cancelSubscription(userId: string, immediately: boolean = false): UserSubscription {
    return SubscriptionService.cancelSubscription(userId, immediately);
  }
}
