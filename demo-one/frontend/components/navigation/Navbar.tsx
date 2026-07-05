"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "Story" },
  { href: "/contact", label: "Contact" },
] as const;

function linkClass(isActive: boolean) {
  return [
    "text-sm uppercase tracking-widest transition-colors",
    isActive
      ? "text-white font-medium"
      : "text-zinc-400 hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">
        <Link
          href="/"
          className="text-white font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity"
        >
          DEMO ONE
        </Link>

        <div className="hidden md:flex gap-10">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={linkClass(isActive)}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2"
          aria-label="Open menu"
        >
          <Menu />
        </button>
      </div>
    </nav>
  );
}
