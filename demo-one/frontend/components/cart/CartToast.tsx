"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartToast() {
  const notification = useCartStore((state) => state.notification);
  const clearNotification = useCartStore(
    (state) => state.clearNotification
  );

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(clearNotification, 3000);
    return () => clearTimeout(timer);
  }, [notification, clearNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="
            fixed
            bottom-6
            right-6
            z-[200]
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-zinc-900/95
            px-5
            py-4
            text-white
            shadow-2xl
            backdrop-blur-xl
          "
          role="status"
          aria-live="polite"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Added to cart
            </p>
            <p className="mt-1 text-sm text-zinc-400">{notification}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
