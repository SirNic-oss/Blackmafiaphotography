import { Request, Response } from "express";
import { OrderStatus, PrismaClient } from "@prisma/client";
import {
  calculateOrderTotals,
  generateOrderNumber,
  generatePaymentReference,
} from "../services/order.service";
import { sendOrderEmail } from "../services/email.service";
import { isValidEmail, normalizeEmail } from "../utils/validation";

const prisma = new PrismaClient();

const TRACKING_STEPS: OrderStatus[] = [
  "ORDER_RECEIVED",
  "AWAITING_PAYMENT",
  "PAYMENT_CONFIRMED",
  "SUPPLIER_PROCESSING",
  "PACKED",
  "COLLECTED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

async function addTrackingEvent(
  orderId: string,
  status: OrderStatus,
  description?: string
) {
  await prisma.trackingEvent.create({
    data: { orderId, status, description },
  });
}

export async function createOrder(req: Request, res: Response) {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      province,
      postalCode,
      items,
    } = req.body;

    if (!customerName?.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email?.trim() || !isValidEmail(email)) {
      return res.status(400).json({ error: "Valid email is required." });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ error: "Phone is required." });
    }
    if (!address?.trim()) {
      return res.status(400).json({ error: "Address is required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required." });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const totals = calculateOrderTotals(subtotal);
    const orderNumber = await generateOrderNumber();
    const paymentReference = generatePaymentReference(orderNumber);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        email: normalizeEmail(email),
        phone: phone.trim(),
        address: address.trim(),
        province: province?.trim() || null,
        postalCode: postalCode?.trim() || null,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        vat: totals.vat,
        total: totals.total,
        paymentStatus: "AWAITING_PAYMENT",
        status: "AWAITING_PAYMENT",
        items: {
          create: items.map(
            (item: {
              id?: string;
              name: string;
              price: number;
              quantity: number;
              image?: string;
            }) => ({
              productId: item.id || null,
              productName: item.name,
              productImage: item.image || null,
              price: Number(item.price),
              quantity: Number(item.quantity),
            })
          ),
        },
        payments: {
          create: {
            amount: totals.total,
            provider: "EFT",
            status: "AWAITING_PAYMENT",
            paymentReference,
          },
        },
        shipment: {
          create: {
            courier: "Courier Guy",
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        payments: true,
        shipment: true,
      },
    });

    await addTrackingEvent(order.id, "ORDER_RECEIVED", "Order received");
    await addTrackingEvent(order.id, "AWAITING_PAYMENT", "Awaiting EFT payment");

    await sendOrderEmail("ORDER_CREATED", order.email, {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      paymentReference,
    });

    return res.status(201).json({
      message: "Order created successfully.",
      order,
      paymentReference,
      bankDetails: {
        bankName: process.env.BANK_NAME || "BANK_NAME",
        accountName: process.env.BANK_ACCOUNT_NAME || "ACCOUNT_NAME",
        accountNumber: process.env.BANK_ACCOUNT || "ACCOUNT_NUMBER",
        branchCode: process.env.BANK_BRANCH || "BRANCH_CODE",
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Failed to create order." });
  }
}

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        payments: true,
        shipment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
}

export async function getOrderByNumber(req: Request, res: Response) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;

    if (!orderNumber) {
      return res.status(400).json({ error: "Order number is required." });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
        shipment: true,
        trackingEvents: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const timeline = TRACKING_STEPS.map((step) => {
      const event = order.trackingEvents.find((e) => e.status === step);
      const currentIndex = TRACKING_STEPS.indexOf(order.status);
      const stepIndex = TRACKING_STEPS.indexOf(step);

      return {
        status: step,
        label: step.replace(/_/g, " "),
        completed: stepIndex <= currentIndex,
        timestamp: event?.createdAt || null,
        description: event?.description || null,
      };
    });

    return res.json({ order, timeline });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ error: "Failed to fetch order." });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, trackingNumber, courier } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber ?? undefined,
        courier: courier ?? undefined,
      },
      include: { shipment: true },
    });

    await addTrackingEvent(id, status);

    if (trackingNumber && order.shipment) {
      await prisma.shipment.update({
        where: { orderId: id },
        data: { trackingNumber, courier: courier || order.shipment.courier },
      });
    }

    if (status === "PACKED") {
      await sendOrderEmail("ORDER_PACKED", order.email, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
      });
    } else if (status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY") {
      await sendOrderEmail("ORDER_SHIPPED", order.email, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || "",
      });
    } else if (status === "DELIVERED") {
      await sendOrderEmail("ORDER_DELIVERED", order.email, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
      });
    }

    return res.json({ message: "Order updated.", order });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ error: "Failed to update order." });
  }
}

export async function updateShipmentStatus(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, trackingNumber, courier } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const shipment = await prisma.shipment.update({
      where: { orderId: id },
      data: {
        status,
        trackingNumber: trackingNumber ?? undefined,
        courier: courier ?? undefined,
      },
    });

    if (trackingNumber) {
      await prisma.order.update({
        where: { id },
        data: { trackingNumber, courier: courier || "Courier Guy" },
      });
    }

    return res.json({ message: "Shipment updated.", shipment });
  } catch (error) {
    console.error("Update shipment error:", error);
    return res.status(500).json({ error: "Failed to update shipment." });
  }
}
