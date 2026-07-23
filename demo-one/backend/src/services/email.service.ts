type EmailTemplate =
  | "ORDER_CREATED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "ORDER_PACKED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED";

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

const templateSubjects: Record<EmailTemplate, string> = {
  ORDER_CREATED: "Your FashionFit order has been received",
  PAYMENT_APPROVED: "Payment confirmed for your FashionFit order",
  PAYMENT_REJECTED: "Payment issue with your FashionFit order",
  ORDER_PACKED: "Your FashionFit order has been packed",
  ORDER_SHIPPED: "Your FashionFit order is on its way",
  ORDER_DELIVERED: "Your FashionFit order has been delivered",
};

function buildEmailBody(
  template: EmailTemplate,
  data: Record<string, string>
): string {
  const lines: Record<EmailTemplate, string> = {
    ORDER_CREATED: `Hi ${data.customerName},\n\nThank you for your order ${data.orderNumber}. Please complete your EFT payment using reference ${data.paymentReference}.\n\nFashionFit Team`,
    PAYMENT_APPROVED: `Hi ${data.customerName},\n\nYour payment for order ${data.orderNumber} has been approved. We are now processing your order.\n\nFashionFit Team`,
    PAYMENT_REJECTED: `Hi ${data.customerName},\n\nWe could not verify payment for order ${data.orderNumber}. ${data.notes || "Please contact support or upload new proof of payment."}\n\nFashionFit Team`,
    ORDER_PACKED: `Hi ${data.customerName},\n\nGreat news! Your order ${data.orderNumber} has been packed and will ship soon.\n\nFashionFit Team`,
    ORDER_SHIPPED: `Hi ${data.customerName},\n\nYour order ${data.orderNumber} has been shipped${data.trackingNumber ? ` with tracking number ${data.trackingNumber}` : ""}.\n\nFashionFit Team`,
    ORDER_DELIVERED: `Hi ${data.customerName},\n\nYour order ${data.orderNumber} has been delivered. Thank you for shopping with FashionFit!\n\nFashionFit Team`,
  };

  return lines[template];
}

export async function sendOrderEmail(
  template: EmailTemplate,
  to: string,
  data: Record<string, string>
): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || "placeholder";
  const apiKey = process.env.EMAIL_API_KEY || "";

  const payload: EmailPayload = {
    to,
    subject: templateSubjects[template],
    body: buildEmailBody(template, data),
  };

  if (!provider || !apiKey || provider === "placeholder") {
    console.log(`[Email Placeholder] ${template}`, {
      provider: provider || "none",
      ...payload,
    });
    return;
  }

  console.log(`[Email] Sending via ${provider}`, payload);
}
