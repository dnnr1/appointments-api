import { DomainError } from "./DomainError";

export class CancelTooLateError extends DomainError {
  constructor() {
    super("CANCEL_TOO_LATE", "Cancellation window has passed");
  }
}
