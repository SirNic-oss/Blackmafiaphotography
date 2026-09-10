import axios from "axios";

export const getApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isLocal = Boolean(configured && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(?::|\/|$)/i.test(configured));
  return (configured && !isLocal ? configured : "https://blackmafiaphotography.onrender.com").replace(/\/$/, "");
};

const API_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
