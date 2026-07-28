import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendOrderEmail } from "../services/email.service";
import { backendBaseUrl } from "../config/backend";
import { bankDetails } from "../config/bank";

const prisma = new PrismaClient();

export async function getPayments(_req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ error: "Failed to fetch payments." });
  }
}

export async function getPaymentByOrderNumber(req: Request, res: Response) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payments: true },
    });

    if (!order || !order.payments[0]) {
      return res.status(404).json({ error: "Payment not found." });
    }

    return res.json({
      payment: order.payments[0],
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        customerName: order.customerName,
      },
      bankDetails: {
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,
        branchCode: bankDetails.branchCode,
      },
    });
  } catch (error) {
    console.error("Get payment error:", error);
    return res.status(500).json({ error: "Failed to fetch payment." });
  }
}

export async function uploadProofOfPayment(req: Request, res: Response) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Proof of payment file is required." });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payments: true },
    });

    if (!order || !order.payments[0]) {
      return res.status(404).json({ error: "Order not found." });
    }

    const proofUrl = `${backendBaseUrl}/uploads/payments/${file.filename}`;

    const payment = await prisma.payment.update({
      where: { id: order.payments[0].id },
      data: {
        proofUrl,
        proofFileName: file.originalname,
        status: "PENDING_REVIEW",
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PENDING_REVIEW" },
    });

    return res.json({
      message: "Proof of payment uploaded. We will review it shortly.",
      payment,
    });
  } catch (error) {
    console.error("Upload proof error:", error);
    return res.status(500).json({ error: "Failed to upload proof of payment." });
  }
}

export async function approvePayment(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const payment = await prisma.payment.update({
      where: { id },
      data: { status: "APPROVED" },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: "APPROVED",
        status: "PAYMENT_CONFIRMED",
      },
    });

    await prisma.trackingEvent.create({
      data: {
        orderId: payment.orderId,
        status: "PAYMENT_CONFIRMED",
        description: "Payment approved by admin",
      },
    });

    await sendOrderEmail("PAYMENT_APPROVED", payment.order.email, {
      customerName: payment.order.customerName,
      orderNumber: payment.order.orderNumber,
    });

    return res.json({ message: "Payment approved.", payment });
  } catch (error) {
    console.error("Approve payment error:", error);
    return res.status(500).json({ error: "Failed to approve payment." });
  }
}

export async function rejectPayment(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { notes } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: { status: "REJECTED", adminNotes: notes || "Payment rejected." },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: "REJECTED",
        status: "AWAITING_PAYMENT",
      },
    });

    await sendOrderEmail("PAYMENT_REJECTED", payment.order.email, {
      customerName: payment.order.customerName,
      orderNumber: payment.order.orderNumber,
      notes: notes || "",
    });

    return res.json({ message: "Payment rejected.", payment });
  } catch (error) {
    console.error("Reject payment error:", error);
    return res.status(500).json({ error: "Failed to reject payment." });
  }
}

export async function requestNewProof(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { notes } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status: "PROOF_REQUESTED",
        adminNotes: notes || "Please upload a new proof of payment.",
        proofUrl: null,
        proofFileName: null,
      },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: "PROOF_REQUESTED",
        status: "AWAITING_PAYMENT",
      },
    });

    await sendOrderEmail("PAYMENT_REJECTED", payment.order.email, {
      customerName: payment.order.customerName,
      orderNumber: payment.order.orderNumber,
      notes: notes || "Please upload a new proof of payment.",
    });

    return res.json({ message: "New proof requested.", payment });
  } catch (error) {
    console.error("Request new proof error:", error);
    return res.status(500).json({ error: "Failed to request new proof." });
  }
}

export async function confirmPaymentMade(req: Request, res: Response) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payments: true },
    });

    if (!order || !order.payments[0]) {
      return res.status(404).json({ error: "Order not found." });
    }

    const payment = await prisma.payment.update({
      where: { id: order.payments[0].id },
      data: { status: "PENDING_REVIEW" },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PENDING_REVIEW" },
    });

    return res.json({
      message: "Thank you. We will verify your payment shortly.",
      payment,
    });
  } catch (error) {
    console.error("Confirm payment made error:", error);
    return res.status(500).json({ error: "Failed to confirm payment." });
  }
}
