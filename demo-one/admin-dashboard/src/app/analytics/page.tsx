"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AnalyticsChart from "@/components/AnalyticsChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const router = useRouter();
  const { data, loading } = useAnalytics();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  if (loading || !data) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Store performance and sales insights.</p>
      </div>

      <div className="page-grid page-grid-2 mb-6">
        <AnalyticsChart title="Monthly Revenue" data={data.revenueChart} />
        <AnalyticsChart title="Weekly Orders" data={data.ordersChart} color="#34d399" />
      </div>

      <AnalyticsChart title="Top Categories (%)" data={data.topCategories} color="#f472b6" />
    </AdminShell>
  );
}
