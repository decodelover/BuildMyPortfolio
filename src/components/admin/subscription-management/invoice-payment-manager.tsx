"use client";

import React, { useState, useEffect } from "react";
import { AdminInvoice, AdminPaymentTransaction } from "@/types/admin-billing";
import { FileText, DollarSign, Download, CheckCircle2, RefreshCw, Search, ShieldCheck } from "lucide-react";

export function InvoicePaymentManager() {
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [payments, setPayments] = useState<AdminPaymentTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "invoices") {
        const res = await fetch(`/api/admin/invoices?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        setInvoices(data.invoices || []);
      } else {
        const res = await fetch("/api/admin/payments");
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, search]);

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_paid", invoiceId }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "invoices"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Invoices Management
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "payments"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Payment Transactions History
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by customer or invoice #"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none"
            />
          </div>
          <button onClick={fetchData} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content Table */}
      {activeTab === "invoices" ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{inv.customerName}</div>
                    <div className="text-[11px] text-muted-foreground">{inv.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">${inv.amountDue.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {inv.status === "open" && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{tx.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{tx.customerName}</div>
                    <div className="text-[11px] text-muted-foreground">{tx.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">${tx.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-bold uppercase">{tx.paymentProvider}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      tx.status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
