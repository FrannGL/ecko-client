import { useActiveUsers } from "@/presentation/hooks/useActiveUsers";

interface ChannelHeaderProps {
  channelName: string | undefined;
  serverId: number;
  channelId: number;
}

export function ChannelHeader({ channelName, serverId, channelId }: ChannelHeaderProps) {
  const { data: activeUsers, isLoading } = useActiveUsers(serverId, channelId);

  return (
    <div className="h-12 px-4 flex items-center justify-between border-b border-border shrink-0">
      <h1 className="font-display text-sm font-semibold text-white truncate">#{channelName}</h1>

      {!isLoading && activeUsers && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>
            {activeUsers.count} {activeUsers.count === 1 ? "usuario" : "usuarios"} activos
          </span>
        </div>
      )}
    </div>
  );
}
