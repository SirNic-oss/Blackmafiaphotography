import type { Customer } from "@/types/customer";

const mockCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "Thabo Mokoena",
    email: "thabo@example.com",
    orders: 5,
    totalSpent: 22400,
    joinedAt: "2025-11-03",
    status: "active",
  },
  {
    id: "CUS-002",
    name: "Lerato Naidoo",
    email: "lerato@example.com",
    orders: 3,
    totalSpent: 12600,
    joinedAt: "2026-01-18",
    status: "active",
  },
  {
    id: "CUS-003",
    name: "James Wilson",
    email: "james@example.com",
    orders: 1,
    totalSpent: 6800,
    joinedAt: "2026-06-22",
    status: "active",
  },
  {
    id: "CUS-004",
    name: "Amahle Dlamini",
    email: "amahle@example.com",
    orders: 8,
    totalSpent: 45200,
    joinedAt: "2025-08-09",
    status: "inactive",
  },
];

export async function getCustomers(): Promise<Customer[]> {
  return mockCustomers;
}
