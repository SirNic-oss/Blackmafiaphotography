"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";
import { createProduct } from "@/services/product.service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddProductPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  async function uploadImage() {
    if (!selectedImage) return "";

    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await fetch(`${BACKEND_URL}/api/uploads/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();

    return data.imageUrl;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);

      const form = new FormData(event.currentTarget);

      let imageUrl = String(form.get("imageUrl"));

      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      await createProduct({
        name: String(form.get("name")),
        category: String(form.get("category")),
        description: String(form.get("description")),
        price: Number(form.get("price")),
        stock: Number(form.get("stock")),
        colors: String(form.get("colors"))
          .split(",")
          .map((c) => c.trim()),
        sizes: String(form.get("sizes"))
          .split(",")
          .map((s) => s.trim()),
        images: [imageUrl],
      });

      router.push("/inventory");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Add Product</h1>
        <p>Create a new item for the Fashion-Fit catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card form-grid">

        <div className="form-field">
          <label>Product Name</label>
          <input name="name" required />
        </div>

        <div className="form-field">
          <label>Category</label>
          <input name="category" required />
        </div>

        <div className="form-field">
          <label>Description</label>
          <textarea name="description" required />
        </div>

        <div className="page-grid page-grid-2">

          <div className="form-field">
            <label>Price</label>
            <input
              name="price"
              type="number"
              required
            />
          </div>

          <div className="form-field">
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              required
            />
          </div>

        </div>

        <div className="form-field">
          <label>Colors</label>
          <input
            name="colors"
            placeholder="Black, White"
          />
        </div>

        <div className="form-field">
          <label>Sizes</label>
          <input
            name="sizes"
            placeholder="8,9,10,11"
          />
        </div>

        <div className="form-field">
          <label>Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setSelectedImage(file);

              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 rounded-lg"
          />
        )}

        <div className="form-field">
          <label>Or Image URL</label>
          <input
            name="imageUrl"
            type="url"
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Product"}
        </button>

      </form>
    </AdminShell>
  );
}