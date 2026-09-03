import api from "@/lib/api";
import type {
  BookingCustomer,
  PhotographyService,
  SiteSettings,
  Testimonial,
} from "@/types/business";

export async function getServices(): Promise<PhotographyService[]> {
  return (await api.get<{ services: PhotographyService[] }>("/api/admin/services")).data.services;
}

export async function createService(data: Partial<PhotographyService>): Promise<PhotographyService> {
  return (await api.post<{ service: PhotographyService }>("/api/admin/services", data)).data.service;
}

export async function updateService(id: string, data: Partial<PhotographyService>): Promise<PhotographyService> {
  return (await api.patch<{ service: PhotographyService }>(`/api/admin/services/${id}`, data)).data.service;
}

export async function deactivateService(id: string): Promise<PhotographyService> {
  return (await api.delete<{ service: PhotographyService }>(`/api/admin/services/${id}`)).data.service;
}

export async function getBookingCustomers(): Promise<BookingCustomer[]> {
  return (await api.get<{ customers: BookingCustomer[] }>("/api/admin/customers")).data.customers;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await api.get<{ testimonials: Testimonial[] }>("/api/admin/testimonials")).data.testimonials;
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  return (await api.post<{ testimonial: Testimonial }>("/api/admin/testimonials", data)).data.testimonial;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
  return (await api.patch<{ testimonial: Testimonial }>(`/api/admin/testimonials/${id}`, data)).data.testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await api.delete(`/api/admin/testimonials/${id}`);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await api.get<{ settings: SiteSettings }>("/api/site-settings")).data.settings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  return (await api.put<{ settings: SiteSettings }>("/api/admin/site-settings", data)).data.settings;
}
