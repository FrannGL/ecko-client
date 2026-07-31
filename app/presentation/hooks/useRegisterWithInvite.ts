import { useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RegisterWithInviteUseCase, ValidateInviteCodeUseCase } from "@/application/usecases";
import { authRepository } from "@/data/repositories/auth.repository.impl";
import type { InviteCodeResponse, RegisterInviteInput } from "@/domain/models/auth";
import { useAuthStore } from "@/presentation/store/authStore";

/**
 * Hook for the invite code registration flow
 * Step 1: Validate invite code
 * Step 2: Register user with invite code
 */
export function useRegisterWithInvite() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Step 1: Validate invite code
  const validateCodeUseCase = new ValidateInviteCodeUseCase(authRepository);

  const validateInviteCode = useMutation({
    mutationFn: (code: string) => validateCodeUseCase.execute({ code }),
    onError: (error) => {
      console.warn("Failed to validate invite code:", error.message);
    },
  });

  // Step 2: Register with invite
  const registerUseCase = new RegisterWithInviteUseCase(authRepository);

  const registerWithInvite = useMutation({
    mutationFn: (data: RegisterInviteInput) => registerUseCase.execute(data),
    onSuccess: (response) => {
      // Update auth store (which saves tokens and auth state)
      setAuth(response.user, response.accessToken, response.refreshToken);

      // Invalidate queries
      qc.invalidateQueries({ queryKey: ["servers"] });
      qc.invalidateQueries({ queryKey: ["channels"] });

      // Navigate to home
      navigate("/");
    },
    onError: (error) => {
      console.warn("Failed to register with invite:", error.message);
    },
  });

  return {
    validateInviteCode,
    registerWithInvite,
  };
}

/**
 * Query hook to get invite code details
 */
export function useGetInviteCodeDetails(code: string, enabled: boolean = false) {
  const validateCodeUseCase = new ValidateInviteCodeUseCase(authRepository);

  return useQuery<InviteCodeResponse>({
    queryKey: ["inviteCode", code],
    queryFn: () => validateCodeUseCase.execute({ code }),
    enabled: enabled && code.length >= 3,
    retry: false,
  });
}
