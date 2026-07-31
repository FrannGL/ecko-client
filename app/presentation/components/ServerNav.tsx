import { Plus } from "lucide-react";

import type { Server } from "@/domain/models";
import type { User } from "@/domain/models/auth";
import { Button } from "@/presentation/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";

import { Logo } from "./Logo";
import { LogoutDialog } from "./LogoutDialog";

interface ServerNavProps {
  servers: Server[] | undefined;
  selectedServerId: number | null;
  user: User | null;
  onSelectServer: (id: number | null) => void;
  onCreateServer: () => void;
  onLogout: () => void;
}

export function ServerNav({
  servers,
  selectedServerId,
  user,
  onSelectServer,
  onCreateServer,
  onLogout,
}: ServerNavProps) {
  return (
    <nav className="w-20 bg-sidebar flex flex-col items-center py-3 gap-2 border-r border-border shrink-0">
      <Logo size={64} showText={false} />

      <div className="w-8 h-px bg-border my-1" />

      {servers?.map((server) => (
        <Tooltip key={server.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSelectServer(selectedServerId === server.id ? null : server.id);
              }}
              className={`w-10 h-10 rounded-xl text-sm font-medium ${
                selectedServerId === server.id
                  ? "bg-(--color-primary-dark) text-white hover:bg-(--color-primary-dark)"
                  : "bg-(--color-muted-dark) text-white hover:bg-(--color-primary-dark)"
              }`}
            >
              {server.name.charAt(0).toUpperCase()}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{server.name}</TooltipContent>
        </Tooltip>
      ))}

      {user?.role === "ADMIN" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateServer}
              className="w-10 h-10 rounded-xl bg-(--color-muted-dark) text-white hover:bg-(--color-primary-dark)"
            >
              <Plus size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Create Server</TooltipContent>
        </Tooltip>
      )}

      <div className="flex-1" />

      <LogoutDialog onLogout={onLogout} />
    </nav>
  );
}
