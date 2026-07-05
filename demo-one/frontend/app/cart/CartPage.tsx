"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/cart"
        );

        const data =
          await response.json();

        setCartItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b py-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover"
              />

              <div className="flex-1">
                <h2 className="font-bold">
                  {item.name}
                </h2>

                <p>
                  Quantity:
                  {item.quantity}
                </p>

                <p>
                  R
                  {item.price.toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              Total: R
              {total.toFixed(2)}
            </h2>

            <Link
              href="/checkout"
              className="inline-block mt-4 bg-black text-white px-6 py-3 rounded"
            >
              Proceed To Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}