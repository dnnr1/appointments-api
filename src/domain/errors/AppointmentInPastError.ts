import { DomainError } from "./DomainError";

export class AppointmentInPastError extends DomainError {
  constructor() {
    super("APPOINTMENT_IN_PAST", "Appointment date must be in the future");
  }
}
