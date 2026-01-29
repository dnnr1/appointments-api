import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialsError";
import { UserRepository } from "../interfaces/UserRepository";

export type LoginUserInput = { email: string; password: string };

export type LoginUserOutput = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtSecret: string,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.passwordHash) {
      throw new InvalidCredentialsError();
    }

    const validPassword = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!validPassword) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign({}, this.jwtSecret, {
      subject: user.id.toString(),
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
}
