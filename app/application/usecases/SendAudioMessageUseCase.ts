/**
 * Send Audio Message Use Case
 * Orchestrates validation and repository call for voice messages
 */
import type { SendAudioMessageInput } from "../../domain/models/message";
import type { MessageRepository } from "../../domain/repositories/message.repository";
import { UseCase } from "./BaseUseCase";

export interface SendAudioMessageUseCaseInput {
  channelId: number;
  data: SendAudioMessageInput;
}

export class SendAudioMessageUseCase extends UseCase<SendAudioMessageUseCaseInput, void> {
  constructor(private messageRepository: MessageRepository) {
    super();
  }

  async execute(input: SendAudioMessageUseCaseInput): Promise<void> {
    const { channelId, data } = input;

    if (!channelId || channelId <= 0) {
      throw new Error("Invalid channel ID");
    }

    if (!data.file || data.file.size === 0) {
      throw new Error("Audio file cannot be empty");
    }

    if (data.durationMs < 1 || data.durationMs > 60000) {
      throw new Error("Audio duration must be between 1 and 60 seconds");
    }

    await this.messageRepository.sendAudioMessage(channelId, data);
  }
}
