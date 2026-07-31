import type { Message, ReactionInput, SendMessageInput } from "../models/message";

export type UnsubscribeFunction = () => void;

export interface MessageRepository {
  /**
   * Fetch messages for a specific channel
   */
  getByChannel(channelId: number): Promise<Message[]>;

  /**
   * Send a message via WebSocket (real-time)
   * Abstracts the transport layer (STOMP protocol)
   */
  send(channelId: number, input: SendMessageInput): Promise<void>;

  /**
   * Subscribe to real-time message updates
   * Returns an unsubscribe function
   */
  subscribe(channelId: number, callback: (message: Message) => void): UnsubscribeFunction;

  /**
   * Toggle emoji reaction on a message
   */
  toggleReaction(channelId: number, messageId: number, data: ReactionInput): Promise<void>;
}
