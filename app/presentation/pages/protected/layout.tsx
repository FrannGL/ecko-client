import { Outlet } from "react-router-dom";

import { ChannelList } from "@/presentation/components/custom/ChannelList";
import { Loading } from "@/presentation/components/custom/Loading";
import { ServerDialogs } from "@/presentation/components/custom/ServerDialogs";
import { ServerNav } from "@/presentation/components/custom/ServerNav";
import { useProtectedLayout } from "@/presentation/hooks/useProtectedLayout";

export default function ProtectedLayout() {
  const {
    servers,
    channels,
    user,
    selectedServerId,
    selectedChannelId,
    createServer,
    createChannel,
    showCreateServer,
    setShowCreateServer,
    showCreateChannel,
    setShowCreateChannel,
    isLoading,
    error,
    handleCreateServer,
    handleCreateChannel,
    handleLogout,
    handleSelectServer,
    setSelectedChannel,
    selectedServer,
  } = useProtectedLayout();

  if (isLoading) {
    return <Loading label="Cargando servidores..." />;
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
        onSelectServer={handleSelectServer}
        onCreateServer={() => setShowCreateServer(true)}
        onLogout={handleLogout}
      />

      <ChannelList
        channels={channels}
        selectedChannelId={selectedChannelId}
        selectedServerId={selectedServerId}
        onSelectChannel={setSelectedChannel}
        onCreateChannel={() => setShowCreateChannel(true)}
        serverName={selectedServer?.name}
        myRole={selectedServer?.myRole}
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
