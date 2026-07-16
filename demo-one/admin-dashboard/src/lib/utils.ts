export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-amber-500/15 text-amber-300",
    PAID: "bg-emerald-500/15 text-emerald-300",
    SHIPPED: "bg-blue-500/15 text-blue-300",
    DELIVERED: "bg-violet-500/15 text-violet-300",
    CANCELLED: "bg-red-500/15 text-red-300",
    active: "bg-emerald-500/15 text-emerald-300",
    inactive: "bg-zinc-500/15 text-zinc-300",
  };
  return map[status] || "bg-zinc-500/15 text-zinc-300";
}
