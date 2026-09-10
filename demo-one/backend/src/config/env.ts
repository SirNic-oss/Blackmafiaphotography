const trim = (value: string | undefined) => (value || "").trim().replace(/\/$/, "");

export function getPublicApiUrl() {
  return trim(process.env.PUBLIC_API_URL) || "https://blackmafiaphotography.onrender.com";
}

export function getAllowedOrigins(): string[] {
  const origins = new Set<string>();
  for (const key of ["FRONTEND_URL", "ADMIN_URL"] as const) {
    const value = trim(process.env[key]);
    if (value) origins.add(value);
  }
  origins.add("https://blackmafiaphotography-17yndgh8x-sir-nic.vercel.app");
  origins.add("https://blackmafiaphotography-lbm5g.vercel.app");
  const extra = trim(process.env.ALLOWED_ORIGINS);
  if (extra) {
    for (const origin of extra.split(",")) {
      const item = trim(origin);
      if (item) origins.add(item);
    }
  }
  return Array.from(origins);
}
