import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function DashboardCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
}: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-xs",
                trend === "up" && "text-emerald-400",
                trend === "down" && "text-red-400",
                trend === "neutral" && "text-zinc-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-zinc-300">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
