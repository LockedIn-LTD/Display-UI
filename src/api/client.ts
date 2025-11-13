/// <reference types="vite/client" />

export type Driver = { id: string; fullName: string; avatarUrl?: string };
export type User = { id: string; name: string; email: string; phoneNumber?: string };

const ENV_BASE = (import.meta.env?.VITE_API_URL as string | undefined)?.toString().trim();
const BASE = (ENV_BASE && ENV_BASE.replace(/\/+$/, "")) || "http://localhost:4000";

function authHeader(): Record<string, string> {
  const t = localStorage.getItem("ds_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeader(),
    },
    ...init,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
  }

  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `HTTP ${res.status} ${res.statusText}`);
  }
  return json.data as T;
}

// Drivers 
export async function listDrivers(): Promise<Driver[]> {
  return fetchJson<Driver[]>("/api/drivers", { method: "GET" });
}

// Auth
export async function login(
  identifier: string,
  password: string
): Promise<{ user: User; token: string }> {
  const data = await fetchJson<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier: identifier.trim(), password }),
  });
  localStorage.setItem("ds_token", data.token);
  localStorage.setItem("ds_user", JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem("ds_token");
  localStorage.removeItem("ds_user");
}

export function currentUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem("ds_user") || "null");
  } catch {
    return null;
  }
}

// Events
export type Event = {
  id: string;
  driverId: string;
  status?: string;
  heartRate?: number;
  bloodOxygenLevel?: number;
  vehicleSpeed?: number;
  date?: string;
  time?: string;
  timestampMs?: number;
  videoUrl?: string;
};

export async function listEvents(params?: {
  driverId?: string;
  limit?: number;
}): Promise<Event[]> {
  const search = new URLSearchParams();
  if (params?.driverId) search.set("driverId", params.driverId);
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return fetchJson<Event[]>(`/api/events${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export async function getEvent(id: string): Promise<Event> {
  return fetchJson<Event>(`/api/events/${encodeURIComponent(id)}`, { method: "GET" });
}