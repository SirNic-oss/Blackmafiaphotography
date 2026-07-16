"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency, formatDate, statusColor, cn } from "@/lib/utils";
import { getPayments, type Payment } from "@/services/payment.service";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Payments</h1>
        <p>View payment transactions and provider status.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-medium text-white">{payment.id}</td>
                  <td>{payment.orderId}</td>
                  <td>{payment.provider}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={cn("status-badge", statusColor(payment.status))}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{formatDate(payment.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
