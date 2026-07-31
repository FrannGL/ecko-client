import { Link } from "react-router-dom";

import { Plus } from "lucide-react";

import type { Channel } from "@/domain/models";
import { Button } from "@/presentation/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";

import { useAuthStore } from "../store/authStore";

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
      className={`overflow-hidden transition-all duration-200 ease-in-out flex flex-col border-r border-border shrink-0 ${
        selectedServerId ? "w-56 opacity-100" : "w-0 opacity-0"
      }`}
    >
      <div className="h-12 px-3 flex items-center gap-1 border-b border-border">
        <h2 className="font-display text-sm font-semibold text-white truncate flex-1">{serverName}</h2>
        {(myRole === "ADMIN" || myRole === "MODERATOR") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onCreateChannel} className="w-6 h-6 rounded-md">
                <Plus size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Crear canal</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {channels
          ?.filter((c) => c.type === "TEXT")
          .map((channel) => (
            <Link
              key={channel.id}
              to={`/server/${selectedServerId}/channel/${channel.id}`}
              onClick={() => onSelectChannel(channel.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedChannelId === channel.id
                  ? "bg-(--color-primary-dark) text-white"
                  : "text-white hover:bg-(--color-primary-dark) hover:text-white"
              }`}
            >
              <span className="text-white">#</span>
              <span className="truncate">{channel.name}</span>
            </Link>
          ))}
      </div>

      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-(--color-primary-dark) flex items-center justify-center text-xs font-medium text-white">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="text-sm text-white truncate">{user?.username || "User"}</span>
        </div>
      </div>
    </aside>
  );
}
