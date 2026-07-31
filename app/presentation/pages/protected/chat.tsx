import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { subscribeToTopic } from "@/data/websocket/stompClient";
import type { SendMessageInput } from "@/domain/models/message";
import { ChannelHeader } from "@/presentation/components/ChannelHeader";
import { MessageInput } from "@/presentation/components/MessageInput";
import { MessageList } from "@/presentation/components/MessageList";
import { useChannels } from "@/presentation/hooks/useChannels";
import { useMessages, useSendMessage } from "@/presentation/hooks/useMessages";
import { useMessagesManager } from "@/presentation/hooks/useMessagesManager";
import { useTypingIndicator } from "@/presentation/hooks/useTypingIndicator";
import { useAuthStore } from "@/presentation/store/authStore";
import { useUIStore } from "@/presentation/store/uiStore";

import { Marker, MarkerContent } from "~/presentation/components/ui/marker";

export default function ChatPage() {
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

  const { messages: localMessages } = useMessagesManager(messages);
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
    const sub = subscribeToTopic(`/topic/channel/${numChannelId}`, () => {
      qc.invalidateQueries({ queryKey: ["messages", numChannelId] });
    });

    return () => sub.unsubscribe();
  }, [numChannelId, qc]);

  // Handlers
  const handleSendMessage = (data: SendMessageInput) => {
    stopTyping();
    sendMessage.mutate(data);
  };

  if (!numChannelId) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a channel</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChannelHeader channelName={currentChannel?.name} serverId={numServerId} channelId={numChannelId} />

      <MessageList messages={localMessages} currentUserId={user?.id} />

      {typingUsers.size > 0 && (
        <Marker variant="border" className="px-4">
          <MarkerContent>{[...typingUsers.values()].join(", ")} está escribiendo...</MarkerContent>
        </Marker>
      )}

      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} onBlur={stopTyping} />

      <div ref={messagesEndRef} />
    </div>
  );
}
