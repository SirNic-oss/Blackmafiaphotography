import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface InventoryCardProps {
  product: Product;
}

export default function InventoryCard({ product }: InventoryCardProps) {
  const lowStock = product.stock < 15;

  return (
    <div className="inventory-card">
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-40 w-full rounded-xl object-cover"
      />
      <div className="mt-4 space-y-1">
        <p className="font-medium text-white">{product.name}</p>
        <p className="text-sm text-zinc-400">{product.category}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-zinc-300">{formatCurrency(product.price)}</span>
          <span className={lowStock ? "text-amber-400 text-sm" : "text-emerald-400 text-sm"}>
            {product.stock} in stock
          </span>
        </div>
      </div>
    </div>
  );
}
