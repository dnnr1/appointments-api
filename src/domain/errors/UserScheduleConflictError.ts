import { DomainError } from "./DomainError";

export class UserScheduleConflictError extends DomainError {
  constructor() {
    super(
      "USER_SCHEDULE_CONFLICT",
      "User already has an appointment at this time",
    );
  }
}
