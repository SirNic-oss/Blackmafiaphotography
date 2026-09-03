export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  message: string | null;
  adminNotes: string | null;
  serviceName: string;
  customer: { id: string; name: string; email: string; phone: string };
  service: { id: string; name: string; durationMinutes: number };
}
export interface AvailabilityBlock { id: string; startAt: string; endAt: string; reason: string | null; }
