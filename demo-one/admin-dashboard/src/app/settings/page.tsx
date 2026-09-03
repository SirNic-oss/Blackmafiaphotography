"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/services/business.service";
import type { SiteSettings } from "@/types/business";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else {
      getSiteSettings()
        .then(setSettings)
        .catch(() => setError("Could not load website settings."))
        .finally(() => setLoading(false));
    }
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateSiteSettings({
        businessName: String(form.get("businessName")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        location: String(form.get("location")),
        instagram: String(form.get("instagram")),
        facebook: String(form.get("facebook")),
        pinterest: String(form.get("pinterest")),
        about: String(form.get("about")),
      });
      setSettings(updated);
      setSuccess("Website settings saved.");
    } catch {
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Website settings</h1>
        <p>Manage business information shown on the customer photography website.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-emerald-500/10 p-3 text-emerald-300">{success}</p>}

      <form onSubmit={submit} className="form-card form-grid">
        <div className="form-field">
          <label htmlFor="businessName">Business name</label>
          <input id="businessName" name="businessName" defaultValue={settings.businessName} required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Contact email</label>
          <input id="email" name="email" type="email" defaultValue={settings.email || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={settings.phone || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" defaultValue={settings.location || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="instagram">Instagram URL</label>
          <input id="instagram" name="instagram" type="url" defaultValue={settings.instagram || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="facebook">Facebook URL</label>
          <input id="facebook" name="facebook" type="url" defaultValue={settings.facebook || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="pinterest">Pinterest URL</label>
          <input id="pinterest" name="pinterest" type="url" defaultValue={settings.pinterest || ""} />
        </div>
        <div className="form-field">
          <label htmlFor="about">About</label>
          <textarea id="about" name="about" defaultValue={settings.about || ""} />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </AdminShell>
  );
}
