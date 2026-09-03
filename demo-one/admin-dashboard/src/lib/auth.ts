import { getApiBaseUrl } from "@/lib/api";

const AUTH_KEY = "admin_token";
const USER_KEY = "admin_user";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, message: "Enter your email address and password." };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({})) as { access?: string; user?: AdminUser; message?: string };

    if (!response.ok) {
      return { success: false, message: data.message || "Unable to sign in. Please try again." };
    }
    if (!data.access || !data.user || data.user.role !== "ADMIN") {
      return { success: false, message: "This account does not have administrator access." };
    }

    localStorage.setItem(AUTH_KEY, data.access);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { success: true };
  } catch {
    return { success: false, message: "Cannot reach the API. Check that the backend is running." };
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
