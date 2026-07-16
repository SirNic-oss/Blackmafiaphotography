export interface AnalyticsSummary {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  revenueChange: number;
  ordersChange: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  revenueChart: ChartPoint[];
  ordersChart: ChartPoint[];
  topCategories: ChartPoint[];
}
