"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import {
  createService,
  deactivateService,
  getServices,
  updateService,
} from "@/services/business.service";
import type { PhotographyService } from "@/types/business";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<PhotographyService[]>([]);
  const [editing, setEditing] = useState<PhotographyService | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getServices()
      .then(setServices)
      .catch(() => setError("Could not load services."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else load();
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    const payload = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      durationMinutes: Number(form.get("durationMinutes")),
      price: form.get("price") ? Number(form.get("price")) : null,
      displayOrder: Number(form.get("displayOrder") || 0),
      active: form.get("active") === "on",
    };
    try {
      if (editing) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }
      setEditing(null);
      event.currentTarget.reset();
      load();
    } catch (e: unknown) {
      setError(
        typeof e === "object" && e && "response" in e
          ? ((e as { response?: { data?: { error?: string } } }).response?.data?.error || "Could not save service")
          : "Could not save service"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Services & packages</h1>
        <p>Create and manage photography sessions shown on the customer website.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      <form key={editing?.id || "new"} onSubmit={submit} className="form-card form-grid mb-8">
        <h2 className="text-lg font-semibold text-white">{editing ? "Edit service" : "Add service"}</h2>
        <div className="form-field">
          <label>Name</label>
          <input required name="name" defaultValue={editing?.name || ""} placeholder="Portrait Session" />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea required name="description" defaultValue={editing?.description || ""} />
        </div>
        <div className="form-field">
          <label>Duration (minutes)</label>
          <input required name="durationMinutes" type="number" min={30} step={30} defaultValue={editing?.durationMinutes || 60} />
        </div>
        <div className="form-field">
          <label>Price (ZAR)</label>
          <input name="price" type="number" min={0} step={50} defaultValue={editing?.price ?? ""} />
        </div>
        <div className="form-field">
          <label>Display order</label>
          <input name="displayOrder" type="number" defaultValue={editing?.displayOrder || 0} />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} />
          Active on customer website
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update service" : "Create service"}</button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel edit</button>
          )}
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <p className="text-white">{service.name}</p>
                    <p className="text-xs text-zinc-500">{service.description}</p>
                  </td>
                  <td>{service.durationMinutes} min</td>
                  <td>{service.price != null ? formatCurrency(service.price) : "—"}</td>
                  <td>{service.active ? "Active" : "Inactive"}</td>
                  <td className="flex gap-2">
                    <button className="btn-secondary" onClick={() => setEditing(service)}>Edit</button>
                    {service.active && (
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          await deactivateService(service.id);
                          load();
                        }}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!services.length && (
                <tr>
                  <td colSpan={5}>No services yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
