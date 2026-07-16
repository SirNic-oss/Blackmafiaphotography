"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthenticated } from "@/lib/auth";
import EditProductForm from "./EditProductForm";

export default function EditProductPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <AdminShell>
      <Suspense fallback={<LoadingSpinner />}>
        <EditProductForm />
      </Suspense>
    </AdminShell>
  );
}

