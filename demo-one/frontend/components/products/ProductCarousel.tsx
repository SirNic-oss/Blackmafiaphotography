"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
}

export default function ProductCarousel({
  products,
}: Props) {
  return (
    <section
      className="
      overflow-x-scroll
      snap-x
      snap-mandatory
      "
    >
      <div className="flex gap-8 px-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="
            min-w-[400px]
            snap-center
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}