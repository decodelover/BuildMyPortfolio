import { ReferralRecord, ReferralReward } from "../types";
import { UsageService } from "../services/usage-service";

export class ReferralService {
  private static userReferralCodes = new Map<string, string>(); // userId -> code
  private static codeToUserMap = new Map<string, string>(); // code -> userId
  private static referrals = new Map<string, ReferralRecord[]>(); // referrerUserId -> ReferralRecord[]
  private static rewards = new Map<string, ReferralReward[]>(); // userId -> ReferralReward[]

  public static getOrCreateReferralCode(userId: string): string {
    let code = this.userReferralCodes.get(userId);
    if (!code) {
      const cleanId = userId.substring(0, 6).toUpperCase();
      code = `REF-${cleanId}`;
      this.userReferralCodes.set(userId, code);
      this.codeToUserMap.set(code, userId);
    }
    return code;
  }

  public static recordReferral(referralCode: string, referredUserId: string, referredUserEmail: string): ReferralRecord {
    const referrerUserId = this.codeToUserMap.get(referralCode.toUpperCase());
    if (!referrerUserId) {
      throw new Error("Invalid or unknown referral code.");
    }

    // Security check: Self-referral prevention
    if (referrerUserId === referredUserId) {
      throw new Error("Self-referral is strictly prohibited.");
    }

    const record: ReferralRecord = {
      referralId: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      referrerUserId,
      referralCode: referralCode.toUpperCase(),
      referredUserId,
      referredUserEmail,
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const referrerList = this.referrals.get(referrerUserId) || [];
    referrerList.push(record);
    this.referrals.set(referrerUserId, referrerList);

    // Issue bonus reward (+100 AI credits) to referrer
    this.issueReferralReward(referrerUserId, "ai_credits", 100);

    return record;
  }

  public static issueReferralReward(userId: string, rewardType: "ai_credits" | "free_month" | "storage_bonus", amount: number): ReferralReward {
    const reward: ReferralReward = {
      rewardId: `rwd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      rewardType,
      amount,
      status: "available",
      createdAt: new Date().toISOString(),
    };

    const userRewards = this.rewards.get(userId) || [];
    userRewards.push(reward);
    this.rewards.set(userId, userRewards);

    return reward;
  }

  public static getReferralStats(userId: string) {
    const code = this.getOrCreateReferralCode(userId);
    const referralList = this.referrals.get(userId) || [];
    const rewardList = this.rewards.get(userId) || [];

    const totalReferred = referralList.length;
    const availableRewards = rewardList.filter((r) => r.status === "available");
    const claimedRewards = rewardList.filter((r) => r.status === "claimed");

    const totalAvailableBonusCredits = availableRewards
      .filter((r) => r.rewardType === "ai_credits")
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      userId,
      referralCode: code,
      referralLink: `https://buildmyportfolio.com/register?ref=${code}`,
      totalReferred,
      referrals: referralList,
      availableRewardsCount: availableRewards.length,
      claimedRewardsCount: claimedRewards.length,
      totalAvailableBonusCredits,
      rewards: rewardList,
    };
  }

  public static claimReward(userId: string, rewardId: string): { success: boolean; claimedReward: ReferralReward } {
    const userRewards = this.rewards.get(userId) || [];
    const reward = userRewards.find((r) => r.rewardId === rewardId);

    if (!reward) {
      throw new Error("Referral reward record not found.");
    }

    if (reward.status === "claimed") {
      throw new Error("Reward has already been claimed.");
    }

    reward.status = "claimed";
    reward.claimedAt = new Date().toISOString();

    // Apply reward effect (e.g. Add AI credits to usage allowance)
    if (reward.rewardType === "ai_credits") {
      UsageService.decrementUsage(userId, "aiCreditsUsed", reward.amount);
    }

    return { success: true, claimedReward: reward };
  }
}
