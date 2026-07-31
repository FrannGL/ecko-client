import type { MessageReaction } from "../models/reaction";

export interface ReactionRepository {
  /**
   * Fetch all reactions for a specific message
   */
  getByMessage(channelId: number, messageId: number): Promise<MessageReaction[]>;

  /**
   * Toggle emoji reaction on a message
   * Adds the reaction if it doesn't exist, removes it if it does
   */
  toggle(channelId: number, messageId: number, emoji: string): Promise<void>;
}
