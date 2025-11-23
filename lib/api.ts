// lib/api.js (or lib/api.ts)
const API_BASE =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL)
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
    : "https://shaadhi.pythonanywhere.com/api"; // fallback if env var missing

export async function request(path: string, options: any = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = options.headers ?? {};
  // Only set content-type when body is JSON
  if (!(options && options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  // some endpoints (e.g. file downloads) might not return json
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}
