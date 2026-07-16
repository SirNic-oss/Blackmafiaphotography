"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData } from "@/types/analytics";
import { getAnalytics } from "@/services/analytics.service";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
