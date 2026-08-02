import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { channelRepository } from "../../data/repositories/channel.repository.impl";
import { subscribeToTopic } from "../../data/websocket/stompClient";

interface PresenceFrame {
  userId: number;
  joined: boolean;
  activeCount: number;
}

export function useActiveUsers(serverId: number, channelId: number) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["activeUsers", serverId, channelId],
    queryFn: () => channelRepository.getActiveUsers(serverId, channelId),
    enabled: !!serverId && !!channelId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!serverId || !channelId) return;

    const sub = subscribeToTopic(`/topic/channel/${channelId}/presence`, (message) => {
      try {
        const frame = JSON.parse(message.body) as PresenceFrame;
        if (typeof frame.activeCount === "number") {
          qc.setQueryData(["activeUsers", serverId, channelId], { count: frame.activeCount });
        }
      } catch {
        // Ignore malformed presence frames
      }
    });

    return () => sub.unsubscribe();
  }, [serverId, channelId, qc]);

  return query;
}
