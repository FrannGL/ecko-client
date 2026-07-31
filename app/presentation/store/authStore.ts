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
  setUser: (user) => set({ user }),

  isAuthenticated: false,
  setIsAuthenticated: (authenticated: boolean) => {
    set({ isAuthenticated: authenticated });
  },

  showLoginToast: false,
  clearLoginToast: () => set({ showLoginToast: false }),

  setAuth: (user, accessToken, refreshToken) => {
    tokenRepository.save({ accessToken, refreshToken }).catch((error) => {
      console.error("Failed to save tokens:", error);
    });
    set({ user, isAuthenticated: true, showLoginToast: true });
  },

  setAuthSilent: (user, accessToken, refreshToken) => {
    tokenRepository.save({ accessToken, refreshToken }).catch((error) => {
      console.error("Failed to save tokens:", error);
    });
    set({ user, isAuthenticated: true, showLoginToast: false });
  },

  logout: () => {
    tokenRepository.clear().catch((error) => {
      console.error("Failed to clear tokens:", error);
    });
    set({ user: null, isAuthenticated: false });
  },
}));
