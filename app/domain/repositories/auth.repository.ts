import type { AuthResponse, InviteCodeResponse, LoginInput, RegisterInviteInput, User } from "../models/auth";

export interface AuthRepository {
  login(data: LoginInput): Promise<AuthResponse>;
  refresh(refreshToken: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  validateInviteCode(code: string): Promise<InviteCodeResponse>;
  registerWithInvite(data: RegisterInviteInput): Promise<AuthResponse>;
  getMe(): Promise<User>;
}
