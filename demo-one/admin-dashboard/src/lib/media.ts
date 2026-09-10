import api from "./api";

export const getApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isLocal = Boolean(configured && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(?::|\/|$)/i.test(configured));
  return (configured && !isLocal ? configured : "https://blackmafiaphotography.onrender.com").replace(/\/$/, "");
};

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
