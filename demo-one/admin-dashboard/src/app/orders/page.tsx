"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import OrdersTable from "@/components/OrdersTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading } = useOrders();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Track and manage customer orders.</p>
      </div>
      {loading ? <LoadingSpinner /> : <OrdersTable orders={orders} />}
    </AdminShell>
  );
}
