import { useEffect, useRef } from "react";

import type { Message } from "@/domain/models";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import {
  MessageAvatar,
  Message as MessageComponent,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./ui/message";

interface MessageListProps {
  messages: Message[];
  currentUserId: number | undefined;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
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
                <MessageComponent key={msg.id} align={isOwn ? "end" : "start"}>
                  <MessageAvatar>
                    {isFirstInGroup && (
                      <Avatar>
                        <AvatarFallback className="text-xs font-medium">
                          {msg.authorUsername.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </MessageAvatar>

                  <MessageContent>
                    {isFirstInGroup && <MessageHeader>{msg.authorUsername}</MessageHeader>}

                    <Bubble variant={isOwn ? "default" : "muted"}>
                      <BubbleContent>
                        <p className="text-sm">{msg.content}</p>
                      </BubbleContent>
                    </Bubble>

                    {isLastInGroup && (
                      <MessageFooter>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </MessageFooter>
                    )}
                  </MessageContent>
                </MessageComponent>
              );
            })}
          </MessageGroup>
        );
      })}
    </div>
  );
}
