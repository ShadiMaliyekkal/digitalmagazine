// lib/api.ts (or lib/api.js if you're not using .ts)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api";

export async function request(path: string, options: any = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = options.headers ?? {};
  headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  return res.json();
}
