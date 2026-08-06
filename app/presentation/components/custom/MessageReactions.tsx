import { type ReactNode, useMemo } from "react";

import type { MessageReaction } from "@/domain/models/reaction";
import { useToggleReaction } from "@/presentation/hooks/useReactions";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui";

interface MessageReactionsProps {
  channelId: number;
  messageId: number;
  reactions: MessageReaction[] | undefined;
  currentUserId: number | undefined;
  children?: ReactNode;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🔥", "😮", "😢", "🎉", "🤔"];

export function MessageReactions({
  children,
  channelId,
  messageId,
  reactions = [],
  currentUserId,
}: MessageReactionsProps) {
  const toggleReactionMutation = useToggleReaction(channelId, messageId);

  const groupedReactions = useMemo(() => {
    const groups = new Map<string, { count: number; userReacted: boolean }>();

    reactions.forEach((reaction) => {
      const existing = groups.get(reaction.emoji) || { count: 0, userReacted: false };
      groups.set(reaction.emoji, {
        count: existing.count + 1,
        userReacted: existing.userReacted || reaction.userId === currentUserId,
      });
    });

    return groups;
  }, [reactions, currentUserId]);

  const handleReactionClick = async (emoji: string) => {
    try {
      await toggleReactionMutation.mutateAsync(emoji);
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  return (
    <div className="flex flex-col group-data-[align=end]/message:items-end w-fit">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="cursor-pointer inline-flex">{children}</div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          sideOffset={8}
          className="p-3 bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl animate-in zoom-in-95 fade-in-0 duration-150"
        >
          <div className="grid grid-cols-4 gap-2">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 hover:scale-110 transition-all cursor-pointer text-xl"
                onClick={() => handleReactionClick(emoji)}
                disabled={toggleReactionMutation.isPending}
              >
                {emoji}
              </button>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>

      {groupedReactions.size > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap group-data-[align=end]/message:justify-end">
          {Array.from(groupedReactions).map(([emoji, { count, userReacted }]) => (
            <button
              key={emoji}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${
                userReacted
                  ? "bg-primary/20 border-primary/40 text-primary-foreground hover:bg-primary/30"
                  : "bg-background/40 backdrop-blur-md border-border/50 text-foreground hover:bg-background/60 hover:border-border/80"
              }`}
              onClick={() => handleReactionClick(emoji)}
              disabled={toggleReactionMutation.isPending}
            >
              <span className="text-sm">{emoji}</span>
              <span>{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
