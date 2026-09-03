"use client";

import type { Booking, BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export const dateTime = (value: string) =>
  new Date(value).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  });

export function statusClass(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/15 text-amber-300";
    case "CONFIRMED":
      return "bg-emerald-500/15 text-emerald-300";
    case "COMPLETED":
      return "bg-sky-500/15 text-sky-300";
    case "CANCELLED":
      return "bg-red-500/15 text-red-300";
  }
}

interface BookingDetailPanelProps {
  booking: Booking | null;
  onStatusChange: (booking: Booking, status: BookingStatus) => void;
  emptyMessage?: string;
}

export default function BookingDetailPanel({
  booking,
  onStatusChange,
  emptyMessage = "Select a booking to view and manage it.",
}: BookingDetailPanelProps) {
  if (!booking) {
    return <p className="text-zinc-400">{emptyMessage}</p>;
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-white">Booking details</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="text-zinc-500">Client</dt>
          <dd className="text-zinc-200">
            {booking.customer.name} · {booking.customer.phone}
          </dd>
          <dd className="text-xs text-zinc-500">{booking.customer.email}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Session</dt>
          <dd className="text-zinc-200">
            {booking.serviceName} · {dateTime(booking.startAt)}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd>
            <span className={cn("status-badge", statusClass(booking.status))}>{booking.status}</span>
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Client notes</dt>
          <dd className="text-zinc-200">{booking.message || "—"}</dd>
        </div>
        {booking.adminNotes && (
          <div>
            <dt className="text-zinc-500">Admin notes</dt>
            <dd className="text-zinc-200">{booking.adminNotes}</dd>
          </div>
        )}
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(booking, status)}
            className={status === booking.status ? "btn-primary" : "btn-secondary"}
          >
            {status === "CONFIRMED" ? "Confirm" : status === "COMPLETED" ? "Mark completed" : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </>
  );
}
