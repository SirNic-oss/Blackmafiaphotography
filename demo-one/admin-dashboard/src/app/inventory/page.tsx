"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import ProductTable from "@/components/ProductTable";
import InventoryCard from "@/components/InventoryCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { useProducts } from "@/hooks/useProducts";

export default function InventoryPage() {
  const router = useRouter();
  const { products, loading } = useProducts();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header flex items-center justify-between gap-4">
        <div>
          <h1>Inventory</h1>
          <p>Manage product stock and catalog items.</p>
        </div>
        <Link href="/inventory/add-product" className="btn-primary">
          Add Product
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="page-grid page-grid-3 mb-6">
            {products.slice(0, 3).map((product) => (
              <InventoryCard key={product.id} product={product} />
            ))}
          </div>
          <ProductTable products={products} />
        </>
      )}
    </AdminShell>
  );
}
