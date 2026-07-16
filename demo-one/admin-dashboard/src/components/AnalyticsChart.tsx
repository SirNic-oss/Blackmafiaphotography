import type { ChartPoint } from "@/types/analytics";

interface AnalyticsChartProps {
  title: string;
  data: ChartPoint[];
  color?: string;
}

export default function AnalyticsChart({
  title,
  data,
  color = "#a78bfa",
}: AnalyticsChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="dashboard-card">
      <h3 className="mb-4 text-sm font-medium text-zinc-300">{title}</h3>
      <div className="flex h-48 items-end gap-2">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(point.value / max) * 100}%`,
                backgroundColor: color,
                minHeight: "4px",
              }}
              title={`${point.label}: ${point.value}`}
            />
            <span className="text-[10px] text-zinc-500">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
