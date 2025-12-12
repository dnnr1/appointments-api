import { DomainError } from "./DomainError"

export class AppointmentCanceledError extends DomainError {
  constructor() {
    super("APPOINTMENT_CANCELED", "Appointment is canceled")
  }
}
