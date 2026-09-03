"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import BookingDetailPanel, { dateTime, statusClass } from "@/components/BookingDetailPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getBookings, updateBooking } from "@/services/booking.service";
import type { Booking, BookingStatus } from "@/types/booking";

const statuses: Array<BookingStatus | "ALL"> = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>("ALL");
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = () => {
    setLoading(true);
    getBookings()
      .then(setBookings)
      .catch(() => setError("Could not load bookings. Sign in again if your session has expired."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else load();
  }, [router]);

  const visible = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter !== "ALL" && booking.status !== statusFilter) return false;
      if (day && booking.startAt.slice(0, 10) !== day) return false;
      if (!search) return true;
      const query = search.toLowerCase();
      return (
        booking.customer.name.toLowerCase().includes(query) ||
        booking.customer.email.toLowerCase().includes(query) ||
        booking.serviceName.toLowerCase().includes(query)
      );
    });
  }, [bookings, day, search, statusFilter]);

  async function changeStatus(booking: Booking, status: BookingStatus) {
    try {
      const updated = await updateBooking(booking.id, status, selected?.id === booking.id ? selected.adminNotes || undefined : undefined);
      setBookings((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(updated);
    } catch (e: unknown) {
      setError(
        typeof e === "object" && e && "response" in e
          ? ((e as { response?: { data?: { error?: string } } }).response?.data?.error || "Could not update booking")
          : "Could not update booking"
      );
    }
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Bookings</h1>
        <p>View, filter, and manage all session bookings from the customer website.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <label className="form-field min-w-[180px]">
          <span className="text-sm text-zinc-400">Filter date</span>
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
        </label>
        <label className="form-field min-w-[220px]">
          <span className="text-sm text-zinc-400">Search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Client or session" />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "btn-primary" : "btn-secondary"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="page-grid page-grid-2">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <p className="text-white">{booking.serviceName}</p>
                      <p className="text-xs text-zinc-500">{dateTime(booking.startAt)}</p>
                    </td>
                    <td>
                      <p className="text-white">{booking.customer.name}</p>
                      <p className="text-xs text-zinc-500">{booking.customer.email}</p>
                    </td>
                    <td>
                      <span className={cn("status-badge", statusClass(booking.status))}>{booking.status}</span>
                    </td>
                    <td>
                      <button className="btn-secondary" onClick={() => setSelected(booking)}>Open</button>
                    </td>
                  </tr>
                ))}
                {!visible.length && (
                  <tr>
                    <td colSpan={4}>No bookings match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="dashboard-card">
            <BookingDetailPanel booking={selected} onStatusChange={changeStatus} />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
