import type { CreateServerInput, Server } from "../../domain/models/server";
import type { ServerRepository } from "../../domain/repositories/server.repository";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const serverRepository: ServerRepository = {
  async getAll(): Promise<Server[]> {
    return api.get(ENDPOINTS.servers.list).json<Server[]>();
  },
  async getById(id: number): Promise<Server> {
    return api.get(ENDPOINTS.servers.byId(id)).json<Server>();
  },
  async create(data: CreateServerInput): Promise<Server> {
    return api.post(ENDPOINTS.servers.create, { json: data }).json<Server>();
  },
  async update(id: number, data: CreateServerInput): Promise<Server> {
    return api.put(ENDPOINTS.servers.update(id), { json: data }).json<Server>();
  },
  async delete(id: number): Promise<void> {
    await api.delete(ENDPOINTS.servers.delete(id));
  },
  async getInviteCode(id: number): Promise<string> {
    return api.get(ENDPOINTS.servers.inviteCode(id)).text();
  },
  async joinByInviteCode(code: string): Promise<Server> {
    return api.post(ENDPOINTS.servers.joinByInviteCode(code)).json<Server>();
  },
};
