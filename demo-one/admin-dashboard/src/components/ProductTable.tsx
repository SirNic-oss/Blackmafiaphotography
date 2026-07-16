import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
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
                  <span className="font-medium text-white">{product.name}</span>
                </div>
              </td>
              <td>{product.category}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.stock}</td>
              <td>
                <Link
                  href={`/inventory/edit-product?id=${product.id}`}
                  className="text-sm text-zinc-300 hover:text-white"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
