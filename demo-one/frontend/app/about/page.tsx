"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type SiteSettings = {
  businessName: string;
  about: string | null;
  location: string | null;
};

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.get<{ settings: SiteSettings }>("/api/site-settings")
      .then(({ data }) => setSettings(data.settings))
      .catch(() => setSettings(null));
  }, []);

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2">
        <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1100&q=85" alt="Photographer at work" className="min-h-96 h-full w-full rounded-3xl object-cover" />
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">About {settings?.businessName || "Lumen Studio"}</p>
          <h1 className="mt-4 text-5xl font-bold">Photos with presence.</h1>
          <p className="mt-7 leading-8 text-zinc-300">
            {settings?.about || "I'm a documentary-minded photographer who believes the best images happen when you can forget about the camera. My work balances gentle guidance with enough space for real moments to unfold."}
          </p>
          <p className="mt-5 leading-8 text-zinc-400">
            Based in {settings?.location || "Johannesburg, South Africa"} and available for celebrations, portraits, family stories and thoughtful creative projects across South Africa.
          </p>
          <Link href="/booking" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-black">Start a conversation</Link>
        </div>
      </div>
    </main>
  );
}
