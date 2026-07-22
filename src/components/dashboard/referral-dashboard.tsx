"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/lib/firebase/auth";
import { Gift, Copy, Check, Users, Sparkles, Award } from "lucide-react";
import { toast } from "sonner";

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  availableRewardsCount: number;
  totalAvailableBonusCredits: number;
  rewards: Array<{
    rewardId: string;
    rewardType: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export function ReferralDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchReferralStats = async () => {
        try {
          const idToken = await auth.currentUser?.getIdToken();
          const response = await fetch("/api/billing/referrals/stats", {
            headers: { Authorization: `Bearer ${idToken || ""}` },
          });
          const data = await response.json();
          if (data.stats) {
            setStats(data.stats);
          }
        } catch (_err) {
          console.warn("Could not load referral stats.");
        }
      };
      fetchReferralStats();
    }
  }, [user]);

  const handleCopyLink = () => {
    if (!stats?.referralLink) return;
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    toast.success("Referral invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimReward = async (rewardId: string) => {
    if (!user) return;
    setClaimingId(rewardId);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/billing/referrals/redeem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rewardId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Claim failed.");

      toast.success(`Reward claimed successfully! +${data.result.claimedReward.amount} AI Credits added.`);

      // Refresh stats
      const statsRes = await fetch("/api/billing/referrals/stats", {
        headers: { Authorization: `Bearer ${idToken || ""}` },
      });
      const statsData = await statsRes.json();
      if (statsData.stats) setStats(statsData.stats);
    } catch (err: any) {
      toast.error(err.message || "Failed to claim referral reward.");
    } finally {
      setClaimingId(null);
    }
  };

  const referralCode = stats?.referralCode || (user ? `REF-${user.uid.substring(0, 6).toUpperCase()}` : "REF-GUEST");
  const inviteLink = stats?.referralLink || `https://buildmyportfolio.com/register?ref=${referralCode}`;

  return (
    <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Referral Rewards Program</h3>
            <p className="text-xs text-muted-foreground">Invite colleagues &amp; friends. Earn 100 Bonus AI Credits for every signup.</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20 self-start sm:self-auto">
          <Award className="h-3.5 w-3.5" />
          100 AI Credits / Referral
        </span>
      </div>

      {/* Unique Link & Code Copy Box */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground block">Your Unique Referral Invite Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="flex-1 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Invite Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" /> Total Referred Users
          </span>
          <span className="text-2xl font-black text-foreground block">{stats?.totalReferred || 0}</span>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Gift className="h-3.5 w-3.5 text-accent" /> Available Rewards
          </span>
          <span className="text-2xl font-black text-accent block">{stats?.availableRewardsCount || 0}</span>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Claimable Bonus Credits
          </span>
          <span className="text-2xl font-black text-foreground block">{stats?.totalAvailableBonusCredits || 0}</span>
        </div>
      </div>

      {/* Available Rewards Claim Table */}
      {stats?.rewards && stats.rewards.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Earned Referral Rewards</h4>
          <div className="space-y-2">
            {stats.rewards.map((rwd) => (
              <div key={rwd.rewardId} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-card text-xs">
                <div>
                  <span className="font-bold text-foreground">+{rwd.amount} AI Generation Credits</span>
                  <span className="text-muted-foreground block text-[10px]">
                    Issued {new Date(rwd.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {rwd.status === "available" ? (
                  <button
                    onClick={() => handleClaimReward(rwd.rewardId)}
                    disabled={claimingId === rwd.rewardId}
                    className="rounded-xl bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-foreground shadow hover:bg-accent/90 transition-all"
                  >
                    {claimingId === rwd.rewardId ? "Claiming..." : "Claim Bonus"}
                  </button>
                ) : (
                  <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Claimed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
