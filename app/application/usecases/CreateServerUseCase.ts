/**
 * Create Server Use Case
 * Handles all business logic for creating a new server
 * - Validates server data
 * - Orchestrates repository calls
 * - Returns created server entity
 */
import type { CreateServerInput, Server } from "../../domain/models/server";
import type { ServerRepository } from "../../domain/repositories/server.repository";
import { UseCase } from "./BaseUseCase";

export class CreateServerUseCase extends UseCase<CreateServerInput, Server> {
  constructor(private serverRepository: ServerRepository) {
    super();
  }

  async execute(input: CreateServerInput): Promise<Server> {
    // Validation
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Server name is required");
    }

    if (input.name.length > 100) {
      throw new Error("Server name must be less than 100 characters");
    }

    // Business logic: Create server via repository
    const server = await this.serverRepository.create(input);

    // Return rich entity
    return server;
  }
}
