import api from "@/lib/api";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  provider: string;
  status: string;
  paymentReference: string | null;
  proofUrl: string | null;
  proofFileName: string | null;
  adminNotes: string | null;
  createdAt: string;
  order?: {
    orderNumber: string;
    customerName: string;
    email: string;
  };
}

export async function getPayments(): Promise<Payment[]> {
  const { data } = await api.get<{ payments: Payment[] }>("/api/payments");
  return data.payments;
}

export async function approvePayment(id: string): Promise<Payment> {
  const { data } = await api.patch<{ payment: Payment }>(
    `/api/payments/${id}/approve`
  );
  return data.payment;
}

export async function rejectPayment(
  id: string,
  notes?: string
): Promise<Payment> {
  const { data } = await api.patch<{ payment: Payment }>(
    `/api/payments/${id}/reject`,
    { notes }
  );
  return data.payment;
}

export async function requestNewProof(
  id: string,
  notes?: string
): Promise<Payment> {
  const { data } = await api.patch<{ payment: Payment }>(
    `/api/payments/${id}/request-proof`,
    { notes }
  );
  return data.payment;
}
