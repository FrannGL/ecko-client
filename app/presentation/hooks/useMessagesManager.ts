import { useEffect, useState } from "react";

import type { Message as MessageType } from "@/domain/models";
import { Message } from "@/domain/models/message";

export function useMessagesManager(initialMessages: MessageType[] | undefined) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages || []);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (messageId: number, updates: Partial<MessageType>) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const messageData = {
            id: updates.id ?? m.id,
            content: updates.content ?? m.content,
            channelId: updates.channelId ?? m.channelId,
            authorId: updates.authorId ?? m.authorId,
            authorUsername: updates.authorUsername ?? m.authorUsername,
            authorAvatarUrl: updates.authorAvatarUrl ?? m.authorAvatarUrl,
            parentMessageId: updates.parentMessageId ?? m.parentMessageId,
            createdAt: updates.createdAt ?? m.createdAt,
          };
          return Message.from(messageData);
        }
        return m;
      })
    );
  };

  const deleteMessage = (messageId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
  };
}
