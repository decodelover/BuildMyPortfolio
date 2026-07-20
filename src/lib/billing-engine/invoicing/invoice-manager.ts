import { Invoice, InvoiceItem } from "../types";
import { TaxEngine } from "../taxes/tax-engine";

export class InvoiceManager {
  private static userInvoices = new Map<string, Invoice[]>();

  public static generateInvoice(
    userId: string,
    subscriptionId: string,
    customerName: string,
    customerEmail: string,
    items: InvoiceItem[],
    discountAmount: number = 0,
    countryCode: string = "US"
  ): Invoice {
    const subtotal = items.reduce((acc, item) => acc + item.amount * item.quantity, 0);
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);

    const { taxAmount } = TaxEngine.calculateTax(taxableSubtotal, countryCode);
    const total = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

    const now = new Date();
    const invoiceId = `inv-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const invoice: Invoice = {
      invoiceId,
      userId,
      subscriptionId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      currency: "USD",
      status: "paid",
      pdfUrl: `/invoices/${invoiceId}.pdf`,
      createdAt: now.toISOString(),
      dueDate: now.toISOString(),
      paidAt: now.toISOString()
    };

    const existing = this.userInvoices.get(userId) || [];
    existing.unshift(invoice);
    this.userInvoices.set(userId, existing);

    return invoice;
  }

  public static getUserInvoices(userId: string): Invoice[] {
    return this.userInvoices.get(userId) || [];
  }
}
