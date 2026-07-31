import type { UseMutationResult } from "@tanstack/react-query";

import type { Channel, CreateChannelInput, CreateServerInput, Server } from "@/domain/models";

import { CreateChannelDialog } from "./dialogs/CreateChannelDialog";
import { CreateServerDialog } from "./dialogs/CreateServerDialog";

interface ServerDialogsProps {
  showCreateServer: boolean;
  setShowCreateServer: (show: boolean) => void;
  showCreateChannel: boolean;
  setShowCreateChannel: (show: boolean) => void;
  onCreateServer: (data: CreateServerInput) => void;
  onCreateChannel: (data: CreateChannelInput) => void;
  createServerMutation: UseMutationResult<Server, Error, CreateServerInput>;
  createChannelMutation: UseMutationResult<Channel, Error, CreateChannelInput>;
}

export function ServerDialogs({
  showCreateServer,
  setShowCreateServer,
  showCreateChannel,
  setShowCreateChannel,
  onCreateServer,
  onCreateChannel,
  createServerMutation,
  createChannelMutation,
}: ServerDialogsProps) {
  return (
    <>
      <CreateServerDialog
        open={showCreateServer}
        onOpenChange={setShowCreateServer}
        onSubmit={onCreateServer}
        mutation={createServerMutation}
      />
      <CreateChannelDialog
        open={showCreateChannel}
        onOpenChange={setShowCreateChannel}
        onSubmit={onCreateChannel}
        mutation={createChannelMutation}
      />
    </>
  );
}
