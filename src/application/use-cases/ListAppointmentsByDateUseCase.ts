import { AppointmentRepository } from "../interfaces/AppointmentRepository";
import { CacheProvider } from "../interfaces/CacheProvider";
import { DateProvider } from "../interfaces/DateProvider";

export type ListAppointmentsByDateInput = {
  date: Date;
};

export type AppointmentOutput = {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: "scheduled" | "canceled";
};

export class ListAppointmentsByDateUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly cacheProvider: CacheProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(
    input: ListAppointmentsByDateInput,
  ): Promise<AppointmentOutput[]> {
    const cacheKey = this.dateCacheKey(input.date);
    const cached = await this.cacheProvider.get<AppointmentOutput[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const start = this.dateProvider.startOfDay(input.date);
    const end = this.dateProvider.endOfDay(input.date);
    const appointments = await this.appointmentRepository.listByDateRange(
      start,
      end,
    );
    const output = appointments.map((appointment) => ({
      id: appointment.id.toString(),
      userId: appointment.userId.toString(),
      serviceId: appointment.serviceId.toString(),
      date: appointment.date.toDate(),
      status: appointment.status,
    }));

    await this.cacheProvider.set(cacheKey, output, 60);
    return output;
  }

  private dateCacheKey(date: Date): string {
    const day = date.toISOString().slice(0, 10);
    return `appointments:date:${day}`;
  }
}
