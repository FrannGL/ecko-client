/**
 * Join Server Use Case
 * Handles all business logic for joining a server via invite code
 * - Validates invite code format
 * - Orchestrates repository calls
 * - Returns joined server entity
 */
import type { Server } from "../../domain/models/server";
import type { ServerRepository } from "../../domain/repositories/server.repository";
import { UseCase } from "./BaseUseCase";

export class JoinServerUseCase extends UseCase<string, Server> {
  constructor(private serverRepository: ServerRepository) {
    super();
  }

  async execute(inviteCode: string): Promise<Server> {
    // Validation
    if (!inviteCode || inviteCode.trim().length === 0) {
      throw new Error("Invite code is required");
    }

    const code = inviteCode.trim().toUpperCase();
    if (code.length < 4) {
      throw new Error("Invalid invite code format");
    }

    // Business logic: Join server via repository
    const server = await this.serverRepository.joinByInviteCode(code);

    // Return rich entity
    return server;
  }
}
