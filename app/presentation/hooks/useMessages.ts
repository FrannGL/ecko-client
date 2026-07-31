import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SendMessageUseCase } from "../../application/usecases";
import { messageRepository } from "../../data/repositories/message.repository.impl";
import type { SendMessageInput } from "../../domain/models/message";

export function useMessages(channelId: number) {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => messageRepository.getByChannel(channelId),
    enabled: !!channelId,
  });
}

export function useSendMessage(channelId: number) {
  const usecase = new SendMessageUseCase(messageRepository);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageInput) =>
      // Use case orchestrates validation + repository call
      // Clean abstraction: transaction boundary defined in usecase layer
      usecase.execute({ channelId, data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", channelId] }),
  });
}

export function useToggleReaction(channelId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
      messageRepository.toggleReaction(channelId, messageId, { emoji }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", channelId] }),
  });
}
