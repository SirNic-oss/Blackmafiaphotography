"use client";

import { FormEvent, useState } from "react";
import { CheckCircle, Circle, Loader2, Search } from "lucide-react";
import { trackOrder, type TrackingResponse } from "@/lib/order.service";
import { useToastStore } from "@/store/toastStore";

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function TrackOrderPage() {
  const showToast = useToastStore((state) => state.showToast);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();

    if (!orderNumber.trim()) {
      showToast("Please enter an order number.", "error");
      return;
    }

    setLoading(true);
    setTracking(null);

    try {
      const result = await trackOrder(orderNumber.trim());
      setTracking(result);
    } catch {
      showToast("Order not found. Please check your order number.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-2">Track Order</h1>
        <p className="text-zinc-400 mb-8">
          Enter your order number to see the latest status.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. FF-20260723-1234"
            className="flex-1 rounded-full bg-white/10 px-6 py-3 text-white placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-black font-medium disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Track
          </button>
        </form>

        {tracking && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-zinc-400 text-sm">Order Number</p>
                  <p className="text-white text-xl font-bold">
                    {tracking.order.orderNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-sm">Total</p>
                  <p className="text-white font-bold">
                    R{tracking.order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {tracking.order.trackingNumber && (
                <p className="text-zinc-400 text-sm">
                  Tracking:{" "}
                  <span className="text-white">{tracking.order.trackingNumber}</span>
                  {tracking.order.courier && ` via ${tracking.order.courier}`}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-white text-lg font-semibold mb-6">
                Order Timeline
              </h2>

              <div className="space-y-0">
                {tracking.timeline.map((step, index) => (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400 shrink-0" />
                      ) : (
                        <Circle className="h-6 w-6 text-zinc-600 shrink-0" />
                      )}
                      {index < tracking.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[32px] ${
                            step.completed ? "bg-green-400/50" : "bg-zinc-700"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-6">
                      <p
                        className={`font-medium capitalize ${
                          step.completed ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {formatStatusLabel(step.label)}
                      </p>
                      {step.timestamp && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {new Date(step.timestamp).toLocaleString("en-ZA")}
                        </p>
                      )}
                      {step.description && (
                        <p className="text-zinc-400 text-sm mt-1">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
