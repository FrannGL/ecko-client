import type { Message } from "@/domain/models";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bubble, BubbleContent } from "../ui/bubble";
import {
  MessageAvatar,
  Message as MessageComponent,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "../ui/message";
import { MessageReactions } from "./MessageReactions";

interface MessageItemProps {
  message: Message;
  channelId: number;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isOwn: boolean;
  currentUserId: number | undefined;
}

export function MessageItem({
  message,
  channelId,
  isFirstInGroup,
  isLastInGroup,
  isOwn,
  currentUserId,
}: MessageItemProps) {
  return (
    <MessageComponent align={isOwn ? "end" : "start"}>
      <MessageAvatar>
        {isFirstInGroup && (
          <Avatar>
            <AvatarFallback className="text-xs font-medium">
              {message.authorUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </MessageAvatar>

      <MessageContent>
        {isFirstInGroup && <MessageHeader>{message.authorUsername}</MessageHeader>}

        <div className="flex flex-col group-data-[align=end]/message:items-end max-w-[85%]">
          <MessageReactions
            channelId={channelId}
            messageId={message.id}
            reactions={message.reactions}
            currentUserId={currentUserId}
          >
            <Bubble variant={isOwn ? "default" : "muted"}>
              <BubbleContent>
                <p className="text-sm">{message.content}</p>
              </BubbleContent>
            </Bubble>
          </MessageReactions>
        </div>

        {isLastInGroup && (
          <MessageFooter>
            <span className="text-[10px] text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </MessageFooter>
        )}
      </MessageContent>
    </MessageComponent>
  );
}
