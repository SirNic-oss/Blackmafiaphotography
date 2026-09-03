"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
type Service = { id: string; name: string; description: string; durationMinutes: number; price: number | null };
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get<{ services: Service[] }>("/api/services")
      .then(({ data }) => setServices(data.services))
      .catch(() => setError("Services could not be loaded."))
      .finally(() => setLoading(false));
  }, []);
  return <main className="pt-32 pb-20 px-6"><div className="max-w-6xl mx-auto"><p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Services</p><h1 className="mt-4 text-5xl font-bold md:text-6xl">A session shaped around your story.</h1>{error && <p className="mt-6 text-red-300">{error}</p>}{loading && <p className="mt-10 text-zinc-400">Loading services…</p>}<div className="mt-12 grid gap-5 md:grid-cols-3">{services.map((service) => <article key={service.id} className="rounded-3xl border border-white/10 bg-white/5 p-7"><h2 className="text-2xl font-semibold">{service.name}</h2><p className="mt-4 min-h-20 leading-7 text-zinc-400">{service.description}</p><p className="mt-7 text-sm text-zinc-300">{service.durationMinutes} minutes {service.price !== null && `· R${service.price}`}</p><Link href={`/booking?service=${service.id}`} className="mt-7 inline-block rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Book this session</Link></article>)}</div>{!loading && !services.length && !error && <p className="mt-10 text-zinc-400">No services are available yet.</p>}</div></main>;
}
