"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

export default function Toast() {
  const message = useToastStore((state) => state.message);
  const type = useToastStore((state) => state.type);
  const clearToast = useToastStore((state) => state.clearToast);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clearToast, 4000);
    return () => clearTimeout(timer);
  }, [message, clearToast]);

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;

  const iconColor =
    type === "success"
      ? "text-green-400"
      : type === "error"
        ? "text-red-400"
        : "text-blue-400";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/95 px-5 py-4 text-white shadow-2xl backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <p className="text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
