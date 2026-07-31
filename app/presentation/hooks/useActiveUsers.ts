import { useQuery } from "@tanstack/react-query";

import { channelRepository } from "../../data/repositories/channel.repository.impl";

export function useActiveUsers(serverId: number, channelId: number) {
  return useQuery({
    queryKey: ["activeUsers", serverId, channelId],
    queryFn: () => channelRepository.getActiveUsers(serverId, channelId),
    enabled: !!serverId && !!channelId,
    // Refetch every 10 seconds to keep active users count fresh
    refetchInterval: 10000,
  });
}
