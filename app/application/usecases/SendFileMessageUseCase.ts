/**
 * Send File Message Use Case
 * Orchestrates validation and repository call for file attachments (images/documents)
 */
import type { SendFileMessageInput } from "../../domain/models/message";
import type { MessageRepository } from "../../domain/repositories/message.repository";
import { UseCase } from "./BaseUseCase";

export interface SendFileMessageUseCaseInput {
  channelId: number;
  data: SendFileMessageInput;
}

export class SendFileMessageUseCase extends UseCase<SendFileMessageUseCaseInput, void> {
  constructor(private messageRepository: MessageRepository) {
    super();
  }

  async execute(input: SendFileMessageUseCaseInput): Promise<void> {
    const { channelId, data } = input;

    if (!channelId || channelId <= 0) {
      throw new Error("Invalid channel ID");
    }

    if (!data.file || data.file.size === 0) {
      throw new Error("File cannot be empty");
    }

    const MAX_SIZE = 25 * 1024 * 1024;
    if (data.file.size > MAX_SIZE) {
      throw new Error("File exceeds maximum size of 25 MB");
    }

    await this.messageRepository.sendFileMessage(channelId, data);
  }
}
