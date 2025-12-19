import { Appointment } from "../../domain/entities/Appointment"
import { AppointmentDate } from "../../domain/value-objects/AppointmentDate"
import { Identifier } from "../../domain/value-objects/Identifier"
import { AppointmentInPastError } from "../../domain/errors/AppointmentInPastError"
import { ScheduleConflictError } from "../../domain/errors/ScheduleConflictError"
import { UserScheduleConflictError } from "../../domain/errors/UserScheduleConflictError"
import { AppointmentRepository } from "../interfaces/AppointmentRepository"
import { DateProvider } from "../interfaces/DateProvider"
import { CacheProvider } from "../interfaces/CacheProvider"
import { UserRepository } from "../interfaces/UserRepository"
import { ServiceRepository } from "../interfaces/ServiceRepository"
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError"
import { ServiceNotFoundError } from "../../domain/errors/ServiceNotFoundError"

export type CreateAppointmentInput = {
  userId: string
  serviceId: string
  date: Date
}

export type CreateAppointmentOutput = {
  id: string
  userId: string
  serviceId: string
  date: Date
  status: "scheduled"
}

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly userRepository: UserRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly dateProvider: DateProvider,
    private readonly cacheProvider: CacheProvider
  ) {}

  async execute(input: CreateAppointmentInput): Promise<CreateAppointmentOutput> {
    const now = this.dateProvider.now()
    if (this.dateProvider.isBefore(input.date, now)) {
      throw new AppointmentInPastError()
    }

    const hasUser = await this.userRepository.exists(input.userId)
    if (!hasUser) {
      throw new UserNotFoundError()
    }

    const hasService = await this.serviceRepository.exists(input.serviceId)
    if (!hasService) {
      throw new ServiceNotFoundError()
    }

    const conflict = await this.appointmentRepository.findByDate(input.date)
    if (conflict) {
      throw new ScheduleConflictError()
    }

    const userConflict = await this.appointmentRepository.findByUserAndDate(input.userId, input.date)
    if (userConflict) {
      throw new UserScheduleConflictError()
    }

    const appointment = new Appointment({
      id: Identifier.create(),
      userId: Identifier.create(input.userId),
      serviceId: Identifier.create(input.serviceId),
      date: AppointmentDate.create(input.date),
      status: "scheduled"
    })

    await this.appointmentRepository.create(appointment)

    await this.cacheProvider.delete(this.userCacheKey(input.userId))
    await this.cacheProvider.delete(this.dateCacheKey(input.date))

    return {
      id: appointment.id.toString(),
      userId: appointment.userId.toString(),
      serviceId: appointment.serviceId.toString(),
      date: appointment.date.toDate(),
      status: "scheduled"
    }
  }

  private userCacheKey(userId: string): string {
    return `appointments:user:${userId}`
  }

  private dateCacheKey(date: Date): string {
    const day = date.toISOString().slice(0, 10)
    return `appointments:date:${day}`
  }
}
