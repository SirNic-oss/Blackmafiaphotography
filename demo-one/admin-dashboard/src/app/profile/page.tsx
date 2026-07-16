"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminUser, isAuthenticated } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const user = getAdminUser();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your admin account details.</p>
      </div>

      <div className="form-card">
        <div className="mb-6 flex items-center gap-4">
          <img
            src="/images/avatar.png"
            alt="Admin avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-medium text-white">{user?.name || "Admin"}</h2>
            <p className="text-zinc-400">{user?.email || "admin@fashionfit.com"}</p>
            <p className="mt-1 text-sm text-violet-300">{user?.role || "ADMIN"}</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Display Name</label>
            <input id="name" defaultValue={user?.name || "Admin"} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" defaultValue={user?.email || "admin@fashionfit.com"} />
          </div>
          <button type="button" className="btn-primary">
            Update Profile
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
