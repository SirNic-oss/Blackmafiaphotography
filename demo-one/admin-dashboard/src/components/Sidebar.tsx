"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  CalendarOff,
  Images,
  Users,
  Camera,
  MessageSquareQuote,
  Settings,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/calendar", label: "Booking calendar", icon: CalendarRange },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/availability", label: "Availability", icon: CalendarOff },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/services", label: "Services", icon: Camera },
  { href: "/portfolio", label: "Portfolio", icon: Images },
  { href: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/settings", label: "Website settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:z-30",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="sidebar-brand">
        <img src="/logo.png" alt="Photography business" className="h-8 w-8 rounded-lg" />
        <div>
          <p className="text-sm font-semibold text-white">Lumen Studio</p>
          <p className="text-xs text-zinc-500">Photography Admin</p>
        </div>
        <button type="button" onClick={onClose} className="ml-auto text-white lg:hidden" aria-label="Close menu">
          <X size={22} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} onClick={onClose} className={cn("sidebar-link", active && "sidebar-link-active")}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
