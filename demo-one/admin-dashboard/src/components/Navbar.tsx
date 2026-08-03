"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getAdminUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({
  onMenuClick,
  sidebarOpen,
}: NavbarProps) {
  const router = useRouter();
  const user = getAdminUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="navbar">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-white hover:bg-zinc-800 transition"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <SearchBar />
      </div>

      <div className="navbar-actions">
        <NotificationBell />

        <div className="navbar-user">
          <img
            src="/images/avatar.png"
            alt="Admin avatar"
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-zinc-500">
              {user?.email || "admin@fashionfit.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary"
        >
          Logout
        </button>
      </div>
    </header>
  );
}