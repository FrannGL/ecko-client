import type { MessageReaction } from "../../domain/models/reaction";
import { messageReactionInlineSchema } from "../../domain/models/reaction";
import type { ReactionRepository } from "../../domain/repositories/reaction.repository";
import { api } from "../api/client";

export const reactionRepository: ReactionRepository = {
  async getByMessage(channelId: number, messageId: number): Promise<MessageReaction[]> {
    const rawReactions = await api.get(`api/channels/${channelId}/messages/${messageId}/reactions`).json<unknown>();

    const reactions = Array.isArray(rawReactions) ? rawReactions : [];
    return reactions.map((data) => messageReactionInlineSchema.parse(data));
  },

  async toggle(channelId: number, messageId: number, emoji: string): Promise<void> {
    await api.post(`api/channels/${channelId}/messages/${messageId}/reactions`, {
      json: { emoji },
    });
  },
};
