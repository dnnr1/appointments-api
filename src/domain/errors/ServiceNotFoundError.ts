import { DomainError } from "./DomainError";

export class ServiceNotFoundError extends DomainError {
  constructor() {
    super("SERVICE_NOT_FOUND", "Service not found");
  }
}
