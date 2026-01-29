import { UserNotFoundError } from "../../domain/errors/UserNotFoundError";
import { UserRepository } from "../interfaces/UserRepository";

export type DeleteUserInput = { userId: string };

export type DeleteUserOutput = { id: string };

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const exists = await this.userRepo.exists(input.userId);
    if (!exists) {
      throw new UserNotFoundError();
    }

    await this.userRepo.delete(input.userId);

    return { id: input.userId };
  }
}
