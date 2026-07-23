import api from "@/lib/api";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export async function getSubscribers(
  search?: string
): Promise<{ subscribers: NewsletterSubscriber[]; total: number }> {
  const { data } = await api.get<{
    subscribers: NewsletterSubscriber[];
    total: number;
  }>("/newsletter/subscribers", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function deleteSubscriber(id: string): Promise<void> {
  await api.delete(`/newsletter/subscribers/${id}`);
}

export async function exportSubscribersCsv(): Promise<void> {
  const response = await api.get("/newsletter/subscribers/export/csv", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "newsletter-subscribers.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
