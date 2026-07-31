import type { AuthResponse, InviteCodeResponse, LoginInput, RegisterInviteInput, User } from "../../domain/models/auth";
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import { api } from "../api/client";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export const authRepository: AuthRepository = {
  async login(data: LoginInput): Promise<AuthResponse> {
    try {
      return await api.post("api/auth/login", { json: data }).json<AuthResponse>();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        throw new AuthError("Correo o contraseña incorrectos");
      }
      if (apiError.response?.status === 400) {
        throw new AuthError("Datos inválidos");
      }
      throw new AuthError("Error al iniciar sesión. Intenta de nuevo");
    }
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return api.post("api/auth/refresh", { json: { refreshToken } }).json<AuthResponse>();
  },

  async logout(): Promise<void> {
    await api.post("api/auth/logout");
  },

  async validateInviteCode(code: string): Promise<InviteCodeResponse> {
    try {
      return await api.get(`api/auth/invite/${code}`).json<InviteCodeResponse>();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 400) {
        throw new AuthError("Código de invitación inválido o expirado");
      }
      throw new AuthError("Error al validar código de invitación");
    }
  },

  async registerWithInvite(data: RegisterInviteInput): Promise<AuthResponse> {
    try {
      return await api.post("api/auth/register-invite", { json: data }).json<AuthResponse>();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        throw new AuthError("Este correo ya está registrado");
      }
      if (apiError.response?.status === 400) {
        throw new AuthError("Datos inválidos. Revisa que todo sea correcto");
      }
      throw new AuthError("Error al registrarse. Intenta de nuevo");
    }
  },

  async getMe(): Promise<User> {
    try {
      return await api.get("api/auth/me").json<User>();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        throw new AuthError("No autenticado");
      }
      throw new AuthError("Error al obtener perfil de usuario");
    }
  },
};
