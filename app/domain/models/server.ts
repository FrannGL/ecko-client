import { z } from "zod";

export const serverSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  iconUrl: z.string().nullable(),
  ownerId: z.number(),
  ownerUsername: z.string(),
  createdAt: z.string(),
  memberCount: z.number().optional(),
  myRole: z.enum(["ADMIN", "MODERATOR", "MEMBER"]),
});

export const createServerSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  iconUrl: z.string().optional(),
});

export type Server = z.infer<typeof serverSchema>;
export type CreateServerInput = z.infer<typeof createServerSchema>;
