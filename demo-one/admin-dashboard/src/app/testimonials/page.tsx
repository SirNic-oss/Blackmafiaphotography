"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "@/services/business.service";
import type { Testimonial } from "@/types/business";

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setError("Could not load testimonials."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else load();
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    const payload = {
      clientName: String(form.get("clientName")),
      quote: String(form.get("quote")),
      rating: Number(form.get("rating") || 5),
      category: String(form.get("category") || "") || null,
      displayOrder: Number(form.get("displayOrder") || 0),
      published: form.get("published") === "on",
    };
    try {
      if (editing) await updateTestimonial(editing.id, payload);
      else await createTestimonial(payload);
      setEditing(null);
      event.currentTarget.reset();
      load();
    } catch {
      setError("Could not save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Testimonials</h1>
        <p>Manage client quotes shown on the customer website.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      <form key={editing?.id || "new"} onSubmit={submit} className="form-card form-grid mb-8">
        <h2 className="text-lg font-semibold text-white">{editing ? "Edit testimonial" : "Add testimonial"}</h2>
        <div className="form-field">
          <label>Client name</label>
          <input required name="clientName" defaultValue={editing?.clientName || ""} />
        </div>
        <div className="form-field">
          <label>Quote</label>
          <textarea required name="quote" defaultValue={editing?.quote || ""} />
        </div>
        <div className="form-field">
          <label>Rating</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={editing?.rating || 5} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <input name="category" defaultValue={editing?.category || ""} placeholder="Portrait, Family…" />
        </div>
        <div className="form-field">
          <label>Display order</label>
          <input name="displayOrder" type="number" defaultValue={editing?.displayOrder || 0} />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} />
          Published on website
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add testimonial"}</button>
          {editing && <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>}
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="page-grid page-grid-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="dashboard-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{testimonial.clientName}</p>
                  <p className="text-xs text-zinc-500">{testimonial.category || "General"} · {testimonial.rating}/5</p>
                </div>
                <span className="status-badge">{testimonial.published ? "Published" : "Draft"}</span>
              </div>
              <p className="mt-4 text-sm text-zinc-300">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-4 flex gap-2">
                <button className="btn-secondary" onClick={() => setEditing(testimonial)}>Edit</button>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    await deleteTestimonial(testimonial.id);
                    load();
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!testimonials.length && <p className="text-zinc-400">No testimonials yet.</p>}
        </div>
      )}
    </AdminShell>
  );
}
