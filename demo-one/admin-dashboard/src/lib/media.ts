import api from "./api";

export const getApiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export { api as default };

/** Rewrites stored media URLs so localhost uploads work when API URL changes. */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const apiBase = getApiBaseUrl();
  if (url.startsWith("/uploads/")) return `${apiBase}${url}`;
  if (url.startsWith("http://localhost:5000/") || url.startsWith("https://localhost:5000/")) {
    return url.replace(/^https?:\/\/localhost:5000/, apiBase);
  }
  if (url.includes("/uploads/") && !url.startsWith(apiBase)) {
    const path = url.slice(url.indexOf("/uploads/"));
    return `${apiBase}${path}`;
  }
  return url;
}
