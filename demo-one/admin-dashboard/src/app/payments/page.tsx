"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency, formatDate, statusColor, cn } from "@/lib/utils";
import {
  approvePayment,
  getPayments,
  rejectPayment,
  requestNewProof,
  type Payment,
} from "@/services/payment.service";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .catch(() => setError("Unable to load payments."))
      .finally(() => setLoading(false));
  }, []);

  async function updatePayment(
    payment: Payment,
    action: "approve" | "reject" | "request-proof"
  ) {
    const needsNotes = action !== "approve";
    const notes = needsNotes
      ? window.prompt(
          action === "reject"
            ? "Reason for rejecting this payment:"
            : "Message for the customer requesting a new proof:"
        )
      : undefined;

    if (needsNotes && notes === null) return;
    if (action === "approve" && !window.confirm("Approve this payment?")) return;

    setUpdatingId(payment.id);
    setError("");
    try {
      const updated =
        action === "approve"
          ? await approvePayment(payment.id)
          : action === "reject"
            ? await rejectPayment(payment.id, notes || undefined)
            : await requestNewProof(payment.id, notes || undefined);

      setPayments((current) =>
        current.map((item) => (item.id === payment.id ? { ...item, ...updated } : item))
      );
    } catch {
      setError("Unable to update payment. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Payments</h1>
        <p>Review EFT proof of payment and update payment status.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Reference</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Proof</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-medium text-white">
                    {payment.order?.orderNumber || payment.orderId}
                  </td>
                  <td>{payment.order?.customerName || "—"}</td>
                  <td>{payment.paymentReference || "—"}</td>
                  <td>{payment.provider}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={cn("status-badge", statusColor(payment.status))}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>
                    {payment.proofUrl ? (
                      <a
                        href={payment.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-violet-300 hover:text-violet-200"
                      >
                        View proof
                      </a>
                    ) : (
                      <span className="text-zinc-500">Not uploaded</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={updatingId === payment.id || payment.status === "APPROVED"}
                        onClick={() => updatePayment(payment, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={updatingId === payment.id}
                        onClick={() => updatePayment(payment, "reject")}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={updatingId === payment.id}
                        onClick={() => updatePayment(payment, "request-proof")}
                      >
                        Request proof
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
