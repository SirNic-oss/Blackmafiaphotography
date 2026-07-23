"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Email is required.", "error");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post<{ message: string }>(
        "/newsletter/subscribe",
        { email }
      );
      showToast(data.message || "Successfully subscribed.", "success");
      setEmail("");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { error?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.error ||
        "Failed to subscribe. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-40">
      <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-white/5 backdrop-blur-xl">
        <h2 className="text-white text-5xl">Stay Updated</h2>
        <p className="text-zinc-400 mt-4">
          Subscribe to get the latest drops and exclusive offers.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-4 mt-10">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            disabled={loading}
            required
            className="flex-1 bg-white/10 rounded-full px-6 py-4 text-white placeholder:text-zinc-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-8 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
