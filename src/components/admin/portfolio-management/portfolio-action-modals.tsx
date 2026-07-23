"use client";

import React, { useState } from "react";
import { AdminPortfolio, PortfolioVisibilityType } from "@/types/admin-portfolio";
import { X, Edit, UserCheck, AlertTriangle, Trash2 } from "lucide-react";

// Edit Portfolio Modal
interface EditPortfolioModalProps {
  portfolio: AdminPortfolio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<AdminPortfolio>) => void;
}

export function EditPortfolioModal({ portfolio, isOpen, onClose, onSave }: EditPortfolioModalProps) {
  if (!isOpen || !portfolio) return null;
  const [name, setName] = useState(portfolio.name);
  const [customDomain, setCustomDomain] = useState(portfolio.customDomain || "");
  const [visibility, setVisibility] = useState<PortfolioVisibilityType>(portfolio.visibility);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Edit className="w-4 h-4 text-primary" /> Edit Portfolio Metadata
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, customDomain, visibility });
            onClose();
          }}
          className="p-6 space-y-4 text-xs"
        >
          <div>
            <label className="font-bold text-muted-foreground block mb-1">Portfolio Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Custom Domain</label>
            <input
              type="text"
              placeholder="e.g. portfolio.alexmorgan.dev"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Visibility Level</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            >
              <option value="public">Public (Indexed &amp; Searchable)</option>
              <option value="private">Private (Owner Only)</option>
              <option value="unlisted">Unlisted (Link Access Only)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold bg-secondary rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold bg-primary text-primary-foreground rounded-xl shadow-xs">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Transfer Ownership Modal
interface TransferOwnershipModalProps {
  portfolio: AdminPortfolio | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newOwnerId: string, newOwnerEmail: string) => void;
}

export function TransferOwnershipModal({ portfolio, isOpen, onClose, onConfirm }: TransferOwnershipModalProps) {
  if (!isOpen || !portfolio) return null;
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-border bg-indigo-500/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-indigo-600 flex items-center gap-2">
            <UserCheck className="w-5 h-5" /> Transfer Portfolio Ownership
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(newOwnerId || `usr_${Date.now()}`, newOwnerEmail);
            onClose();
          }}
          className="p-6 space-y-4 text-xs"
        >
          <p className="text-muted-foreground">
            Transfer ownership of <span className="font-bold text-foreground">{portfolio.name}</span> from <span className="font-bold">{portfolio.ownerEmail}</span> to another registered user account.
          </p>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">New Owner Email Address</label>
            <input
              type="email"
              value={newOwnerEmail}
              onChange={(e) => setNewOwnerEmail(e.target.value)}
              placeholder="new.owner@example.com"
              required
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">New Owner User ID (Optional)</label>
            <input
              type="text"
              value={newOwnerId}
              onChange={(e) => setNewOwnerId(e.target.value)}
              placeholder="e.g. usr_1049"
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold bg-secondary rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-xl shadow-xs">
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Portfolio Modal
interface DeletePortfolioModalProps {
  portfolio: AdminPortfolio | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationName: string) => void;
}

export function DeletePortfolioModal({ portfolio, isOpen, onClose, onConfirm }: DeletePortfolioModalProps) {
  if (!isOpen || !portfolio) return null;
  const [inputVal, setInputVal] = useState("");
  const targetCheck = portfolio.name;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-border bg-rose-500/15 flex items-center justify-between">
          <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Permanently Delete Portfolio
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputVal.trim() !== targetCheck) return;
            onConfirm(inputVal);
            onClose();
          }}
          className="p-6 space-y-4 text-xs"
        >
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 font-semibold space-y-1">
            <p className="font-bold">WARNING: PERMANENT DATA ERASURE</p>
            <p>Deleting <span className="font-bold">{portfolio.name}</span> will purge all associated TSX ASTs, media uploads, and domain routes.</p>
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">
              Type <span className="font-mono text-foreground font-bold">{targetCheck}</span> to confirm:
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={targetCheck}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold bg-secondary rounded-xl">
              Cancel
            </button>
            <button
              type="submit"
              disabled={inputVal.trim() !== targetCheck}
              className="px-4 py-2 font-bold bg-rose-600 text-white rounded-xl disabled:opacity-40 shadow-xs"
            >
              Permanently Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
