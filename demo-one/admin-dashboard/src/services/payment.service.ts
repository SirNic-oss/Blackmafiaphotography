export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  provider: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-1001",
    amount: 7700,
    provider: "Stripe",
    status: "completed",
    createdAt: "2026-07-10",
  },
  {
    id: "PAY-002",
    orderId: "ORD-1002",
    amount: 4200,
    provider: "PayPal",
    status: "completed",
    createdAt: "2026-07-12",
  },
  {
    id: "PAY-003",
    orderId: "ORD-1003",
    amount: 6800,
    provider: "Stripe",
    status: "pending",
    createdAt: "2026-07-14",
  },
];

export async function getPayments(): Promise<Payment[]> {
  return mockPayments;
}
