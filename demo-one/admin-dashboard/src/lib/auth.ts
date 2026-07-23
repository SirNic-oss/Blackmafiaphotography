import api from "@/lib/api";

const AUTH_KEY = "admin_token";
const USER_KEY = "admin_user";

export interface AdminUser {
  email: string;
  name: string;
  role: "ADMIN";
}

export async function login(email: string, password: string): Promise<boolean> {
  if (!email || !password) return false;

  try {
    const { data } = await api.post<{
      access: string;
      user: AdminUser;
    }>("/api/auth/login", { email, password });

    if (!data.access || data.user?.role !== "ADMIN") {
      return false;
    }

    localStorage.setItem(AUTH_KEY, data.access);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return true;
  } catch {
    return false;
  }
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
