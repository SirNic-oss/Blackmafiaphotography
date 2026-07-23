"use client";

import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { deleteProduct } from "@/services/product.service";

interface ProductTableProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductTable({
  products,
  setProducts,
}: ProductTableProps) {
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />

                  <span className="font-medium text-white">
                    {product.name}
                  </span>
                </div>
              </td>

              <td>{product.category}</td>

              <td>{formatCurrency(product.price)}</td>

              <td>{product.stock}</td>

              <td className="flex gap-4">
                <Link
                  href={`/inventory/edit-product?id=${product.id}`}
                  className="text-sm text-zinc-300 hover:text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}