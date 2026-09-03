import { getApiBaseUrl } from "./api";

/** Rewrites stored media URLs so localhost uploads work in production too. */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const apiBase = getApiBaseUrl();
  if (url.startsWith("/uploads/")) return `${apiBase}${url}`;
  if (url.startsWith("http://localhost:5000/") || url.startsWith("https://localhost:5000/")) {
    return url.replace(/^https?:\/\/localhost:5000/, apiBase);
  }
  if (url.startsWith("http://127.0.0.1:5000/")) {
    return url.replace(/^http:\/\/127\.0\.0\.1:5000/, apiBase);
  }
  // Rewrite stored dev/example API hosts to the configured API base
  if (url.includes("/uploads/") && !url.startsWith(apiBase)) {
    const path = url.slice(url.indexOf("/uploads/"));
    return `${apiBase}${path}`;
  }
  return url;
}
