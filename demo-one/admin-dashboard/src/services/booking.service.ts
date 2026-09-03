import api from "@/lib/api";
import type { AvailabilityBlock, Booking, BookingStatus } from "@/types/booking";
import type { CalendarOverview } from "@/types/business";

export async function getBookings(): Promise<Booking[]> { return (await api.get<{ bookings: Booking[] }>("/api/admin/bookings")).data.bookings; }
export async function updateBooking(id: string, status: BookingStatus, adminNotes?: string): Promise<Booking> { return (await api.patch<{ booking: Booking }>(`/api/admin/bookings/${id}`, { status, adminNotes })).data.booking; }
export async function getBlocks(): Promise<AvailabilityBlock[]> { return (await api.get<{ blocks: AvailabilityBlock[] }>("/api/admin/availability-blocks")).data.blocks; }
export async function createBlock(startAt: string, endAt: string, reason: string): Promise<AvailabilityBlock> { return (await api.post<{ block: AvailabilityBlock }>("/api/admin/availability-blocks", { startAt, endAt, reason })).data.block; }
export async function deleteBlock(id: string): Promise<void> { await api.delete(`/api/admin/availability-blocks/${id}`); }
export async function getCalendarOverview(month: string): Promise<CalendarOverview> {
  return (await api.get<CalendarOverview>("/api/admin/calendar", { params: { month } })).data;
}
