import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { messageRepository } from "@/data/repositories/message.repository.impl";
import { subscribeToTopic } from "@/data/websocket/stompClient";
import type { SendMessageInput } from "@/domain/models/message";
import type { ReactionWebSocketEvent } from "@/domain/models/reaction";
import { useChannels } from "@/presentation/hooks/useChannels";
import { useMessages, useSendAudioMessage, useSendMessage } from "@/presentation/hooks/useMessages";
import { useMessagesManager } from "@/presentation/hooks/useMessagesManager";
import { useTypingIndicator } from "@/presentation/hooks/useTypingIndicator";
import { useAuthStore } from "@/presentation/store/authStore";
import { useUIStore } from "@/presentation/store/uiStore";

export function useChat() {
  const { serverId, channelId } = useParams();
  const setSelectedChannel = useUIStore((s) => s.setSelectedChannel);
  const setSelectedServer = useUIStore((s) => s.setSelectedServer);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const numServerId = Number(serverId);
  const numChannelId = Number(channelId);

  const { data: channels } = useChannels(numServerId);
  const { data: messages } = useMessages(numChannelId);
  const sendMessage = useSendMessage(numChannelId);
  const sendAudioMessage = useSendAudioMessage(numChannelId);

  const { messages: localMessages, updateMessage } = useMessagesManager(messages);
  const { typingUsers, handleTyping, stopTyping, setUserNameMap } = useTypingIndicator(numChannelId, user?.id);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChannel = channels?.find((c) => c.id === numChannelId);

  // Sync UI state with URL
  useEffect(() => {
    if (serverId) setSelectedServer(numServerId);
    if (channelId) setSelectedChannel(numChannelId);
  }, [serverId, channelId, numServerId, numChannelId, setSelectedServer, setSelectedChannel]);

  // Build user name map from messages
  useEffect(() => {
    const userNameMap = new Map<number, string>();
    localMessages.forEach((msg) => {
      userNameMap.set(msg.authorId, msg.authorUsername);
    });
    setUserNameMap(userNameMap);
  }, [localMessages, setUserNameMap]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Subscribe to message updates
  useEffect(() => {
    const unsubscribe = messageRepository.subscribe(numChannelId, () => {
      qc.invalidateQueries({ queryKey: ["messages", numChannelId] });
    });

    return unsubscribe;
  }, [numChannelId]);

  // Subscribe to reaction updates
  useEffect(() => {
    const sub = subscribeToTopic(`/topic/channel/${numChannelId}/reactions`, (message) => {
      const event = JSON.parse(message.body) as ReactionWebSocketEvent;

      const messageToUpdate = localMessages.find((m) => m.id === event.reaction.messageId);
      if (!messageToUpdate) return;

      if (event.type === "ADDED") {
        // Add reaction if not already present (avoid duplicates)
        const alreadyExists = messageToUpdate.reactions.some((r) => r.id === event.reaction.id);
        if (!alreadyExists) {
          updateMessage(event.reaction.messageId, {
            reactions: [...messageToUpdate.reactions, event.reaction],
          });
        }
      } else if (event.type === "REMOVED") {
        // Remove reaction by id
        updateMessage(event.reaction.messageId, {
          reactions: messageToUpdate.reactions.filter((r) => r.id !== event.reaction.id),
        });
      }
    });

    return () => sub.unsubscribe();
  }, [numChannelId, localMessages, updateMessage]);

  // Handlers
  const handleSendMessage = (data: SendMessageInput) => {
    stopTyping();
    sendMessage.mutate(data);
  };

  const handleSendAudio = (file: Blob, durationMs: number) => {
    sendAudioMessage.mutate({ file, durationMs });
  };

  const isAudioPending = sendAudioMessage.isPending;

  return {
    numChannelId,
    numServerId,
    currentChannel,
    localMessages,
    user,
    typingUsers,
    messagesEndRef,
    handleSendMessage,
    handleSendAudio,
    handleTyping,
    stopTyping,
    isAudioPending,
  };
}