import { Download } from "lucide-react";

import type { Message } from "@/domain/models";
import { FileIcon } from "@/presentation/components/custom/file-icon/file-icon";
import { useSignedMediaUrl } from "@/presentation/hooks/useMessages";

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
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";

interface MessageItemProps {
  message: Message;
  channelId: number;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isOwn: boolean;
  currentUserId: number | undefined;
}

function ImageAttachment({
  message,
  channelId,
  align,
}: {
  message: Message;
  channelId: number;
  align: "start" | "end";
}) {
  const { data: signedUrl } = useSignedMediaUrl(channelId, message.id);

  return (
    <Bubble variant={align === "end" ? "default" : "muted"}>
      <div className="max-w-70 overflow-hidden rounded-lg">
        {signedUrl ? (
          <img
            src={signedUrl}
            alt={message.mediaName || "Imagen"}
            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-40 bg-muted animate-pulse rounded-lg" />
        )}
        {message.content && (
          <BubbleContent>
            <p className="text-sm mt-1">{message.content}</p>
          </BubbleContent>
        )}
      </div>
    </Bubble>
  );
}

function DocumentAttachment({
  message,
  channelId,
  align,
}: {
  message: Message;
  channelId: number;
  align: "start" | "end";
}) {
  const { data: signedUrl } = useSignedMediaUrl(channelId, message.id);

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!signedUrl) return;

    const fileName = message.mediaName || "archivo";

    try {
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch {
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Bubble variant={align === "end" ? "default" : "muted"}>
      <div className="flex items-center gap-3 min-w-50 max-w-75 p-3 rounded-lg border border-border/50 bg-background/50">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <FileIcon mediaType={message.mediaType} className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{message.mediaName || "Documento"}</p>
          <p className="text-xs text-muted-foreground">{formatSize(message.mediaSize)}</p>
        </div>
        {signedUrl && (
          <a
            href={signedUrl}
            onClick={handleDownload}
            className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Download className="size-4 text-muted-foreground" />
          </a>
        )}
      </div>
      {message.content && (
        <div className="mt-1">
          <BubbleContent>
            <p className="text-sm">{message.content}</p>
          </BubbleContent>
        </div>
      )}
    </Bubble>
  );
}

export function MessageItem({
  message,
  channelId,
  isFirstInGroup,
  isLastInGroup,
  isOwn,
  currentUserId,
}: MessageItemProps) {
  const renderMedia = () => {
    const align = isOwn ? "end" : "start";

    if (message.isAudio()) {
      return (
        <VoiceMessagePlayer
          channelId={channelId}
          messageId={message.id}
          durationMs={message.durationMs}
          align={align}
        />
      );
    }

    if (message.isImage()) {
      return <ImageAttachment message={message} channelId={channelId} align={align} />;
    }

    if (message.isDocument()) {
      return <DocumentAttachment message={message} channelId={channelId} align={align} />;
    }

    return (
      <Bubble variant={isOwn ? "default" : "muted"}>
        <BubbleContent>
          <p className="text-sm">{message.content}</p>
        </BubbleContent>
      </Bubble>
    );
  };

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
            {renderMedia()}
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
