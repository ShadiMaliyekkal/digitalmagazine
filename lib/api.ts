// lib/api.js
const API_BASE = (() => {
  // Expect NEXT_PUBLIC_API_URL like "https://shaadhi.pythonanywhere.com"
  // If not provided, fallback to local dev server:
  const env = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");
  // Append /api to form the API root
  return `${env}/api`;
})();

function buildUrl(path: string) {
  // ensure path begins with a single slash
  const cleaned = path.startsWith("/") ? path.replace(/^\/+/, "") : path;
  return `${API_BASE}/${cleaned}`;
}

export async function request(path: string, options: any = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = options.headers ?? {};

  // If the body is FormData, do not set Content-Type (browser sets the boundary)
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = buildUrl(path);
  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err: any) {
    // Network error (CORS blocked, DNS, offline, https/http mismatch, etc.)
    throw new Error(`Network error: ${err.message || err}`);
  }

  // If HTTP error, try to get text/json body for better error messages
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {
      bodyText = "(failed to read error body)";
    }

    // optionally handle JSON error bodies
    try {
      const json = JSON.parse(bodyText || "{}");
      throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
    } catch {
      throw new Error(`HTTP ${res.status} - ${bodyText}`);
    }
  }

  // If no content (204) return null
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  // Try parse json, otherwise return text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  } else {
    return res.text();
  }
}
