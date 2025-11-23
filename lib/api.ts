// lib/api.ts
// Build-time API base (Next.js injects NEXT_PUBLIC_API_URL here)
const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
    : "https://shaadhi.pythonanywhere.com/api"; // fallback if env var missing

export async function request(path: string, options: RequestInit = {}) {
  // Read token only in browser
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") || null) : null;

  // copy headers from options (RequestInit.headers can be Headers | [string,string][] | Record)
  const headers = {
    // spread existing plain-object headers (if any)
    ...(options.headers && typeof options.headers === "object" && !(options.headers instanceof Headers)
      ? (options.headers as Record<string, string>)
      : {}),
  } as Record<string, string>;

  // If body is FormData we must NOT set Content-Type (browser sets it with boundary)
  // Using a type-safe check — cast options.body to any for the instanceof check
  const bodyAny = (options as any).body;
  if (!(bodyAny instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
    // include credentials only if you rely on cookies; remove if not needed
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }

  // Some endpoints may not return JSON (or return empty string)
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
