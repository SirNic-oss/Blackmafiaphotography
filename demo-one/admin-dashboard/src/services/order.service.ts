import type { Order } from "@/types/order";

const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Thabo Mokoena",
    customerEmail: "thabo@example.com",
    total: 7700,
    status: "PAID",
    items: 2,
    createdAt: "2026-07-10",
  },
  {
    id: "ORD-1002",
    customerName: "Lerato Naidoo",
    customerEmail: "lerato@example.com",
    total: 4200,
    status: "SHIPPED",
    items: 1,
    createdAt: "2026-07-12",
  },
  {
    id: "ORD-1003",
    customerName: "James Wilson",
    customerEmail: "james@example.com",
    total: 6800,
    status: "PENDING",
    items: 1,
    createdAt: "2026-07-14",
  },
  {
    id: "ORD-1004",
    customerName: "Amahle Dlamini",
    customerEmail: "amahle@example.com",
    total: 10500,
    status: "DELIVERED",
    items: 3,
    createdAt: "2026-07-01",
  },
];

export async function getOrders(): Promise<Order[]> {
  return mockOrders;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const order = mockOrders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}
