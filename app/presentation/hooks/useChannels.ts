import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateChannelUseCase } from "../../application/usecases";
import { channelRepository } from "../../data/repositories/channel.repository.impl";
import type { Channel, CreateChannelInput } from "../../domain/models/channel";

export function useChannels(serverId: number) {
  return useQuery({
    queryKey: ["channels", serverId],
    queryFn: () => channelRepository.getByServer(serverId),
    enabled: !!serverId,
  });
}

export function useCreateChannel(serverId: number) {
  const usecase = new CreateChannelUseCase(channelRepository);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChannelInput) => usecase.execute({ serverId, data }),
    onSuccess: (newChannel) => {
      // Update cache directly instead of refetching
      qc.setQueryData(["channels", serverId], (old: Channel[] | undefined) => {
        if (!old) return [newChannel];
        return [...old, newChannel];
      });
    },
  });
}

export function useDeleteChannel(serverId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (channelId: number) => channelRepository.delete(channelId),
    onSuccess: (_, deletedChannelId) => {
      // Update cache by removing the deleted channel
      qc.setQueryData(["channels", serverId], (old: Channel[] | undefined) => {
        if (!old) return undefined;
        return old.filter((c: Channel) => c.id !== deletedChannelId);
      });
    },
  });
}
