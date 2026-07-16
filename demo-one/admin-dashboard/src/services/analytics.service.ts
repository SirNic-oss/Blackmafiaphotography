import type { AnalyticsData } from "@/types/analytics";
import { getProducts } from "./product.service";
import { getOrders } from "./order.service";
import { getCustomers } from "./customer.service";

export async function getAnalytics(): Promise<AnalyticsData> {
  const [products, orders, customers] = await Promise.all([
    getProducts(),
    getOrders(),
    getCustomers(),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return {
    summary: {
      revenue,
      orders: orders.length,
      customers: customers.length,
      products: products.length,
      revenueChange: 12.4,
      ordersChange: 8.2,
    },
    revenueChart: [
      { label: "Jan", value: 42000 },
      { label: "Feb", value: 38000 },
      { label: "Mar", value: 51000 },
      { label: "Apr", value: 47000 },
      { label: "May", value: 62000 },
      { label: "Jun", value: 58000 },
      { label: "Jul", value: revenue },
    ],
    ordersChart: [
      { label: "Mon", value: 12 },
      { label: "Tue", value: 18 },
      { label: "Wed", value: 9 },
      { label: "Thu", value: 22 },
      { label: "Fri", value: 28 },
      { label: "Sat", value: 35 },
      { label: "Sun", value: 19 },
    ],
    topCategories: [
      { label: "Shoes", value: 45 },
      { label: "Outerwear", value: 28 },
      { label: "Accessories", value: 18 },
      { label: "Tops", value: 9 },
    ],
  };
}
