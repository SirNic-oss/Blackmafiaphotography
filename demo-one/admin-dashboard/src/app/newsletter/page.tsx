"use client";

import { useEffect, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteSubscriber,
  exportSubscribersCsv,
  getSubscribers,
  type NewsletterSubscriber,
} from "@/services/newsletter.service";

export default function NewsletterPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getSubscribers(search);
        setSubscribers(data.subscribers);
        setTotal(data.total);
      } catch {
        setError("Unable to load newsletter subscribers.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [router, search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this newsletter subscriber?")) return;

    setDeletingId(id);
    setError("");
    try {
      await deleteSubscriber(id);
      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch {
      setError("Unable to delete subscriber.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell>
      <div className="page-header flex items-center justify-between gap-4">
        <div>
          <h1>Newsletter</h1>
          <p>Manage email subscribers and exports.</p>
        </div>
        <button type="button" className="btn-secondary gap-2" onClick={exportSubscribersCsv}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="page-grid page-grid-3 mb-6">
        <div className="dashboard-card">
          <p className="text-sm text-zinc-400">Total subscribers</p>
          <p className="mt-2 text-3xl font-semibold text-white">{total}</p>
        </div>
      </div>

      <div className="mb-4 flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <Search size={18} className="text-zinc-500" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by email"
          className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.email}</td>
                  <td>{new Date(subscriber.subscribedAt).toLocaleString()}</td>
                  <td>
                    <span className="status-badge bg-emerald-400/10 text-emerald-300">
                      {subscriber.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Delete ${subscriber.email}`}
                      disabled={deletingId === subscriber.id}
                      onClick={() => handleDelete(subscriber.id)}
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-zinc-500">No subscribers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
