import { useEffect, useRef } from "react";

import type { Message } from "@/domain/models";

import { MessageGroup } from "../ui/message";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: number | undefined;
  channelId: number;
}

export function MessageList({ messages, currentUserId, channelId }: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const groupedMessages =
    messages?.reduce((groups, msg) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup[0].authorId === msg.authorId) {
        lastGroup.push(msg);
      } else {
        groups.push([msg]);
      }
      return groups;
    }, [] as Message[][]) ?? [];

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
      {groupedMessages.map((group, groupIndex) => {
        const isOwn = group[0].authorId === currentUserId;

        return (
          <MessageGroup key={`group-${groupIndex}`}>
            {group.map((msg, msgIndex) => {
              const isFirstInGroup = msgIndex === 0;
              const isLastInGroup = msgIndex === group.length - 1;

              return (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  channelId={channelId}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                  isOwn={isOwn}
                  currentUserId={currentUserId}
                />
              );
            })}
          </MessageGroup>
        );
      })}
    </div>
  );
}
