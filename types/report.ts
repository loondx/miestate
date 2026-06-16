export type ReportStatus = "pending" | "in_progress" | "delivered";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface Report {
  id: string;
  buyerName: string;
  buyerPhone: string;
  propertyAddress: string;
  propertySlug?: string;
  packageType: "report" | "concierge";
  amount: number;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  reportStatus: ReportStatus;
  reportPdfUrl?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

/**
 * Revenue log entry. Razorpay payments auto-create one; builder commissions
 * (paid outside Razorpay) are added manually from the revenue page.
 */
export type TransactionType = "report" | "concierge" | "commission";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  name: string; // buyer or seller
  property?: string;
  date: string;
  status: "received" | "expected";
  createdAt: string;
}
