import { session } from "./session";

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = session.token();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`/backend${path}`, { ...init, headers, cache: "no-store" });
  if (response.status === 401 && token) session.expire();
  if (!response.ok) {
    let message = "Không thể kết nối đến máy chủ.";
    try { const data = await response.json(); message = Array.isArray(data.message) ? data.message.join(", ") : data.message || message; } catch { /* use fallback */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function downloadAnalytics(format: "csv" | "pdf") {
  const response = await fetch(`/backend/analytics/export?format=${format}`, { headers: { Authorization: `Bearer ${session.token() || ""}` } });
  if (!response.ok) throw new Error("Không thể xuất báo cáo.");
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `habistride-analytics.${format}`; anchor.click(); URL.revokeObjectURL(url);
}
