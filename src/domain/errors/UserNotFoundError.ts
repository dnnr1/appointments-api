import { DomainError } from "./DomainError";

export class UserNotFoundError extends DomainError {
  constructor() {
    super("USER_NOT_FOUND", "User not found");
  }
}
