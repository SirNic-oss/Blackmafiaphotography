"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProductById, updateProduct } from "@/services/product.service";
import type { Product } from "@/types/product";

export default function EditProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;
    getProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) return;
    setSaving(true);
    const form = new FormData(event.currentTarget);

    await updateProduct(productId, {
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

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="page-header">
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Edit Product</h1>
        <p>Update details for {product.name}.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card form-grid">
        <div className="form-field">
          <label htmlFor="name">Product Name</label>
          <input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" defaultValue={product.category} required />
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" defaultValue={product.description} required />
        </div>
        <div className="page-grid page-grid-2">
          <div className="form-field">
            <label htmlFor="price">Price (ZAR)</label>
            <input id="price" name="price" type="number" defaultValue={product.price} required />
          </div>
          <div className="form-field">
            <label htmlFor="stock">Stock</label>
            <input id="stock" name="stock" type="number" defaultValue={product.stock} required />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="colors">Colors</label>
          <input id="colors" name="colors" defaultValue={product.colors.join(", ")} />
        </div>
        <div className="form-field">
          <label htmlFor="sizes">Sizes</label>
          <input id="sizes" name="sizes" defaultValue={product.sizes.join(", ")} />
        </div>
        <div className="form-field">
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" type="url" defaultValue={product.images[0]} required />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </>
  );
}
