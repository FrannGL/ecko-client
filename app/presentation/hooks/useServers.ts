import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateServerUseCase, JoinServerUseCase } from "../../application/usecases";
import { serverRepository } from "../../data/repositories/server.repository.impl";
import type { CreateServerInput, Server } from "../../domain/models/server";

export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: () => serverRepository.getAll(),
  });
}

export function useServer(id: number) {
  return useQuery({
    queryKey: ["servers", id],
    queryFn: () => serverRepository.getById(id),
    enabled: !!id,
  });
}

export function useCreateServer() {
  const usecase = new CreateServerUseCase(serverRepository);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServerInput) =>
      // Use case orchestrates validation + repository call
      usecase.execute(data),
    onSuccess: (newServer) => {
      // Update cache directly instead of refetching
      qc.setQueryData(["servers"], (old: Server[] | undefined) => {
        if (!old) return [newServer];
        return [...old, newServer];
      });
    },
  });
}

export function useDeleteServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => serverRepository.delete(id),
    onSuccess: (_, deletedServerId) => {
      // Update cache by removing the deleted server
      qc.setQueryData(["servers"], (old: Server[] | undefined) => {
        if (!old) return undefined;
        return old.filter((s) => s.id !== deletedServerId);
      });
    },
  });
}

export function useInviteCode(serverId: number) {
  return useQuery({
    queryKey: ["inviteCode", serverId],
    queryFn: () => serverRepository.getInviteCode(serverId),
    enabled: false,
  });
}

export function useJoinServer() {
  const usecase = new JoinServerUseCase(serverRepository);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      // Use case orchestrates validation + repository call
      usecase.execute(code),
    onSuccess: (joinedServer) => {
      // Update cache directly instead of refetching
      qc.setQueryData(["servers"], (old: Server[] | undefined) => {
        if (!old) return [joinedServer];
        // Avoid duplicates
        if (old.some((s) => s.id === joinedServer.id)) return old;
        return [...old, joinedServer];
      });
    },
  });
}
