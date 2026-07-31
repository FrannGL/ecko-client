import { useMutation } from "@tanstack/react-query";

import { authRepository } from "../../data/repositories/auth.repository.impl";
import type { AuthResponse, LoginInput } from "../../domain/models/auth";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authRepository.login(data),
    onSuccess: (res: AuthResponse) => {
      setAuth(res.user, res.accessToken, res.refreshToken);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authRepository.logout(),
  });
}
