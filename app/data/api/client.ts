import ky from "ky";

import { ENDPOINTS } from "./endpoints";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

let isRefreshing = false;
let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;

function doRefresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token"));
  }

  return fetch(`${BASE_URL}/${ENDPOINTS.auth.refresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Refresh failed");
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    });
}

export const api = ky.create({
  baseUrl: `${BASE_URL}/`,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // Ky sets the correct multipart boundary for FormData bodies.
        // Only default to JSON when no Content-Type was set.
        if (!request.headers.has("Content-Type")) {
          request.headers.set("Content-Type", "application/json");
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        const url = new URL(request.url);
        const isAuthPage = url.pathname.includes("/login") || url.pathname.includes("/register");

        if (isAuthPage) {
          return;
        }

        if (response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return;
          }

          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = doRefresh()
              .catch(() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                throw new Error("Refresh failed");
              })
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          }

          try {
            await refreshPromise;

            const newToken = localStorage.getItem("accessToken");
            if (newToken) {
              request.headers.set("Authorization", `Bearer ${newToken}`);
              return ky(request);
            }
          } catch {
            return;
          }
        }
      },
    ],
  },
});
