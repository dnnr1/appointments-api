import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User";
import { UserAlreadyExistsError } from "../../domain/errors";
import { Identifier } from "../../domain/value-objects/Identifier";
import { UserRepository } from "../interfaces/UserRepository";

export type CreateUserInput = { name: string; email: string; password: string };

export type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
};

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const email = input.email.trim().toLowerCase();

    const exists = await this.userRepo.existsByEmail(email);
    if (exists) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new User({
      id: Identifier.create(),
      name: input.name.trim(),
      email,
      passwordHash,
    });

    await this.userRepo.create(user);

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
