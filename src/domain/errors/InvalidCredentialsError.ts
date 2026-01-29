import { DomainError } from "./DomainError";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("INVALID_CREDENTIALS", "Invalid credentials");
  }
}
