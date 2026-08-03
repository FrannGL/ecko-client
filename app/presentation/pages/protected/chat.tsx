import { ChannelHeader } from "@/presentation/components/custom/ChannelHeader";
import { MessageInput } from "@/presentation/components/custom/MessageInput";
import { MessageList } from "@/presentation/components/custom/MessageList";
import { Marker, MarkerContent } from "@/presentation/components/ui";
import { useChat } from "@/presentation/hooks/useChat";

export default function ChatPage() {
  const {
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
  } = useChat();

  if (!numChannelId) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a channel</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChannelHeader channelName={currentChannel?.name} serverId={numServerId} channelId={numChannelId} />

      <MessageList messages={localMessages} currentUserId={user?.id} channelId={numChannelId} />

      {typingUsers.size > 0 && (
        <Marker variant="border" className="px-4">
          <MarkerContent>{[...typingUsers.values()].join(", ")} está escribiendo...</MarkerContent>
        </Marker>
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onTyping={handleTyping}
        onBlur={stopTyping}
        isPending={isAudioPending}
      />

      <div ref={messagesEndRef} />
    </div>
  );
}