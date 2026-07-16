export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "inactive";
}
