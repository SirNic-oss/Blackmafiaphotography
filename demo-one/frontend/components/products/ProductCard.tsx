
"use client";

import { Product } from "@/types/product";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        scale: 1.03,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
      group
      relative
      rounded-3xl
      overflow-hidden
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="
          h-[500px]
          w-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-110
          "
        />

        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black
          via-black/30
          to-transparent
          "
        />

        <button
          onClick={() => setLiked(!liked)}
          className="
          absolute
          top-4
          right-4
          z-20
          p-2
          rounded-full
          bg-black/30
          backdrop-blur-md
          "
        >
          <Heart
            className={
              liked
                ? "fill-red-500 text-red-500"
                : "text-white"
            }
          />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-white text-2xl">
          {product.name}
        </h3>

        <p className="text-zinc-400 mt-2">
          {product.description}
        </p>

        <p className="text-white mt-4 text-xl">
          R{product.price}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            className="
            flex-1
            bg-white
            text-black
            py-3
            rounded-full
            "
          >
            <ShoppingBag />
          </button>

          <button
            className="
            bg-white/10
            border
            border-white/10
            p-3
            rounded-full
            "
          >
            <Eye />
          </button>
        </div>
      </div>
    </motion.div>
  );
}