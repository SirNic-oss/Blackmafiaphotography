"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type SiteSettings = {
  businessName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  instagram: string | null;
  facebook: string | null;
  pinterest: string | null;
};

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.get<{ settings: SiteSettings }>("/api/site-settings")
      .then(({ data }) => setSettings(data.settings))
      .catch(() => setSettings(null));
  }, []);

  const socials = [
    settings?.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings?.facebook ? { label: "Facebook", href: settings.facebook } : null,
    settings?.pinterest ? { label: "Pinterest", href: settings.pinterest } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto grid gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Contact</p>
          <h1 className="mt-4 text-5xl font-bold md:text-6xl">Let&apos;s make something memorable.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Tell us about the moment, people or idea you&apos;d like photographed. For session requests, use the booking calendar so you can choose a time that works.
          </p>
          <Link href="/booking" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-black">Book a session</Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="text-xl font-semibold">Studio details</h2>
          <dl className="mt-6 space-y-5 text-zinc-300">
            <div>
              <dt className="text-sm text-zinc-500">Business</dt>
              <dd className="mt-1">{settings?.businessName || "Lumen Studio"}</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">Email</dt>
              <dd className="mt-1">
                {settings?.email ? (
                  <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
                ) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">Phone</dt>
              <dd className="mt-1">
                {settings?.phone ? (
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a>
                ) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">Based in</dt>
              <dd className="mt-1">{settings?.location || "Johannesburg, South Africa"}</dd>
            </div>
            {socials.length > 0 && (
              <div>
                <dt className="text-sm text-zinc-500">Social</dt>
                <dd className="mt-2 flex flex-wrap gap-4">
                  {socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">{social.label}</a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </main>
  );
}
