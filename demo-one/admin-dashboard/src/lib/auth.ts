import { getApiBaseUrl } from "@/lib/api";

const AUTH_KEY = "admin_token";
const USER_KEY = "admin_user";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
}

export async function login(email: string, password: string): Promise<boolean> {
  if (!email || !password) return false;
  const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return false;
  const data = await response.json() as { access: string; user: AdminUser };
  if (data.user.role !== "ADMIN") return false;
  localStorage.setItem(AUTH_KEY, data.access);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return true;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(AUTH_KEY));
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}
