import { Plus } from "lucide-react";

import type { Server } from "@/domain/models";
import type { User } from "@/domain/models/auth";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui";

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
    <nav className="w-20 bg-card/20 backdrop-blur-xl flex flex-col items-center py-4 gap-3 border-r border-border/50 shrink-0 relative z-20 shadow-xl">
      <div className="mb-2">
        <Logo size={64} showText={false} />
      </div>

      <div className="w-8 h-px bg-border/50 my-1" />

      {servers?.map((server) => (
        <Tooltip key={server.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSelectServer(selectedServerId === server.id ? null : server.id);
              }}
              className={`w-12 h-12 rounded-[16px] text-lg font-display font-semibold transition-all duration-200 shadow-sm ${
                selectedServerId === server.id
                  ? "bg-primary text-primary-foreground shadow-primary/20 scale-105"
                  : "bg-background/50 border border-border/50 text-foreground"
              }`}
            >
              {server.name.charAt(0).toUpperCase()}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-sm">
            {server.name}
          </TooltipContent>
        </Tooltip>
      ))}

      {user?.role === "ADMIN" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateServer}
              className="w-12 h-12 rounded-[16px] bg-background/30 border border-border/50 border-dashed text-muted-foreground hover:text-foreground hover:bg-background/50 hover:border-solid transition-all duration-200 mt-2"
            >
              <Plus size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-sm">
            Crear Servidor
          </TooltipContent>
        </Tooltip>
      )}

      <div className="flex-1" />

      <LogoutDialog onLogout={onLogout} />
    </nav>
  );
}
