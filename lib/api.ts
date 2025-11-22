const API_BASE = "http://localhost:8000/api";

export async function request(path: string, options: any = {}) {
  const token = localStorage.getItem('token');
  const headers: any = options.headers ?? {};
  headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {...options, headers});
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  return res.json();
}
