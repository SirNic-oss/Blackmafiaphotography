"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure store preferences and integrations.</p>
      </div>

      <div className="form-card form-grid">
        <div className="form-field">
          <label htmlFor="storeName">Store Name</label>
          <input id="storeName" defaultValue="Fashion-Fit" />
        </div>
        <div className="form-field">
          <label htmlFor="currency">Currency</label>
          <select id="currency" defaultValue="ZAR">
            <option value="ZAR">ZAR - South African Rand</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="supportEmail">Support Email</label>
          <input id="supportEmail" type="email" defaultValue="support@fashionfit.com" />
        </div>
        <button type="button" className="btn-primary">
          Save Settings
        </button>
      </div>
    </AdminShell>
  );
}
