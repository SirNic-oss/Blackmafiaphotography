export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  items: number;
  createdAt: string;
}
