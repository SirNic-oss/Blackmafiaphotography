"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";
import { createProduct } from "@/services/product.service";

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);

    await createProduct({
      name: String(form.get("name")),
      category: String(form.get("category")),
      description: String(form.get("description")),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      colors: String(form.get("colors")).split(",").map((c) => c.trim()),
      sizes: String(form.get("sizes")).split(",").map((s) => s.trim()),
      images: [String(form.get("imageUrl"))],
    });

    router.push("/inventory");
  };

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Add Product</h1>
        <p>Create a new item for the Fashion-Fit catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card form-grid">
        <div className="form-field">
          <label htmlFor="name">Product Name</label>
          <input id="name" name="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" required />
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required />
        </div>
        <div className="page-grid page-grid-2">
          <div className="form-field">
            <label htmlFor="price">Price (ZAR)</label>
            <input id="price" name="price" type="number" min="0" required />
          </div>
          <div className="form-field">
            <label htmlFor="stock">Stock</label>
            <input id="stock" name="stock" type="number" min="0" required />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="colors">Colors (comma separated)</label>
          <input id="colors" name="colors" placeholder="Black, White" />
        </div>
        <div className="form-field">
          <label htmlFor="sizes">Sizes (comma separated)</label>
          <input id="sizes" name="sizes" placeholder="S, M, L, XL" />
        </div>
        <div className="form-field">
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" type="url" required />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </AdminShell>
  );
}
