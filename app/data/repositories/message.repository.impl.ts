import type { Message, ReactionInput, SendMessageInput } from "../../domain/models/message";
import { Message as MessageEntity, messageSchema } from "../../domain/models/message";
import type { MessageRepository, UnsubscribeFunction } from "../../domain/repositories/message.repository";
import { api } from "../api/client";
import { sendMessage as stompSendMessage, subscribeToTopic } from "../websocket/stompClient";

export const messageRepository: MessageRepository = {
  async getByChannel(channelId: number): Promise<Message[]> {
    const rawMessages = await api.get(`api/channels/${channelId}/messages`).json<unknown>();

    const messages = Array.isArray(rawMessages) ? rawMessages : [];
    return messages.map((data) => {
      const parsed = messageSchema.parse(data);
      return MessageEntity.from(parsed);
    });
  },

  async send(channelId: number, input: SendMessageInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        stompSendMessage(`/app/chat.sendMessage/${channelId}`, input);

        setTimeout(resolve, 50);
      } catch (error) {
        reject(error);
      }
    });
  },

  subscribe(channelId: number, callback: (message: Message) => void): UnsubscribeFunction {
    const subscription = subscribeToTopic(`/user/queue/messages/${channelId}`, (stompMessage) => {
      try {
        const data = JSON.parse(stompMessage.body);
        const messageEntity = MessageEntity.from(data);
        callback(messageEntity);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });

    return subscription.unsubscribe;
  },

  async toggleReaction(channelId: number, messageId: number, data: ReactionInput): Promise<void> {
    await api.post(`api/channels/${channelId}/messages/${messageId}/reactions`, { json: data });
  },
};
