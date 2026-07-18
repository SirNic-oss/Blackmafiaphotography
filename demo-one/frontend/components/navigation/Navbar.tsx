"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "Story" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">
        <Link
          href="/"
          className="text-white font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity"
        >
          FASHION FIT
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-4 ${linkClass(isActive)}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}