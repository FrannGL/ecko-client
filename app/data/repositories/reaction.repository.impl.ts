import type { MessageReaction } from "../../domain/models/reaction";
import { messageReactionInlineSchema } from "../../domain/models/reaction";
import type { ReactionRepository } from "../../domain/repositories/reaction.repository";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const reactionRepository: ReactionRepository = {
  async getByMessage(channelId: number, messageId: number): Promise<MessageReaction[]> {
    const rawReactions = await api
      .get(ENDPOINTS.channels.reactions(channelId, messageId))
      .json<unknown>();

    const reactions = Array.isArray(rawReactions) ? rawReactions : [];
    return reactions.map((data) => messageReactionInlineSchema.parse(data));
  },

  async toggle(channelId: number, messageId: number, emoji: string): Promise<void> {
    await api.post(ENDPOINTS.channels.reactions(channelId, messageId), {
      json: { emoji },
    });
  },
};
