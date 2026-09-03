"use client";

import { getAdminUser, logout, type AdminUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
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
      <SearchBar />
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
