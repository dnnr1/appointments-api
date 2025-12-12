import { DomainError } from "./DomainError"

export class AppointmentNotFoundError extends DomainError {
  constructor() {
    super("APPOINTMENT_NOT_FOUND", "Appointment not found")
  }
}
