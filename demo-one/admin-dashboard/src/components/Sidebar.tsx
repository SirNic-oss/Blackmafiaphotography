"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  BarChart3,
  CreditCard,
  Settings,
  User,
  Mail,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:z-30"
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Fashion-Fit"
            className="h-8 w-8 rounded-lg"
          />
          <div>
            <p className="text-sm font-semibold text-white">
              Fashion-Fit
            </p>
            <p className="text-xs text-zinc-500">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden text-white"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex flex-col p-4 gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-zinc-300 hover:bg-zinc-800 transition",
                active && "bg-zinc-800 text-white"
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}