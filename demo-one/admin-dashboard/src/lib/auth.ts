const AUTH_KEY = "admin_token";
const USER_KEY = "admin_user";

export interface AdminUser {
  email: string;
  name: string;
  role: "ADMIN";
}

export function login(email: string, password: string): boolean {
  if (!email || !password) return false;

  const user: AdminUser = {
    email,
    name: email.split("@")[0] || "Admin",
    role: "ADMIN",
  };

  localStorage.setItem(AUTH_KEY, "demo-admin-token");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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
