import type { ActiveUsersResponse, Channel, CreateChannelInput } from "../models/channel";

export interface ChannelRepository {
  getByServer(serverId: number): Promise<Channel[]>;
  getById(id: number): Promise<Channel>;
  create(serverId: number, data: CreateChannelInput): Promise<Channel>;
  update(id: number, data: CreateChannelInput): Promise<Channel>;
  delete(id: number): Promise<void>;
  getActiveUsers(serverId: number, channelId: number): Promise<ActiveUsersResponse>;
}
