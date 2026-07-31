import { useActiveUsers } from "@/presentation/hooks/useActiveUsers";

interface ChannelHeaderProps {
  channelName: string | undefined;
  serverId: number;
  channelId: number;
}

export function ChannelHeader({ channelName, serverId, channelId }: ChannelHeaderProps) {
  const { data: activeUsers } = useActiveUsers(serverId, channelId);

  return (
    <div className="h-16 px-6 flex items-center justify-between border-b border-border/50 bg-background/30 backdrop-blur-md shrink-0 shadow-sm z-10">
      <h1 className="font-display text-lg font-semibold tracking-tight text-foreground truncate">
        <span className="text-muted-foreground mr-1">#</span>
        {channelName}
      </h1>

      {activeUsers && (
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span>
            {activeUsers.count} {activeUsers.count === 1 ? "activo" : "activos"}
          </span>
        </div>
      )}
    </div>
  );
}
