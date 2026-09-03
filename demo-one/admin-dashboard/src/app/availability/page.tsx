"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated } from "@/lib/auth";
import { createBlock, deleteBlock, getBlocks } from "@/services/booking.service";
import type { AvailabilityBlock } from "@/types/booking";

const inputValue = (date: Date) => date.toISOString().slice(0, 16);
const BUSINESS_OFFSET_HOURS = 2;

function dateAt(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - BUSINESS_OFFSET_HOURS, minute)).toISOString();
}

export default function AvailabilityPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"day" | "time" | "period">("day");

  const load = () => getBlocks().then(setBlocks).catch(() => setError("Could not load blocked dates."));

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
    else load();
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");

    let startAt = "";
    let endAt = "";

    if (mode === "day") {
      const date = String(form.get("date"));
      const [year, month, day] = date.split("-").map(Number);
      const next = new Date(year, month - 1, day + 1);
      const nextDate = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
      startAt = dateAt(date, "00:00");
      endAt = dateAt(nextDate, "00:00");
    } else if (mode === "time") {
      const date = String(form.get("date"));
      const startTime = String(form.get("startTime"));
      const endTime = String(form.get("endTime"));
      startAt = dateAt(date, startTime);
      endAt = dateAt(date, endTime);
    } else {
      startAt = new Date(String(form.get("startAt"))).toISOString();
      endAt = new Date(String(form.get("endAt"))).toISOString();
    }

    try {
      await createBlock(startAt, endAt, String(form.get("reason") || ""));
      event.currentTarget.reset();
      load();
    } catch (e: unknown) {
      setError(
        typeof e === "object" && e && "response" in e
          ? ((e as { response?: { data?: { error?: string } } }).response?.data?.error || "Could not block this period")
          : "Could not block this period"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="page-header">
        <h1>Availability</h1>
        <p>Block dates or times. Changes apply immediately on the customer booking calendar.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      <div className="mb-4 flex flex-wrap gap-2">
        <button className={mode === "day" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("day")}>Block full day</button>
        <button className={mode === "time" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("time")}>Block time range</button>
        <button className={mode === "period" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("period")}>Block custom period</button>
      </div>

      <form onSubmit={submit} className="form-card form-grid mb-6">
        {mode === "day" && (
          <div className="form-field">
            <label>Date</label>
            <input required name="date" type="date" />
          </div>
        )}
        {mode === "time" && (
          <>
            <div className="form-field">
              <label>Date</label>
              <input required name="date" type="date" />
            </div>
            <div className="form-field">
              <label>Start time</label>
              <input required name="startTime" type="time" defaultValue="09:00" />
            </div>
            <div className="form-field">
              <label>End time</label>
              <input required name="endTime" type="time" defaultValue="17:00" />
            </div>
          </>
        )}
        {mode === "period" && (
          <>
            <div className="form-field">
              <label>Start</label>
              <input required name="startAt" type="datetime-local" defaultValue={inputValue(new Date())} />
            </div>
            <div className="form-field">
              <label>End</label>
              <input required name="endAt" type="datetime-local" />
            </div>
          </>
        )}
        <div className="form-field">
          <label>Reason (optional)</label>
          <input name="reason" placeholder="Annual leave, personal appointment…" />
        </div>
        <button className="btn-primary" disabled={saving}>{saving ? "Blocking…" : "Block availability"}</button>
      </form>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Until</th>
              <th>Reason</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.id}>
                <td>{new Date(block.startAt).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</td>
                <td>{new Date(block.endAt).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</td>
                <td>{block.reason || "—"}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={async () => {
                      await deleteBlock(block.id);
                      load();
                    }}
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
            {!blocks.length && (
              <tr>
                <td colSpan={4}>No dates or times are blocked.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
