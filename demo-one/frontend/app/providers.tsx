"use client";

import useLenis from "@/hooks/useLenis";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();

  return <>{children}</>;
}