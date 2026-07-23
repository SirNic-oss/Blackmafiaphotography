"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Copy, Check, Upload, Loader2 } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import {
  confirmPaymentMade,
  getPaymentDetails,
  uploadProofOfPayment,
  type PaymentDetails,
} from "@/lib/order.service";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    showToast(`${label} copied!`, "success");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 transition"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      Copy
    </button>
  );
}

function BankDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/10">
      <div>
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}

export default function EftPaymentPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const showToast = useToastStore((state) => state.showToast);

  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    getPaymentDetails(orderNumber)
      .then(setDetails)
      .catch(() => showToast("Failed to load payment details.", "error"))
      .finally(() => setLoading(false));
  }, [orderNumber, showToast]);

  async function handleConfirmPayment() {
    setConfirming(true);
    try {
      const result = await confirmPaymentMade(orderNumber);
      showToast(result.message, "success");
    } catch {
      showToast("Failed to confirm payment.", "error");
    } finally {
      setConfirming(false);
    }
  }

  async function handleUploadProof() {
    if (!selectedFile) {
      showToast("Please select a file to upload.", "error");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadProofOfPayment(orderNumber, selectedFile);
      showToast(result.message, "success");
      setSelectedFile(null);
    } catch {
      showToast("Failed to upload proof of payment.", "error");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-32 pb-20 px-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </main>
    );
  }

  if (!details) {
    return (
      <main className="pt-32 pb-20 px-6 text-center">
        <p className="text-zinc-400">Payment details not found.</p>
      </main>
    );
  }

  const { bankDetails, payment, order } = details;

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-2">EFT Payment</h1>
        <p className="text-zinc-400 mb-8">
          Order <span className="text-white">{order.orderNumber}</span> — R
          {order.total.toFixed(2)}
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">Bank Details</h2>
          <BankDetailRow label="Bank Name" value={bankDetails.bankName} />
          <BankDetailRow label="Account Name" value={bankDetails.accountName} />
          <BankDetailRow
            label="Account Number"
            value={bankDetails.accountNumber}
          />
          <BankDetailRow label="Branch Code" value={bankDetails.branchCode} />
          <BankDetailRow
            label="Payment Reference"
            value={payment.paymentReference || ""}
          />
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6">
          <p className="text-amber-200 text-sm">
            Use the payment reference above when making your EFT transfer. Your
            order will be processed once payment is verified.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Proof of Payment
          </h2>
          <p className="text-zinc-400 text-sm mb-4">
            Upload your proof of payment (PDF, PNG, or JPEG).
          </p>

          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 p-8 cursor-pointer hover:border-white/40 transition">
            <Upload className="h-8 w-8 text-zinc-400" />
            <span className="text-zinc-400 text-sm">
              {selectedFile ? selectedFile.name : "Click to select file"}
            </span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            type="button"
            onClick={handleUploadProof}
            disabled={uploading || !selectedFile}
            className="mt-4 w-full rounded-full bg-white py-3 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Proof"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={confirming}
          className="w-full rounded-full border border-white/20 py-3 text-white font-semibold hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {confirming ? "Confirming..." : "I've Made Payment"}
        </button>

        <Link
          href={`/track/${orderNumber}`}
          className="block text-center text-zinc-400 text-sm hover:text-white transition"
        >
          Track your order →
        </Link>
      </div>
    </main>
  );
}
