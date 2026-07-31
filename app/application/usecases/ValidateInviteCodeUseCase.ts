import type { InviteCodeResponse } from "../../domain/models/auth";
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import { UseCase } from "./BaseUseCase";

export interface ValidateInviteCodeInput {
  code: string;
}

export class ValidateInviteCodeUseCase extends UseCase<ValidateInviteCodeInput, InviteCodeResponse> {
  constructor(private authRepository: AuthRepository) {
    super();
  }

  async execute(input: ValidateInviteCodeInput): Promise<InviteCodeResponse> {
    // Validations
    if (!input.code || input.code.trim().length === 0) {
      throw new Error("El código de invitación es requerido");
    }

    if (input.code.length < 3 || input.code.length > 10) {
      throw new Error("El código de invitación debe tener entre 3 y 10 caracteres");
    }

    // Call repository to validate code
    return await this.authRepository.validateInviteCode(input.code.trim());
  }
}
