"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import CustomerTable from "@/components/CustomerTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const router = useRouter();
  const { customers, loading } = useCustomers();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Customers</h1>
        <p>View client information and booking history from the customer website.</p>
      </div>
      {loading ? <LoadingSpinner /> : <CustomerTable customers={customers} />}
    </AdminShell>
  );
}
