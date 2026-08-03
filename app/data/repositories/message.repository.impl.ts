import type { Message, ReactionInput, SendAudioMessageInput, SendMessageInput } from "../../domain/models/message";
import { Message as MessageEntity, messageSchema } from "../../domain/models/message";
import type { MessageRepository, UnsubscribeFunction } from "../../domain/repositories/message.repository";
import { api } from "../api/client";
import { ENDPOINTS, STOMP_TOPICS } from "../api/endpoints";
import { sendMessage as stompSendMessage, subscribeToTopic } from "../websocket/stompClient";

export const messageRepository: MessageRepository = {
  async getByChannel(channelId: number): Promise<Message[]> {
    const rawMessages = await api.get(ENDPOINTS.channels.messages(channelId)).json<unknown>();

    const messages = Array.isArray(rawMessages) ? rawMessages : [];
    return messages.map((data) => {
      const parsed = messageSchema.parse(data);
      return MessageEntity.from(parsed);
    });
  },

  async send(channelId: number, input: SendMessageInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        stompSendMessage(STOMP_TOPICS.sendMessage(channelId), input);

        setTimeout(resolve, 50);
      } catch (error) {
        reject(error);
      }
    });
  },

  async sendAudioMessage(channelId: number, input: SendAudioMessageInput): Promise<void> {
    const formData = new FormData();
    formData.append("audio", input.file, "voice-message.webm");
    formData.append("durationMs", String(input.durationMs));

    await api.post(ENDPOINTS.channels.audioMessage(channelId), { body: formData });
  },

  async getSignedMediaUrl(channelId: number, messageId: number): Promise<string> {
    const data = await api
      .get(ENDPOINTS.channels.media(channelId, messageId))
      .json<{ url: string }>();
    return data.url;
  },

  subscribe(channelId: number, callback: (message: Message) => void): UnsubscribeFunction {
    const subscription = subscribeToTopic(STOMP_TOPICS.messages(channelId), (stompMessage) => {
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
    await api.post(ENDPOINTS.channels.reactions(channelId, messageId), { json: data });
  },
};
