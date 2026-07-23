export type OrderStatus =
  | "ORDER_RECEIVED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "SUPPLIER_PROCESSING"
  | "PACKED"
  | "COLLECTED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "AWAITING_PAYMENT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PROOF_REQUESTED";

export interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  subtotal: number;
  shipping: number;
  vat: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber: string | null;
  courier: string | null;
  items: OrderItem[];
  createdAt: string;
}
