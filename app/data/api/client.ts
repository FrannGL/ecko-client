import ky from "ky";

const BASE_URL = "http://localhost:8081";

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

  return fetch(`${BASE_URL}/api/auth/refresh`, {
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
  headers: { "Content-Type": "application/json" },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        // No procesar en páginas de autenticación
        const url = new URL(request.url);
        const isAuthPage = url.pathname.includes("/login") || url.pathname.includes("/register");

        if (isAuthPage) {
          return;
        }

        // Solo procesar 401
        if (response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // No hay refresh token, limpiar
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return;
          }

          // Si ya se está refrescando, esperar el resultado
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = doRefresh()
              .catch(() => {
                // Refresh failed, limpiar tokens
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
            // Reintentar la solicitud original con el nuevo token
            const newToken = localStorage.getItem("accessToken");
            if (newToken) {
              request.headers.set("Authorization", `Bearer ${newToken}`);
              return ky(request);
            }
          } catch {
            // El refresh falló, el error se propaga
            return;
          }
        }
      },
    ],
  },
});
