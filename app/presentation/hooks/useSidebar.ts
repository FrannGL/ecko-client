import { useState } from "react";

import { useUIStore } from "@/presentation/store/uiStore";

export function useSidebar() {
  const { selectedServerId, setSelectedServer } = useUIStore();
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showJoinServer, setShowJoinServer] = useState(false);

  return {
    selectedServerId,
    setSelectedServer,
    showCreateServer,
    setShowCreateServer,
    showCreateChannel,
    setShowCreateChannel,
    showJoinServer,
    setShowJoinServer,
  };
}
