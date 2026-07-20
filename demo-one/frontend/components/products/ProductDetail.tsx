"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80";
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      images: product.images?.length ? product.images : [image],
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        <div>
          <img
            src={image}
            alt={product.name}
            className="rounded-3xl w-full object-cover aspect-[4/5]"
          />
        </div>

        <div>
          <p className="text-zinc-400 uppercase tracking-[0.3em]">
            {product.category || "Fashion Fit"}
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mt-4">
            {product.name}
          </h1>

          <p className="text-3xl mt-8 font-light">R{product.price}</p>

          <p className="text-zinc-300 mt-10 leading-8">
            {product.description}
          </p>

          {colors.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl mb-4">Colours</h3>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="px-5 py-2 rounded-full bg-white/10 border border-white/10"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl mb-4">Sizes</h3>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full border transition ${
                      selectedSize === size
                        ? "bg-white text-black border-white"
                        : "border-white/20 hover:bg-white hover:text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-14">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black py-5 rounded-full font-semibold hover:scale-105 transition"
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 border border-white/20 py-5 rounded-full hover:bg-white/10 transition"
            >
              Buy Now
            </button>
          </div>

          {"stock" in product && product.stock != null && (
            <p className="mt-8 text-zinc-400">
              Stock available: {product.stock}
            </p>
          )}

          <Link
            href="/shop"
            className="inline-block mt-10 text-zinc-400 hover:text-white transition"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    </main>
  );
}
