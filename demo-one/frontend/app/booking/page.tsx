"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Service = { id: string; name: string; description: string; durationMinutes: number; price: number | null };
type Slot = { time: string; available: boolean };

function today() { return new Date().toISOString().slice(0, 10); }

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    api.get<{ services: Service[] }>("/api/services")
      .then(({ data }) => { setServices(data.services); const requested = new URLSearchParams(window.location.search).get("service"); setServiceId(data.services.some((service) => service.id === requested) ? requested || "" : data.services[0]?.id || ""); })
      .catch(() => setNotice({ type: "error", text: "Photography services could not be loaded. Please try again later." }));
  }, []);

  useEffect(() => {
    if (!serviceId || !date) return;
    setLoadingSlots(true); setTime("");
    api.get<{ slots: Slot[] }>("/api/availability", { params: { serviceId, date } })
      .then(({ data }) => setSlots(data.slots))
      .catch(() => { setSlots([]); setNotice({ type: "error", text: "Availability could not be loaded for this date." }); })
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId || !date || !time) { setNotice({ type: "error", text: "Please choose a service, date, and available time." }); return; }
    const form = new FormData(event.currentTarget);
    setSubmitting(true); setNotice(null);
    try {
      const { data } = await api.post<{ message: string }>("/api/bookings", {
        serviceId, date, time,
        name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message"),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setNotice({ type: "success", text: `${data.message} We will contact you to confirm the session.` });
      event.currentTarget.reset(); setTime("");
      const { data: availability } = await api.get<{ slots: Slot[] }>("/api/availability", { params: { serviceId, date } });
      setSlots(availability.slots);
    } catch (error: unknown) {
      const message = typeof error === "object" && error && "response" in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error : undefined;
      setNotice({ type: "error", text: message || "We could not submit the booking. Please try again." });
    } finally { setSubmitting(false); }
  }

  const selected = services.find((service) => service.id === serviceId);
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Photography sessions</p>
        <h1 className="mt-3 text-5xl md:text-6xl font-bold">Book your session</h1>
        <p className="mt-5 max-w-2xl text-zinc-400">Choose a package, then select an available time. A request is held immediately so no one else can take your slot while we confirm it.</p>
        {notice && <div className={`mt-8 rounded-xl border px-4 py-3 ${notice.type === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-red-400/30 bg-red-400/10 text-red-100"}`}>{notice.text}</div>}
        <form onSubmit={submit} className="mt-10 grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <section>
            <h2 className="text-xl font-semibold">1. Choose a service</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {services.map((service) => <button key={service.id} type="button" onClick={() => setServiceId(service.id)} className={`rounded-2xl border p-4 text-left transition ${service.id === serviceId ? "border-white bg-white text-black" : "border-white/15 bg-black/20 text-white hover:border-white/40"}`}>
                <p className="font-semibold">{service.name}</p><p className="mt-1 text-sm opacity-70">{service.description}</p><p className="mt-3 text-sm font-medium">{service.durationMinutes} min{service.price !== null ? ` · R${service.price}` : ""}</p>
              </button>)}
            </div>
            {!services.length && <p className="mt-3 text-zinc-400">No services are published yet.</p>}
          </section>
          <section>
            <h2 className="text-xl font-semibold">2. Select date and time</h2>
            <label className="mt-4 block text-sm text-zinc-300" htmlFor="booking-date">Date</label>
            <input id="booking-date" type="date" min={today()} value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white" />
            {selected && <p className="mt-3 text-sm text-zinc-400">{selected.durationMinutes}-minute session. Available times shown are updated from the live booking calendar.</p>}
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {loadingSlots && <p className="col-span-full text-zinc-400">Loading times…</p>}
              {!loadingSlots && !slots.length && <p className="col-span-full text-zinc-400">No available times on this date. Please choose another day.</p>}
              {!loadingSlots && slots.map((slot) => <button key={slot.time} type="button" disabled={!slot.available} onClick={() => setTime(slot.time)} className={`rounded-xl px-3 py-3 text-sm ${time === slot.time ? "bg-white text-black" : slot.available ? "border border-white/20 hover:border-white text-white" : "cursor-not-allowed bg-white/5 text-zinc-600 line-through"}`}>{slot.time}</button>)}
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div><label className="block text-sm text-zinc-300" htmlFor="name">Name</label><input required id="name" name="name" className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3" /></div>
            <div><label className="block text-sm text-zinc-300" htmlFor="phone">Phone</label><input required id="phone" name="phone" type="tel" className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3" /></div>
            <div className="md:col-span-2"><label className="block text-sm text-zinc-300" htmlFor="email">Email</label><input required id="email" name="email" type="email" className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3" /></div>
            <div className="md:col-span-2"><label className="block text-sm text-zinc-300" htmlFor="message">Message or session details (optional)</label><textarea id="message" name="message" rows={4} className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3" /></div>
          </section>
          <button disabled={submitting || !time || !serviceId} className="rounded-full bg-white px-7 py-4 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Sending booking…" : "Submit booking request"}</button>
        </form>
      </div>
    </main>
  );
}
