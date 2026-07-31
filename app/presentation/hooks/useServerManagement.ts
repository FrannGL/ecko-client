import { useState } from "react";

import { useCreateServer, useInviteCode, useJoinServer } from "./useServers";

export function useServerManagement() {
  const [inviteCopied, setInviteCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);

  const createServer = useCreateServer();
  const { refetch: fetchInviteCode } = useInviteCode(selectedServerId || 0);
  const joinServer = useJoinServer();

  const handleInvite = async (serverId: number | null) => {
    if (!serverId) return;
    setSelectedServerId(serverId);

    // Usar refetch con el ID actualizado
    const { data } = await fetchInviteCode();
    if (data) {
      await navigator.clipboard.writeText(data);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    }
  };

  const handleJoinServer = (code: string, onSuccess: () => void) => {
    if (!code.trim()) return;
    joinServer.mutate(code.trim(), {
      onSuccess: () => {
        setJoinCode("");
        onSuccess();
      },
    });
  };

  return {
    createServer,
    inviteCopied,
    joinCode,
    setJoinCode,
    handleInvite,
    handleJoinServer,
    joinServer,
  };
}
