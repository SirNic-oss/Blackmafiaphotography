"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { trackOrder, type TrackingResponse } from "@/lib/order.service";

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function TrackOrderByNumberPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then(({ orderNumber: num }) => {
      setOrderNumber(num);
      trackOrder(num)
        .then(setTracking)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <main className="pt-32 pb-20 px-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </main>
    );
  }

  if (error || !tracking) {
    return (
      <main className="pt-32 pb-20 px-6 text-center">
        <p className="text-zinc-400">Order {orderNumber} not found.</p>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-2">Track Order</h1>
        <p className="text-zinc-400 mb-8">
          Order <span className="text-white">{tracking.order.orderNumber}</span>
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-400 text-sm">Customer</p>
              <p className="text-white">{tracking.order.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-sm">Total</p>
              <p className="text-white font-bold">
                R{tracking.order.total.toFixed(2)}
              </p>
            </div>
          </div>
          {tracking.order.trackingNumber && (
            <p className="text-zinc-400 text-sm mt-4">
              Tracking:{" "}
              <span className="text-white">{tracking.order.trackingNumber}</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-white text-lg font-semibold mb-6">Order Timeline</h2>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
