"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";

const reviews = [
  { id: 1, product: "Luxury Runner", customer: "Thabo M.", rating: 5, comment: "Excellent quality and fit." },
  { id: 2, product: "Silk Blazer", customer: "Lerato N.", rating: 4, comment: "Beautiful fabric, slightly oversized." },
  { id: 3, product: "Obsidian High", customer: "James W.", rating: 5, comment: "Premium feel, fast delivery." },
];

export default function ReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Reviews</h1>
        <p>Monitor product feedback from customers.</p>
      </div>

      <div className="page-grid">
        {reviews.map((review) => (
          <div key={review.id} className="dashboard-card">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{review.product}</h3>
              <span className="text-amber-300">{"★".repeat(review.rating)}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">{review.customer}</p>
            <p className="mt-3 text-zinc-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
