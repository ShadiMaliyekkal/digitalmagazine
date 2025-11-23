// lib/api.ts

// Resolve API base at build time OR runtime in browser
const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "https://shaadhi.pythonanywhere.com";

export async function request(path: string, options: RequestInit = {}) {
  const API_BASE = `${PUBLIC_API}/api`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {};

  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  // only auto-set JSON when not uploading via FormData
  const body = (options as any).body;
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }

  const txt = await res.text();
  if (!txt) return null;

  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}
