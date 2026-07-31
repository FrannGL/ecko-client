import { create } from "zustand";

import { tokenRepository } from "../../data/repositories/token.repository.impl";
import type { User } from "../../domain/models/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showLoginToast: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAuthSilent: (user: User, accessToken: string, refreshToken: string) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
  clearLoginToast: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  showLoginToast: false,
  setAuth: (user, accessToken, refreshToken) => {
    // Delegate token persistence to repository (abstraction)
    tokenRepository.save({ accessToken, refreshToken }).catch((error) => {
      console.error("Failed to save tokens:", error);
    });
    set({ user, isAuthenticated: true, showLoginToast: true });
  },
  setAuthSilent: (user, accessToken, refreshToken) => {
    // Same as setAuth but without showing toast
    tokenRepository.save({ accessToken, refreshToken }).catch((error) => {
      console.error("Failed to save tokens:", error);
    });
    set({ user, isAuthenticated: true, showLoginToast: false });
  },
  setIsAuthenticated: (authenticated: boolean) => {
    // Mark as authenticated without setting user (user will be populated on first API call)
    set({ isAuthenticated: authenticated });
  },
  logout: () => {
    // Delegate token cleanup to repository
    tokenRepository.clear().catch((error) => {
      console.error("Failed to clear tokens:", error);
    });
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
  clearLoginToast: () => set({ showLoginToast: false }),
}));
