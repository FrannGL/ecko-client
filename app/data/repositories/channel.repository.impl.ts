import type { ActiveUsersResponse, Channel, CreateChannelInput } from "../../domain/models/channel";
import type { ChannelRepository } from "../../domain/repositories/channel.repository";
import { api } from "../api/client";

export const channelRepository: ChannelRepository = {
  async getByServer(serverId: number): Promise<Channel[]> {
    return api.get(`api/servers/${serverId}/channels`).json<Channel[]>();
  },
  async getById(id: number): Promise<Channel> {
    return api.get(`api/channels/${id}`).json<Channel>();
  },
  async create(serverId: number, data: CreateChannelInput): Promise<Channel> {
    return api.post(`api/servers/${serverId}/channels`, { json: data }).json<Channel>();
  },
  async update(id: number, data: CreateChannelInput): Promise<Channel> {
    return api.put(`api/channels/${id}`, { json: data }).json<Channel>();
  },
  async delete(id: number): Promise<void> {
    await api.delete(`api/channels/${id}`);
  },
  async getActiveUsers(serverId: number, channelId: number): Promise<ActiveUsersResponse> {
    return api.get(`api/servers/${serverId}/channels/${channelId}/active-users`).json<ActiveUsersResponse>();
  },
};
