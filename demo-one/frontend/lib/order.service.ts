import { api } from "./api";
import { CartItem } from "@/store/cartStore";

export interface CheckoutFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  postalCode: string;
}

export interface OrderResponse {
  message: string;
  order: {
    id: string;
    orderNumber: string;
    total: number;
  };
  paymentReference: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
  };
}

export async function createOrder(
  formData: CheckoutFormData,
  items: CartItem[]
): Promise<OrderResponse> {
  const { data } = await api.post<OrderResponse>("/api/orders", {
    ...formData,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  });
  return data;
}

export interface TrackingStep {
  status: string;
  label: string;
  completed: boolean;
  timestamp: string | null;
  description: string | null;
}

export interface TrackingResponse {
  order: {
    orderNumber: string;
    customerName: string;
    status: string;
    total: number;
    trackingNumber: string | null;
    courier: string | null;
    createdAt: string;
    items: Array<{ productName: string; quantity: number; price: number }>;
  };
  timeline: TrackingStep[];
}

export async function trackOrder(orderNumber: string): Promise<TrackingResponse> {
  const { data } = await api.get<TrackingResponse>(
    `/api/orders/track/${orderNumber}`
  );
  return data;
}

export interface PaymentDetails {
  payment: {
    id: string;
    paymentReference: string;
    status: string;
    amount: number;
    proofUrl: string | null;
  };
  order: {
    orderNumber: string;
    total: number;
    customerName: string;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
  };
}

export async function getPaymentDetails(
  orderNumber: string
): Promise<PaymentDetails> {
  const { data } = await api.get<PaymentDetails>(
    `/api/payments/order/${orderNumber}`
  );
  return data;
}

export async function confirmPaymentMade(orderNumber: string) {
  const { data } = await api.post<{ message: string }>(
    `/api/payments/order/${orderNumber}/confirm`
  );
  return data;
}

export async function uploadProofOfPayment(
  orderNumber: string,
  file: File
): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("proof", file);

  const { data } = await api.post<{ message: string }>(
    `/api/payments/order/${orderNumber}/proof`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export const SHIPPING_FEE = 99;
export const VAT_RATE = 0.15;

export function calculateCheckoutTotals(subtotal: number) {
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + vat) * 100) / 100;
  return { subtotal, shipping, vat, total };
}
