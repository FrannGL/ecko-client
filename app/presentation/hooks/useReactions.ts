import { useMutation } from "@tanstack/react-query";

import { reactionRepository } from "@/data/repositories/reaction.repository.impl";

/**
 * Hook to toggle reaction on a message
 * Sends request to backend and waits for WebSocket event to update UI
 * No optimistic updates - relies on WS for all clients including requester
 */
export function useToggleReaction(channelId: number, messageId: number) {
  return useMutation({
    mutationFn: (emoji: string) => reactionRepository.toggle(channelId, messageId, emoji),
    // No onSuccess callback - WebSocket event will handle UI updates for all clients
  });
}
