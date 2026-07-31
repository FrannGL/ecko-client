import { type AuthResponse, type RegisterInviteInput, registerInviteSchema } from "../../domain/models/auth";
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import { UseCase } from "./BaseUseCase";

export class RegisterWithInviteUseCase extends UseCase<RegisterInviteInput, AuthResponse> {
  constructor(private authRepository: AuthRepository) {
    super();
  }

  async execute(input: RegisterInviteInput): Promise<AuthResponse> {
    // Validate with Zod schema
    const validatedInput = registerInviteSchema.parse(input);

    // Call repository to register with invite
    return await this.authRepository.registerWithInvite(validatedInput);
  }
}
