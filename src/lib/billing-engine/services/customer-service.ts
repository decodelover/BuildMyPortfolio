import { CustomerRecord } from "../types";

export class CustomerService {
  private static customers = new Map<string, CustomerRecord>();

  public static getOrCreateCustomer(userId: string, email: string, name: string): CustomerRecord {
    let customer = this.customers.get(userId);
    if (!customer) {
      const now = new Date().toISOString();
      customer = {
        customerId: `cust_${userId}`,
        userId,
        email,
        name,
        createdAt: now,
        updatedAt: now,
      };
      this.customers.set(userId, customer);
    }
    return customer;
  }

  public static updateCustomer(userId: string, updates: Partial<CustomerRecord>): CustomerRecord {
    const customer = this.getOrCreateCustomer(userId, updates.email || "", updates.name || "");
    const updated: CustomerRecord = {
      ...customer,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.customers.set(userId, updated);
    return updated;
  }
}
