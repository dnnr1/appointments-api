import { DomainError } from "./DomainError"

export class ScheduleConflictError extends DomainError {
  constructor() {
    super("SCHEDULE_CONFLICT", "There is already an appointment at this time")
  }
}
