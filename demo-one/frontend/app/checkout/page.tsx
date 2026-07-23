"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import {
  calculateCheckoutTotals,
  createOrder,
  type CheckoutFormData,
} from "@/lib/order.service";

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useToastStore((state) => state.showToast);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CheckoutFormData>({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    postalCode: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totals = calculateCheckoutTotals(subtotal);

  function updateField(field: keyof CheckoutFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await createOrder(form, cartItems);
      clearCart();
      showToast("Order placed successfully!", "success");
      router.push(`/checkout/eft/${result.order.orderNumber}`);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { error?: string } };
      };
      showToast(
        axiosError.response?.data?.error || "Checkout failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-white text-5xl font-bold mb-4">Checkout</h1>
          <p className="text-zinc-400 mb-8">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block rounded-full bg-white px-8 py-3 text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-2">Checkout</h1>
        <p className="text-zinc-400 mb-10">
          Complete your details to place your order via EFT.
        </p>

        <div className="grid lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-white text-xl font-semibold mb-5">
                Contact & Delivery
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-zinc-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-zinc-400 mb-1">
                    Street Address *
                  </label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Province
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  >
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p} className="bg-zinc-900">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Postal Code
                  </label>
                  <input
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-white text-xl font-semibold mb-3">
                Payment Method
              </h2>
              <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <div className="h-4 w-4 rounded-full border-2 border-white bg-white" />
                <span className="text-white font-medium">EFT (Bank Transfer)</span>
              </div>
              <p className="text-zinc-400 text-sm mt-3">
                You will receive bank details and a unique payment reference on
                the next page.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white py-4 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sticky top-32">
              <h2 className="text-white text-xl font-semibold mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-zinc-400 text-sm">
                        Qty: {item.quantity} × R{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-white text-sm">
                      R{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>R{totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>VAT (15%)</span>
                  <span>R{totals.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-2">
                  <span>Total</span>
                  <span>R{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
