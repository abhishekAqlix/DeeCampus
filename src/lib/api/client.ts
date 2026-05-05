const DEFAULT_BASE = "/api";

export function getApiBase(): string {
  const env = import.meta.env.VITE_API_URL;
  return (typeof env === "string" && env.trim() !== "" ? env.trim() : DEFAULT_BASE).replace(/\/+$/, "");
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { parseJson?: boolean }
): Promise<T> {
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
    ...init?.headers,
  };

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers,
  });

  const parseJson = init?.parseJson !== false;
  const text = await res.text();
  let data: unknown = null;
  if (text && parseJson) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new ApiError(res.status, text || "Invalid JSON response");
    }
  }

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "message" in data && typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : res.statusText || "Request failed";
    const details =
      data && typeof data === "object" && data !== null && "details" in data ? (data as { details: unknown }).details : undefined;
    throw new ApiError(res.status, msg, details);
  }

  return data as T;
}
