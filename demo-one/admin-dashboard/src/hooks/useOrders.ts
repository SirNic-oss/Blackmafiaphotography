"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types/order";
import { getOrders } from "@/services/order.service";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, setOrders };
}
