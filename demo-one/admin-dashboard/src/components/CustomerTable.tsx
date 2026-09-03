"use client";

import { useState } from "react";
import type { BookingCustomer } from "@/types/business";
import { dateTime } from "@/components/BookingDetailPanel";
import { cn, formatDate } from "@/lib/utils";

interface CustomerTableProps {
  customers: BookingCustomer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const [selected, setSelected] = useState<BookingCustomer | null>(null);

  return (
    <div className="page-grid page-grid-2">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Bookings</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <p className="font-medium text-white">{customer.name}</p>
                  <p className="text-xs text-zinc-500">{customer.email}</p>
                  <p className="text-xs text-zinc-500">{customer.phone}</p>
                </td>
                <td>{customer.bookings.length}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>
                  <button className="btn-secondary" onClick={() => setSelected(customer)}>
                    View history
                  </button>
                </td>
              </tr>
            ))}
            {!customers.length && (
              <tr>
                <td colSpan={4}>No customers yet. Bookings from the customer website will appear here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="dashboard-card">
        {selected ? (
          <>
            <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">{selected.email} · {selected.phone}</p>
            <div className="mt-6 space-y-3">
              {selected.bookings.map((booking) => (
                <article key={booking.id} className="rounded-xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{booking.serviceName}</p>
                      <p className="text-xs text-zinc-500">{dateTime(booking.startAt)}</p>
                    </div>
                    <span className={cn("status-badge", booking.status === "PENDING" ? "bg-amber-500/15 text-amber-300" : booking.status === "CONFIRMED" ? "bg-emerald-500/15 text-emerald-300" : booking.status === "COMPLETED" ? "bg-sky-500/15 text-sky-300" : "bg-red-500/15 text-red-300")}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.message && <p className="mt-2 text-sm text-zinc-400">{booking.message}</p>}
                </article>
              ))}
              {!selected.bookings.length && <p className="text-zinc-400">No bookings yet.</p>}
            </div>
          </>
        ) : (
          <p className="text-zinc-400">Select a customer to view their booking history.</p>
        )}
      </div>
    </div>
  );
}
