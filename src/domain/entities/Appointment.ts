import { Identifier } from "../value-objects/Identifier";
import { AppointmentDate } from "../value-objects/AppointmentDate";

export type AppointmentStatus = "scheduled" | "canceled";

type AppointmentProps = {
  id: Identifier;
  userId: Identifier;
  serviceId: Identifier;
  date: AppointmentDate;
  status: AppointmentStatus;
  canceledAt?: Date | null;
};

export class Appointment {
  readonly id: Identifier;
  readonly userId: Identifier;
  readonly serviceId: Identifier;
  date: AppointmentDate;
  status: AppointmentStatus;
  canceledAt?: Date | null;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.serviceId = props.serviceId;
    this.date = props.date;
    this.status = props.status;
    this.canceledAt = props.canceledAt ?? null;
  }

  cancel(at: Date): void {
    this.status = "canceled";
    this.canceledAt = at;
  }

  reschedule(date: AppointmentDate): void {
    this.date = date;
  }
}
