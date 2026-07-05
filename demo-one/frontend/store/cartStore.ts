import { create } from "zustand";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];

  addToCart: (id: string) => void;

  removeFromCart: (id: string) => void;
}

export const useCartStore =
  create<CartStore>((set) => ({
    cart: [],

    addToCart: (id) =>
      set((state) => ({
        cart: [...state.cart, { id, quantity: 1 }],
      })),

    removeFromCart: (id) =>
      set((state) => ({
        cart: state.cart.filter(
          (item) => item.id !== id
        ),
      })),
  }));