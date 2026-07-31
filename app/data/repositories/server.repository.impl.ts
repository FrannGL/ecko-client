import type { CreateServerInput, Server } from "../../domain/models/server";
import type { ServerRepository } from "../../domain/repositories/server.repository";
import { api } from "../api/client";

export const serverRepository: ServerRepository = {
  async getAll(): Promise<Server[]> {
    return api.get("api/servers").json<Server[]>();
  },
  async getById(id: number): Promise<Server> {
    return api.get(`api/servers/${id}`).json<Server>();
  },
  async create(data: CreateServerInput): Promise<Server> {
    return api.post("api/servers", { json: data }).json<Server>();
  },
  async update(id: number, data: CreateServerInput): Promise<Server> {
    return api.put(`api/servers/${id}`, { json: data }).json<Server>();
  },
  async delete(id: number): Promise<void> {
    await api.delete(`api/servers/${id}`);
  },
  async getInviteCode(id: number): Promise<string> {
    return api.get(`api/servers/${id}/invite`).text();
  },
  async joinByInviteCode(code: string): Promise<Server> {
    return api.post(`api/servers/invite/${code}`).json<Server>();
  },
};
