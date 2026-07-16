"use client";

import { getAdminUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const router = useRouter();
  const user = getAdminUser();

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
            <p className="text-xs text-zinc-500">{user?.email || "admin@fashionfit.com"}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
}
