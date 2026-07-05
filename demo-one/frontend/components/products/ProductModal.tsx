"use client";

import { Product } from "@/types/product";
import { X } from "lucide-react";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({
  product,
  onClose,
}: Props) {
  return (
    <div
      className="
      fixed
      inset-0
      z-[100]
      bg-black/80
      backdrop-blur-xl
      "
    >
      <div
        className="
        max-w-6xl
        mx-auto
        mt-20
        bg-zinc-900
        rounded-3xl
        p-10
        "
      >
        <button onClick={onClose}>
          <X />
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product.images[0]}
            alt={product.name}
          />

          <div>
            <h1 className="text-5xl text-white">
              {product.name}
            </h1>

            <p className="mt-6 text-zinc-400">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}