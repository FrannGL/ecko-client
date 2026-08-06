import { Link } from "react-router-dom";

import { Plus } from "lucide-react";

import type { Channel } from "@/domain/models";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui";
import { useActiveUsers } from "@/presentation/hooks/useActiveUsers";

import { useAuthStore } from "../../store/authStore";

interface ChannelListProps {
  channels: Channel[] | undefined;
  selectedChannelId: number | null;
  selectedServerId: number | null;
  onSelectChannel: (id: number) => void;
  onCreateChannel: () => void;
  serverName: string | undefined;
  myRole: "ADMIN" | "MODERATOR" | "MEMBER" | undefined;
}

export function ChannelList({
  channels,
  selectedChannelId,
  selectedServerId,
  onSelectChannel,
  onCreateChannel,
  serverName,
  myRole,
}: ChannelListProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col border-r border-border/50 shrink-0 bg-card/10 backdrop-blur-md shadow-[4px_0_24px_-4px_rgba(0,0,0,0.1)] relative z-10 ${
        selectedServerId ? "w-60 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div className="h-16 px-5 flex items-center justify-between border-b border-border/50 bg-background/20 shrink-0 shadow-sm">
        <h2 className="font-display text-base font-semibold tracking-tight text-foreground truncate">{serverName}</h2>
        {(myRole === "ADMIN" || myRole === "MODERATOR") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateChannel}
                className="w-8 h-8 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
              >
                <Plus size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium text-sm">
              Crear canal
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 mb-2 px-2">
          Canales Disponibles
        </div>
        {channels?.map((channel) => (
          <Link
            key={channel.id}
            to={`/server/${selectedServerId}/channel/${channel.id}`}
            onClick={() => onSelectChannel(channel.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedChannelId === channel.id
                ? "bg-primary/20 text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span
              className={`text-lg font-light ${selectedChannelId === channel.id ? "text-primary/70" : "text-muted-foreground/50"}`}
            >
              #
            </span>
            <span className="truncate">{channel.name}</span>
            <ChannelActiveCount serverId={selectedServerId!} channelId={channel.id} />
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-border/50 bg-background/30">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-inner group-hover:scale-105 transition-transform">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex flex-col overflow-hidden leading-tight">
            <span className="text-sm font-semibold text-foreground truncate">{user?.username || "Usuario"}</span>
            <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              {myRole || "Miembro"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChannelActiveCount({ serverId, channelId }: { serverId: number; channelId: number }) {
  const { data } = useActiveUsers(serverId, channelId);

  if (data == null) return null;

  return <span className="ml-auto text-[10px] text-muted-foreground/70 tabular-nums shrink-0">({data.count})</span>;
}
