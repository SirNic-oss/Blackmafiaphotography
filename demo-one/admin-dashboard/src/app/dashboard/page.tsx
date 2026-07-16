"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import DashboardCard from "@/components/DashboardCard";
import AnalyticsChart from "@/components/AnalyticsChart";
import OrdersTable from "@/components/OrdersTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useOrders } from "@/hooks/useOrders";

export default function DashboardPage() {
  const router = useRouter();
  const { data, loading } = useAnalytics();
  const { orders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  if (loading || !data) return <AdminShell><LoadingSpinner /></AdminShell>;

  const { summary } = data;

  return (
    <AdminShell>
      <div className="banner-card mb-6">
        <img src="/images/dashboard-banner.jpg" alt="Dashboard banner" />
        <div className="banner-overlay">
          <h1 className="text-2xl font-semibold">Welcome back, Admin</h1>
          <p className="text-zinc-300">Here&apos;s what&apos;s happening with Fashion-Fit today.</p>
        </div>
      </div>

      <div className="page-grid page-grid-4 mb-6">
        <DashboardCard
          title="Revenue"
          value={formatCurrency(summary.revenue)}
          change={`+${summary.revenueChange}% vs last month`}
          icon={DollarSign}
          trend="up"
        />
        <DashboardCard
          title="Orders"
          value={String(summary.orders)}
          change={`+${summary.ordersChange}% vs last week`}
          icon={ShoppingCart}
          trend="up"
        />
        <DashboardCard
          title="Customers"
          value={String(summary.customers)}
          change="Active accounts"
          icon={Users}
        />
        <DashboardCard
          title="Products"
          value={String(summary.products)}
          change="In inventory"
          icon={Package}
        />
      </div>

      <div className="page-grid page-grid-2 mb-6">
        <AnalyticsChart title="Revenue Overview" data={data.revenueChart} />
        <AnalyticsChart title="Orders This Week" data={data.ordersChart} color="#34d399" />
      </div>

      <div className="page-header">
        <h2 className="text-lg font-medium">Recent Orders</h2>
      </div>
      <OrdersTable orders={orders.slice(0, 4)} />
    </AdminShell>
  );
}
