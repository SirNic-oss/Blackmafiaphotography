import type { Booking, BookingStatus } from "./booking";

export interface PhotographyService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number | null;
  active: boolean;
  displayOrder: number;
}

export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  bookings: Booking[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  quote: string;
  rating: number;
  category: string | null;
  published: boolean;
  displayOrder: number;
}

export interface SiteSettings {
  id: string;
  businessName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  instagram: string | null;
  facebook: string | null;
  pinterest: string | null;
  about: string | null;
}

export interface CalendarDay {
  bookings: Booking[];
  blocks: { id: string; startAt: string; endAt: string; reason: string | null }[];
  hasAvailability: boolean;
}

export interface CalendarOverview {
  month: string;
  days: Record<string, CalendarDay>;
  defaultServiceId: string | null;
}

export type { BookingStatus };
