/**
 * Send Message Use Case
 * Handles all business logic for sending a message
 * - Validates input
 * - Orchestrates repository calls
 * - Defines transaction boundary
 */
import type { SendMessageInput } from "../../domain/models/message";
import type { MessageRepository } from "../../domain/repositories/message.repository";
import { UseCase } from "./BaseUseCase";

export interface SendMessageUseCaseInput {
  channelId: number;
  data: SendMessageInput;
}

export class SendMessageUseCase extends UseCase<SendMessageUseCaseInput, void> {
  constructor(private messageRepository: MessageRepository) {
    super();
  }

  async execute(input: SendMessageUseCaseInput): Promise<void> {
    const { channelId, data } = input;

    // Validation
    if (!channelId || channelId <= 0) {
      throw new Error("Invalid channel ID");
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error("Message content cannot be empty");
    }

    // Business logic: Send message via repository
    // Transaction boundary: This method defines the atomic operation
    await this.messageRepository.send(channelId, data);
  }
}
