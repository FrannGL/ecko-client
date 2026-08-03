import { z } from "zod";

import { messageReactionInlineSchema } from "./reaction";

export const messageSchema = z.object({
  id: z.number(),
  content: z.string().nullable(),
  channelId: z.number(),
  authorId: z.number(),
  authorUsername: z.string(),
  authorAvatarUrl: z.string().nullable(),
  parentMessageId: z.number().nullable(),
  createdAt: z.string(),
  reactions: z.array(messageReactionInlineSchema).optional().default([]),
  mediaUrl: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  durationMs: z.number().nullable().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  parentMessageId: z.number().optional(),
});

export const sendAudioMessageSchema = z.object({
  file: z.instanceof(Blob),
  durationMs: z.number().min(1).max(60000),
});

export const reactionSchema = z.object({
  emoji: z.string().min(1).max(50),
});

type MessageData = z.infer<typeof messageSchema>;

/**
 * Rich Message Entity
 * Encapsulates message data with domain-specific behavior
 */
export class Message implements MessageData {
  id: number;
  content: string | null;
  channelId: number;
  authorId: number;
  authorUsername: string;
  authorAvatarUrl: string | null;
  parentMessageId: number | null;
  createdAt: string;
  mediaUrl: string | null;
  mediaType: string | null;
  durationMs: number | null;
  reactions: z.infer<typeof messageReactionInlineSchema>[];

  constructor(data: MessageData) {
    this.id = data.id;
    this.content = data.content;
    this.channelId = data.channelId;
    this.authorId = data.authorId;
    this.authorUsername = data.authorUsername;
    this.authorAvatarUrl = data.authorAvatarUrl;
    this.parentMessageId = data.parentMessageId;
    this.createdAt = data.createdAt;
    this.mediaUrl = data.mediaUrl ?? null;
    this.mediaType = data.mediaType ?? null;
    this.durationMs = data.durationMs ?? null;
    this.reactions = data.reactions ?? [];
  }

  /**
   * Whether this message is an audio (voice) message
   */
  isAudio(): boolean {
    return this.mediaType != null;
  }

  /**
   * Check if this message was authored by the given user
   */
  isOwnedBy(userId: number): boolean {
    return this.authorId === userId;
  }

  /**
   * Check if message is a reply to another message
   */
  isReply(): boolean {
    return this.parentMessageId !== null;
  }

  /**
   * Get message content
   */
  getDisplayContent(): string {
    return this.content ?? "";
  }

  /**
   * Factory method to create Message from raw data
   */
  static from(data: MessageData): Message {
    return new Message(data);
  }
}

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SendAudioMessageInput = z.infer<typeof sendAudioMessageSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;
