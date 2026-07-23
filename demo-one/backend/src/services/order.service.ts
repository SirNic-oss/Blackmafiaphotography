import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateOrderNumber(): Promise<string> {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  let orderNumber = `FF-${datePart}-${randomPart}`;
  let exists = await prisma.order.findUnique({ where: { orderNumber } });

  while (exists) {
    const retry = Math.floor(1000 + Math.random() * 9000);
    orderNumber = `FF-${datePart}-${retry}`;
    exists = await prisma.order.findUnique({ where: { orderNumber } });
  }

  return orderNumber;
}

export function generatePaymentReference(orderNumber: string): string {
  return `PAY-${orderNumber}`;
}

export const SHIPPING_FEE = 99;
export const VAT_RATE = 0.15;

export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + vat) * 100) / 100;

  return { subtotal, shipping, vat, total };
}
