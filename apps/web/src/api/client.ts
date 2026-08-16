const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Like `api`, but returns `null` for a 404 instead of throwing. Useful for
 * optional resources such as the active mission, which may not exist between
 * missions.
 */
export async function apiOrNull<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
