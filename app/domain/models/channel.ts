import { z } from "zod";

export const channelSchema = z.object({
  id: z.number(),
  name: z.string(),
  serverId: z.number(),
  type: z.enum(["TEXT", "VOICE"]),
  createdAt: z.string(),
});

export const createChannelSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(["TEXT", "VOICE"]).optional(),
});

export const activeUsersResponseSchema = z.object({
  count: z.number(),
});

export type Channel = z.infer<typeof channelSchema>;
export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type ActiveUsersResponse = z.infer<typeof activeUsersResponseSchema>;
