"use client";

import { useEffect, useState } from "react";
import type { Customer } from "@/types/customer";
import { getCustomers } from "@/services/customer.service";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return { customers, loading };
}
