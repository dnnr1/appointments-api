import { DomainError } from "./DomainError";

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super("USER_ALREADY_EXISTS", "User already exists");
  }
}
