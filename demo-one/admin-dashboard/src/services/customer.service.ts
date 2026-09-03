import { getBookingCustomers } from "@/services/business.service";
import type { BookingCustomer } from "@/types/business";

export async function getCustomers(): Promise<BookingCustomer[]> {
  return getBookingCustomers();
}
