import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { connectStomp, disconnectStomp } from "@/data/websocket/stompClient";
import type { CreateChannelInput, CreateServerInput } from "@/domain/models";
import { useChannels, useCreateChannel } from "@/presentation/hooks/useChannels";
import { useCreateServer, useServers } from "@/presentation/hooks/useServers";
import { useAuthStore } from "@/presentation/store/authStore";
import { useUIStore } from "@/presentation/store/uiStore";

export function useProtectedLayout() {
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

  const handleSelectServer = (id: number | null) => {
    setSelectedServer(selectedServerId === id ? null : id);
  };

  const selectedServer = servers.find((s) => s.id === selectedServerId);

  return {
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
  };
}