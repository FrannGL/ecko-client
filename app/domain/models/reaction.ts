import { z } from "zod";

// Reaction inline schema (viene dentro de un mensaje)
export const messageReactionInlineSchema = z.object({
  id: z.number(),
  messageId: z.number(),
  userId: z.number(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  emoji: z.string(),
});

export const reactionToggleSchema = z.object({
  emoji: z.string().min(1).max(50),
});

export const reactionWebSocketSchema = z.object({
  type: z.enum(["ADDED", "REMOVED"]),
  reaction: messageReactionInlineSchema,
});

export type MessageReaction = z.infer<typeof messageReactionInlineSchema>;
export type ReactionWebSocketEvent = z.infer<typeof reactionWebSocketSchema>;
