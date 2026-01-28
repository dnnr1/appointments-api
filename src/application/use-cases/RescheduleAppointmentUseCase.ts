import { AppointmentCanceledError } from "../../domain/errors/AppointmentCanceledError";
import { AppointmentInPastError } from "../../domain/errors/AppointmentInPastError";
import { AppointmentNotFoundError } from "../../domain/errors/AppointmentNotFoundError";
import { ScheduleConflictError } from "../../domain/errors/ScheduleConflictError";
import { UserScheduleConflictError } from "../../domain/errors/UserScheduleConflictError";
import { AppointmentDate } from "../../domain/value-objects/AppointmentDate";
import { AppointmentRepository } from "../interfaces/AppointmentRepository";
import { DateProvider } from "../interfaces/DateProvider";
import { CacheProvider } from "../interfaces/CacheProvider";

export type RescheduleAppointmentInput = {
  appointmentId: string;
  newDate: Date;
};

export type RescheduleAppointmentOutput = {
  id: string;
  date: Date;
  status: "scheduled";
};

export class RescheduleAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly dateProvider: DateProvider,
    private readonly cacheProvider: CacheProvider,
  ) {}

  async execute(
    input: RescheduleAppointmentInput,
  ): Promise<RescheduleAppointmentOutput> {
    const appointment = await this.appointmentRepository.findById(
      input.appointmentId,
    );
    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    if (appointment.status === "canceled") {
      throw new AppointmentCanceledError();
    }

    const now = this.dateProvider.now();
    if (this.dateProvider.isBefore(input.newDate, now)) {
      throw new AppointmentInPastError();
    }

    const conflict = await this.appointmentRepository.findByDate(input.newDate);
    if (conflict && conflict.id.toString() !== appointment.id.toString()) {
      throw new ScheduleConflictError();
    }

    const userConflict = await this.appointmentRepository.findByUserAndDate(
      appointment.userId.toString(),
      input.newDate,
    );
    if (
      userConflict &&
      userConflict.id.toString() !== appointment.id.toString()
    ) {
      throw new UserScheduleConflictError();
    }

    const oldDate = appointment.date.toDate();
    appointment.reschedule(AppointmentDate.create(input.newDate));
    await this.appointmentRepository.save(appointment);

    await this.cacheProvider.delete(
      this.userCacheKey(appointment.userId.toString()),
    );
    await this.cacheProvider.delete(this.dateCacheKey(oldDate));
    await this.cacheProvider.delete(this.dateCacheKey(input.newDate));

    return {
      id: appointment.id.toString(),
      date: appointment.date.toDate(),
      status: "scheduled",
    };
  }

  private userCacheKey(userId: string): string {
    return `appointments:user:${userId}`;
  }

  private dateCacheKey(date: Date): string {
    const day = date.toISOString().slice(0, 10);
    return `appointments:date:${day}`;
  }
}
