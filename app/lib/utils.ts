import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Decode JWT and get expiration time
 * @param token JWT token
 * @returns expiration timestamp in milliseconds, or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded.exp ? decoded.exp * 1000 : null; // exp is in seconds, convert to ms
  } catch {
    return null;
  }
}

/**
 * Check if token is expired or will expire within the next 5 minutes
 * @param token JWT token
 * @returns true if token needs refresh
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer

  return now + bufferMs >= expiration;
}
