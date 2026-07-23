import api from "@/lib/api";
import type { Order, OrderStatus } from "@/types/order";

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<{ orders: Order[] }>("/api/orders");
  return data.orders.map((order) => ({
    ...order,
    customerEmail: order.email,
    items: order.items?.length ?? 0,
  })) as unknown as Order[];
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string,
  courier?: string
): Promise<Order> {
  const { data } = await api.patch<{ order: Order }>(`/api/orders/${id}/status`, {
    status,
    trackingNumber,
    courier,
  });
  return data.order;
}

export async function updateShipmentStatus(
  id: string,
  status: string,
  trackingNumber?: string,
  courier?: string
) {
  const { data } = await api.patch(`/api/orders/${id}/shipment`, {
    status,
    trackingNumber,
    courier,
  });
  return data;
}
