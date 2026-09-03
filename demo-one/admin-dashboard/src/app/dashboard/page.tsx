"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  Clock3,
  Users,
  Camera,
  CalendarOff,
} from "lucide-react";
import AdminShell from "@/components/AdminShell";
import DashboardCard from "@/components/DashboardCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { dateTime } from "@/components/BookingDetailPanel";
import { isAuthenticated } from "@/lib/auth";
import { getBlocks, getBookings } from "@/services/booking.service";
import { getServices } from "@/services/business.service";
import type { Booking } from "@/types/booking";
import type { AvailabilityBlock } from "@/types/booking";

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    Promise.all([getBookings(), getBlocks(), getServices()])
      .then(([bookingData, blockData, services]) => {
        setBookings(bookingData);
        setBlocks(blockData);
        setServiceCount(services.filter((service) => service.active).length);
      })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, [router]);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = bookings.filter(
      (booking) => new Date(booking.startAt) >= now && ["PENDING", "CONFIRMED"].includes(booking.status)
    );
    const pending = bookings.filter((booking) => booking.status === "PENDING");
    const confirmed = bookings.filter((booking) => booking.status === "CONFIRMED");
    const completed = bookings.filter((booking) => booking.status === "COMPLETED");
    const cancelled = bookings.filter((booking) => booking.status === "CANCELLED");
    const upcomingBlocks = blocks.filter((block) => new Date(block.startAt) >= now);
    const uniqueCustomers = new Set(bookings.map((booking) => booking.customer.id)).size;
    return { upcoming, pending, confirmed, completed, cancelled, upcomingBlocks, uniqueCustomers };
  }, [bookings, blocks]);

  if (loading) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Overview</h1>
        <p>Live booking and availability data from your photography business.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      <div className="page-grid page-grid-4 mb-6">
        <DashboardCard title="Upcoming bookings" value={String(stats.upcoming.length)} change="Pending & confirmed" icon={CalendarClock} />
        <DashboardCard title="Pending" value={String(stats.pending.length)} change="Awaiting confirmation" icon={Clock3} trend="neutral" />
        <DashboardCard title="Confirmed" value={String(stats.confirmed.length)} change="Scheduled sessions" icon={CalendarCheck} trend="up" />
        <DashboardCard title="Completed" value={String(stats.completed.length)} change="Finished sessions" icon={CheckCircle2} />
      </div>

      <div className="page-grid page-grid-4 mb-6">
        <DashboardCard title="Cancelled" value={String(stats.cancelled.length)} change="All time" icon={CalendarX} trend="down" />
        <DashboardCard title="Blocked periods" value={String(stats.upcomingBlocks.length)} change="Upcoming unavailable dates" icon={CalendarOff} />
        <DashboardCard title="Customers" value={String(stats.uniqueCustomers)} change="With bookings" icon={Users} />
        <DashboardCard title="Active services" value={String(serviceCount)} change="Session packages" icon={Camera} />
      </div>

      <div className="page-grid page-grid-2">
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-white">Upcoming sessions</h2>
          <div className="mt-4 space-y-3">
            {stats.upcoming.slice(0, 6).map((booking) => (
              <div key={booking.id} className="flex items-start justify-between gap-3 border-b border-white/6 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="font-medium text-white">{booking.serviceName}</p>
                  <p className="text-xs text-zinc-500">{booking.customer.name}</p>
                  <p className="text-xs text-zinc-500">{dateTime(booking.startAt)}</p>
                </div>
                <span className="status-badge">{booking.status}</span>
              </div>
            ))}
            {!stats.upcoming.length && <p className="text-zinc-400">No upcoming bookings yet.</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-white">Upcoming unavailable dates</h2>
          <div className="mt-4 space-y-3">
            {stats.upcomingBlocks.slice(0, 6).map((block) => (
              <div key={block.id} className="border-b border-white/6 pb-3 last:border-none last:pb-0">
                <p className="font-medium text-white">
                  {new Date(block.startAt).toLocaleDateString("en-ZA", { dateStyle: "medium" })}
                </p>
                <p className="text-xs text-zinc-500">
                  {dateTime(block.startAt)} – {dateTime(block.endAt)}
                </p>
                <p className="text-xs text-zinc-500">{block.reason || "Blocked by admin"}</p>
              </div>
            ))}
            {!stats.upcomingBlocks.length && <p className="text-zinc-400">No blocked dates scheduled.</p>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
