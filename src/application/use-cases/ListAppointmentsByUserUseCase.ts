import { AppointmentRepository } from "../interfaces/AppointmentRepository";
import { CacheProvider } from "../interfaces/CacheProvider";

export type ListAppointmentsByUserInput = {
  userId: string;
};

export type AppointmentOutput = {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: "scheduled" | "canceled";
};

export class ListAppointmentsByUserUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly cacheProvider: CacheProvider,
  ) {}

  async execute(
    input: ListAppointmentsByUserInput,
  ): Promise<AppointmentOutput[]> {
    const cacheKey = this.userCacheKey(input.userId);
    const cached = await this.cacheProvider.get<AppointmentOutput[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await this.appointmentRepository.listByUser(
      input.userId,
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

  private userCacheKey(userId: string): string {
    return `appointments:user:${userId}`;
  }
}
