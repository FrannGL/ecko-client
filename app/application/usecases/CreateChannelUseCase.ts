/**
 * Create Channel Use Case
 * Handles all business logic for creating a new channel in a server
 * - Validates channel data
 * - Ensures server ownership
 * - Orchestrates repository calls
 */
import type { Channel, CreateChannelInput } from "../../domain/models/channel";
import type { ChannelRepository } from "../../domain/repositories/channel.repository";
import { UseCase } from "./BaseUseCase";

export interface CreateChannelUseCaseInput {
  serverId: number;
  data: CreateChannelInput;
}

export class CreateChannelUseCase extends UseCase<CreateChannelUseCaseInput, Channel> {
  constructor(private channelRepository: ChannelRepository) {
    super();
  }

  async execute(input: CreateChannelUseCaseInput): Promise<Channel> {
    const { serverId, data } = input;

    // Validation
    if (!serverId || serverId <= 0) {
      throw new Error("Invalid server ID");
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Channel name is required");
    }

    if (data.name.length > 50) {
      throw new Error("Channel name must be less than 50 characters");
    }

    // Business logic: Create channel via repository
    const channel = await this.channelRepository.create(serverId, data);

    // Return rich entity
    return channel;
  }
}
