import type { ActiveUsersResponse, Channel, CreateChannelInput } from "../../domain/models/channel";
import type { ChannelRepository } from "../../domain/repositories/channel.repository";
import { api } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export const channelRepository: ChannelRepository = {
  async getByServer(serverId: number): Promise<Channel[]> {
    return api.get(ENDPOINTS.servers.channels(serverId)).json<Channel[]>();
  },
  async getById(id: number): Promise<Channel> {
    return api.get(ENDPOINTS.channels.byId(id)).json<Channel>();
  },
  async create(serverId: number, data: CreateChannelInput): Promise<Channel> {
    return api.post(ENDPOINTS.servers.createChannel(serverId), { json: data }).json<Channel>();
  },
  async update(id: number, data: CreateChannelInput): Promise<Channel> {
    return api.put(ENDPOINTS.channels.update(id), { json: data }).json<Channel>();
  },
  async delete(id: number): Promise<void> {
    await api.delete(ENDPOINTS.channels.delete(id));
  },
  async getActiveUsers(serverId: number, channelId: number): Promise<ActiveUsersResponse> {
    return api.get(ENDPOINTS.servers.activeUsers(serverId, channelId)).json<ActiveUsersResponse>();
  },
};
