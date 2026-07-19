"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cart);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div>
          <p className="text-zinc-400">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block mt-6 rounded-full bg-white px-6 py-3 text-black transition hover:bg-zinc-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-white/10 py-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h2 className="font-bold">{item.name}</h2>

                <p className="text-zinc-400">Quantity: {item.quantity}</p>

                <p>R{item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              Total: R{total.toFixed(2)}
            </h2>

            <Link
              href="/checkout"
              className="inline-block mt-4 rounded bg-white px-6 py-3 text-black transition hover:bg-zinc-200"
            >
              Proceed To Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
