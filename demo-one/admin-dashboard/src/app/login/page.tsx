"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials or insufficient admin access.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.png" alt="Fashion-Fit" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="text-xl font-semibold">Fashion-Fit Admin</h1>
            <p className="text-sm text-zinc-400">Sign in to manage your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fashionfit.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
