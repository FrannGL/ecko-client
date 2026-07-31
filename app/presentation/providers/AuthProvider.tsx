import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { RefreshTokenUseCase } from "@/application/usecases";
import { authRepository } from "@/data/repositories/auth.repository.impl";
import { isTokenExpired } from "@/lib/utils";
import { Logo } from "@/presentation/components/Logo";
import { useAuthStore } from "@/presentation/store/authStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const setAuthSilent = useAuthStore((s) => s.setAuthSilent);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      if (isTokenExpired(token)) {
        const usecase = new RefreshTokenUseCase(authRepository);
        usecase
          .execute({ refreshToken })
          .then((res) => setAuthSilent(res.user, res.accessToken, res.refreshToken))
          .catch((error) => {
            console.error("Failed to refresh token:", error);

            setIsAuthenticated(false);
          })
          .finally(() => setReady(true));
      } else {
        authRepository
          .getMe()
          .then((user) => {
            setAuthSilent(user, token, refreshToken);
          })
          .catch((error) => {
            console.error("Failed to fetch current user:", error);

            setIsAuthenticated(true);
          })
          .finally(() => setReady(true));
      }
    } else {
      setReady(true);
    }
  }, [setAuthSilent, setIsAuthenticated]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === "accessToken" || e.key === "refreshToken") && e.newValue === null) {
        setIsAuthenticated(false);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size={64} showText={false} />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
