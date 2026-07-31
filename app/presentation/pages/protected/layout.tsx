import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { connectStomp, disconnectStomp } from "@/data/websocket/stompClient";
import type { CreateChannelInput, CreateServerInput, Server } from "@/domain/models";
import { ChannelList } from "@/presentation/components/ChannelList";
import { ServerDialogs } from "@/presentation/components/ServerDialogs";
import { ServerNav } from "@/presentation/components/ServerNav";
import { useChannels, useCreateChannel } from "@/presentation/hooks/useChannels";
import { useCreateServer, useServers } from "@/presentation/hooks/useServers";
import { useAuthStore } from "@/presentation/store/authStore";
import { useUIStore } from "@/presentation/store/uiStore";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const { data: servers = [], isLoading, error } = useServers();
  const { isAuthenticated, logout: logoutStore, user } = useAuthStore();
  const { selectedServerId, setSelectedServer, selectedChannelId, setSelectedChannel } = useUIStore();
  const { data: channels } = useChannels(selectedServerId!);

  // UI state
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  // Mutations - memoize createChannel key based on selectedServerId
  const createServer = useCreateServer();
  const createChannel = useCreateChannel(selectedServerId || 0);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated]);

  // WebSocket connection
  useEffect(() => {
    connectStomp();
    return () => disconnectStomp();
  }, []);

  // Handlers
  const handleCreateServer = (data: CreateServerInput) => {
    createServer.mutate(data, {
      onSuccess: (server) => {
        setShowCreateServer(false);
        setSelectedServer(server.id);
      },
    });
  };

  const handleCreateChannel = (data: CreateChannelInput) => {
    createChannel.mutate(data, {
      onSuccess: () => {
        setShowCreateChannel(false);
      },
    });
  };

  const handleLogout = () => {
    logoutStore();
    navigate("/login");
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center text-muted-foreground">Cargando servidores...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        <div className="text-center">
          <p className="font-semibold">No se pudieron cargar los servidores</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ServerNav
        servers={servers}
        selectedServerId={selectedServerId}
        user={user}
        onSelectServer={(id) => setSelectedServer(selectedServerId === id ? null : id)}
        onCreateServer={() => setShowCreateServer(true)}
        onLogout={handleLogout}
      />

      <ChannelList
        channels={channels}
        selectedChannelId={selectedChannelId}
        selectedServerId={selectedServerId}
        onSelectChannel={setSelectedChannel}
        onCreateChannel={() => setShowCreateChannel(true)}
        serverName={servers?.find((s: Server) => s.id === selectedServerId)?.name}
        myRole={servers?.find((s: Server) => s.id === selectedServerId)?.myRole}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>

      <ServerDialogs
        showCreateServer={showCreateServer}
        setShowCreateServer={setShowCreateServer}
        showCreateChannel={showCreateChannel}
        setShowCreateChannel={setShowCreateChannel}
        onCreateServer={handleCreateServer}
        onCreateChannel={handleCreateChannel}
        createServerMutation={createServer}
        createChannelMutation={createChannel}
      />
    </div>
  );
}
