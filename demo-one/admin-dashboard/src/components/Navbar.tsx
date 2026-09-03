"use client";

import { getAdminUser, logout, type AdminUser } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const router = useRouter();
  // localStorage is unavailable during SSR. Reading it during render causes
  // the server and first client render to produce different markup.
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

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
          className="rounded-lg p-2 text-white hover:bg-zinc-800 transition lg:hidden"
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
            <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
            <p className="text-xs text-zinc-500">{user?.email || "admin@lumenstudio.com"}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
}
