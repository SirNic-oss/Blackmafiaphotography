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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="Photography business" className="h-8 w-8 rounded-lg" />
        <div>
          <p className="text-sm font-semibold text-white">Lumen Studio</p>
          <p className="text-xs text-zinc-500">Photography Admin</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={cn("sidebar-link", active && "sidebar-link-active")}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
