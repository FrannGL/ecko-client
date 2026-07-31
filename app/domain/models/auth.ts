import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  onlineStatus: z.enum(["ONLINE", "OFFLINE", "AWAY"]),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: userSchema,
});

export const inviteCodeResponseSchema = z.object({
  code: z.string(),
  valid: z.boolean(),
  serverName: z.string(),
  serverIconUrl: z.string().nullable(),
  expiresAt: z.string(),
});

export const registerInviteSchema = z.object({
  code: z.string().min(1),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type InviteCodeResponse = z.infer<typeof inviteCodeResponseSchema>;
export type RegisterInviteInput = z.infer<typeof registerInviteSchema>;
