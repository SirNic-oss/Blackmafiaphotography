import Link from "next/link";
import { ReactNode } from "react";

interface PolicyLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function PolicyLayout({
  title,
  description,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/policies"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          ← All policies
        </Link>
        <h1 className="text-white text-5xl md:text-6xl font-bold mt-6 mb-4">
          {title}
        </h1>
        <p className="text-zinc-400 text-lg mb-12">{description}</p>
        <div className="policy-content">{children}</div>
      </div>
    </main>
  );
}
