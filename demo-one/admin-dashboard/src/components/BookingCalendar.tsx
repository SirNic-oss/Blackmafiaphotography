"use client";

import { useMemo } from "react";
import type { Booking } from "@/types/booking";
import type { CalendarDay } from "@/types/business";
import { cn } from "@/lib/utils";
import { statusClass } from "./BookingDetailPanel";

interface BookingCalendarProps {
  month: string;
  days: Record<string, CalendarDay>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectBooking: (booking: Booking) => void;
}

function monthLabel(month: string) {
  const [year, mon] = month.split("-").map(Number);
  return new Date(year, mon - 1, 1).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

function weekdayHeaders() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

export default function BookingCalendar({
  month,
  days,
  selectedDate,
  onSelectDate,
  onSelectBooking,
}: BookingCalendarProps) {
  const cells = useMemo(() => {
    const [year, mon] = month.split("-").map(Number);
    const firstDay = new Date(year, mon - 1, 1);
    const daysInMonth = new Date(year, mon, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const result: Array<{ date: string | null; data?: CalendarDay }> = [];
    for (let i = 0; i < startOffset; i++) result.push({ date: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${String(day).padStart(2, "0")}`;
      result.push({ date, data: days[date] });
    }
    return result;
  }, [month, days]);

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h2>{monthLabel(month)}</h2>
        <div className="calendar-legend">
          <span><i className="legend-dot legend-available" /> Available</span>
          <span><i className="legend-dot legend-pending" /> Pending</span>
          <span><i className="legend-dot legend-confirmed" /> Confirmed</span>
          <span><i className="legend-dot legend-blocked" /> Blocked</span>
        </div>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {weekdayHeaders().map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, index) => {
          if (!cell.date) return <div key={`empty-${index}`} className="calendar-cell calendar-cell-empty" />;
          const dayData = cell.data;
          const pending = dayData?.bookings.filter((b) => b.status === "PENDING").length ?? 0;
          const confirmed = dayData?.bookings.filter((b) => b.status === "CONFIRMED").length ?? 0;
          const cancelled = dayData?.bookings.filter((b) => b.status === "CANCELLED").length ?? 0;
          const blocked = (dayData?.blocks.length ?? 0) > 0;
          const available = dayData?.hasAvailability && !blocked;
          const isSelected = selectedDate === cell.date;

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date!)}
              className={cn(
                "calendar-cell",
                isSelected && "calendar-cell-selected",
                blocked && "calendar-cell-blocked",
                available && !blocked && "calendar-cell-available"
              )}
            >
              <span className="calendar-day-number">{Number(cell.date.slice(8))}</span>
              <div className="calendar-day-events">
                {pending > 0 && <span className="calendar-pill calendar-pill-pending">{pending} pending</span>}
                {confirmed > 0 && <span className="calendar-pill calendar-pill-confirmed">{confirmed} confirmed</span>}
                {cancelled > 0 && <span className="calendar-pill calendar-pill-cancelled">{cancelled} cancelled</span>}
                {blocked && <span className="calendar-pill calendar-pill-blocked">Blocked</span>}
              </div>
              {dayData?.bookings.slice(0, 2).map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  className={cn("calendar-booking-link", statusClass(booking.status))}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectBooking(booking);
                  }}
                >
                  {booking.serviceName}
                </button>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
