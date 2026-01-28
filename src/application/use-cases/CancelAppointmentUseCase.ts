import { AppointmentCanceledError } from "../../domain/errors/AppointmentCanceledError";
import { AppointmentNotFoundError } from "../../domain/errors/AppointmentNotFoundError";
import { CancelTooLateError } from "../../domain/errors/CancelTooLateError";
import { AppointmentRepository } from "../interfaces/AppointmentRepository";
import { DateProvider } from "../interfaces/DateProvider";
import { CacheProvider } from "../interfaces/CacheProvider";

export type CancelAppointmentInput = {
  appointmentId: string;
  cancelLimitHours: number;
};

export type CancelAppointmentOutput = {
  id: string;
  status: "canceled";
  canceledAt: Date;
};

export class CancelAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly dateProvider: DateProvider,
    private readonly cacheProvider: CacheProvider,
  ) {}

  async execute(
    input: CancelAppointmentInput,
  ): Promise<CancelAppointmentOutput> {
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
    const diff = this.dateProvider.diffInHours(appointment.date.toDate(), now);
    if (diff < input.cancelLimitHours) {
      throw new CancelTooLateError();
    }

    appointment.cancel(now);
    await this.appointmentRepository.save(appointment);

    await this.cacheProvider.delete(
      this.userCacheKey(appointment.userId.toString()),
    );
    await this.cacheProvider.delete(
      this.dateCacheKey(appointment.date.toDate()),
    );

    return {
      id: appointment.id.toString(),
      status: "canceled",
      canceledAt: appointment.canceledAt as Date,
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
