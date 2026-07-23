"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string | null;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "success",
  showToast: (message, type = "success") => set({ message, type }),
  clearToast: () => set({ message: null }),
}));
