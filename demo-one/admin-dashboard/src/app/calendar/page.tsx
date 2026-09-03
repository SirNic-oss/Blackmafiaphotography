"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import BookingCalendar from "@/components/BookingCalendar";
import BookingDetailPanel from "@/components/BookingDetailPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { getCalendarOverview, updateBooking } from "@/services/booking.service";
import type { Booking, BookingStatus } from "@/types/booking";
import type { CalendarOverview } from "@/types/business";
import { dateTime } from "@/components/BookingDetailPanel";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number) {
  const [year, mon] = month.split("-").map(Number);
  const date = new Date(year, mon - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const router = useRouter();
  const [month, setMonth] = useState(currentMonth());
  const [overview, setOverview] = useState<CalendarOverview | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = (targetMonth: string) => {
    setLoading(true);
    getCalendarOverview(targetMonth)
      .then(setOverview)
      .catch(() => setError("Could not load calendar data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    load(month);
  }, [router, month]);

  const dayData = selectedDate && overview ? overview.days[selectedDate] : null;

  const dayBookings = useMemo(() => {
    if (!dayData) return [];
    return dayData.bookings;
  }, [dayData]);

  async function changeStatus(booking: Booking, status: BookingStatus) {
    try {
      const updated = await updateBooking(booking.id, status);
      setSelectedBooking(updated);
      load(month);
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
      <div className="page-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Booking calendar</h1>
          <p>Availability, bookings, and blocked dates from the same backend the customer site uses.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setMonth((value) => shiftMonth(value, -1))}>Previous</button>
          <button className="btn-secondary" onClick={() => setMonth(currentMonth())}>Today</button>
          <button className="btn-secondary" onClick={() => setMonth((value) => shiftMonth(value, 1))}>Next</button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      {loading || !overview ? (
        <LoadingSpinner />
      ) : (
        <div className="page-grid page-grid-2">
          <BookingCalendar
            month={month}
            days={overview.days}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectBooking={setSelectedBooking}
          />
          <div className="dashboard-card">
            {selectedBooking ? (
              <BookingDetailPanel booking={selectedBooking} onStatusChange={changeStatus} />
            ) : selectedDate ? (
              <>
                <h2 className="text-lg font-semibold text-white">
                  {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-ZA", { weekday: "long", dateStyle: "long" })}
                </h2>
                <div className="mt-5 space-y-4">
                  {dayBookings.map((booking) => (
                    <button key={booking.id} className="calendar-day-booking-card" onClick={() => setSelectedBooking(booking)}>
                      <p className="font-medium text-white">{booking.serviceName}</p>
                      <p className="text-xs text-zinc-500">{booking.customer.name} · {dateTime(booking.startAt)}</p>
                      <span className="status-badge mt-2">{booking.status}</span>
                    </button>
                  ))}
                  {dayData?.blocks.map((block) => (
                    <div key={block.id} className="calendar-day-booking-card calendar-day-block-card">
                      <p className="font-medium text-white">Blocked period</p>
                      <p className="text-xs text-zinc-500">{dateTime(block.startAt)} – {dateTime(block.endAt)}</p>
                      <p className="text-xs text-zinc-500">{block.reason || "Unavailable"}</p>
                    </div>
                  ))}
                  {!dayBookings.length && !dayData?.blocks.length && (
                    <p className="text-zinc-400">
                      {dayData?.hasAvailability ? "This day has open booking slots." : "No bookings or blocks on this day."}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-zinc-400">Select a day or booking on the calendar to view details.</p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
