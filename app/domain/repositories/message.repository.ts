import type { Message, ReactionInput, SendAudioMessageInput, SendMessageInput } from "../models/message";

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
   * Send an audio message via HTTP multipart
   */
  sendAudioMessage(channelId: number, input: SendAudioMessageInput): Promise<void>;

  /**
   * Get a signed URL to play an audio message
   */
  getSignedMediaUrl(channelId: number, messageId: number): Promise<string>;

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
