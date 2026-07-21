import { Invoice, InvoiceItem } from "../types";

export class InvoiceService {
  private static invoices = new Map<string, Invoice[]>();

  public static createInvoice(params: {
    userId: string;
    subscriptionId: string;
    customerName: string;
    customerEmail: string;
    items: InvoiceItem[];
    currency?: string;
  }): Invoice {
    const { userId, subscriptionId, customerName, customerEmail, items, currency = "USD" } = params;

    const subtotal = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    const tax = 0;
    const discount = 0;
    const total = subtotal + tax - discount;
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);

    const invoice: Invoice = {
      invoiceId: `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      subscriptionId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax,
      discount,
      total,
      currency,
      status: total === 0 ? "paid" : "open",
      createdAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      paidAt: total === 0 ? now.toISOString() : undefined,
    };

    const existing = this.invoices.get(userId) || [];
    this.invoices.set(userId, [invoice, ...existing]);
    return invoice;
  }

  public static getUserInvoices(userId: string): Invoice[] {
    return this.invoices.get(userId) || [];
  }
}
