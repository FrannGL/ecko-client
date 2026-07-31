import type { AuthResponse } from "@/domain/models/auth";
import type { AuthRepository } from "@/domain/repositories/auth.repository";

import { UseCase } from "./BaseUseCase";

export interface RefreshTokenUseCaseInput {
  refreshToken: string;
}

export interface RefreshTokenUseCaseOutput {
  user: AuthResponse["user"];
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh Token Use Case
 * Orchestrates token refresh logic following Clean Architecture
 * Throws error if refresh fails (e.g., refresh token expired)
 */
export class RefreshTokenUseCase extends UseCase<RefreshTokenUseCaseInput, RefreshTokenUseCaseOutput> {
  constructor(private authRepository: AuthRepository) {
    super();
  }

  async execute(input: RefreshTokenUseCaseInput): Promise<RefreshTokenUseCaseOutput> {
    const response = await this.authRepository.refresh(input.refreshToken);
    return {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };
  }
}
