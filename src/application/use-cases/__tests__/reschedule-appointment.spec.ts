import { describe, expect, it } from "vitest"
import { RescheduleAppointmentUseCase } from "../RescheduleAppointmentUseCase"
import { AppointmentInPastError } from "../../../domain/errors/AppointmentInPastError"
import { ScheduleConflictError } from "../../../domain/errors/ScheduleConflictError"
import { UserScheduleConflictError } from "../../../domain/errors/UserScheduleConflictError"
import { InMemoryAppointmentRepository, InMemoryCacheProvider, FixedDateProvider, makeAppointment } from "./mocks"

describe("RescheduleAppointmentUseCase", () => {
  it("reschedules appointment", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const dateProvider = new FixedDateProvider(new Date("2026-01-10T08:00:00Z"))

    const appointment = makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T16:00:00Z") })
    repo.items.push(appointment)

    const useCase = new RescheduleAppointmentUseCase(repo, dateProvider, cache)
    const result = await useCase.execute({ appointmentId: appointment.id.toString(), newDate: new Date("2026-01-11T10:00:00Z") })

    expect(result.date.toISOString()).toBe("2026-01-11T10:00:00.000Z")
  })

  it("rejects past date", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const dateProvider = new FixedDateProvider(new Date("2026-01-10T08:00:00Z"))

    const appointment = makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T16:00:00Z") })
    repo.items.push(appointment)

    const useCase = new RescheduleAppointmentUseCase(repo, dateProvider, cache)

    await expect(
      useCase.execute({ appointmentId: appointment.id.toString(), newDate: new Date("2026-01-10T07:00:00Z") })
    ).rejects.toBeInstanceOf(AppointmentInPastError)
  })

  it("rejects schedule conflict", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const dateProvider = new FixedDateProvider(new Date("2026-01-10T08:00:00Z"))

    const appointment = makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T16:00:00Z") })
    const conflict = makeAppointment({ userId: "u2", serviceId: "s1", date: new Date("2026-01-11T10:00:00Z") })
    repo.items.push(appointment, conflict)

    const useCase = new RescheduleAppointmentUseCase(repo, dateProvider, cache)

    await expect(
      useCase.execute({ appointmentId: appointment.id.toString(), newDate: new Date("2026-01-11T10:00:00Z") })
    ).rejects.toBeInstanceOf(ScheduleConflictError)
  })

  it("rejects user conflict", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const dateProvider = new FixedDateProvider(new Date("2026-01-10T08:00:00Z"))

    const appointment = makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T16:00:00Z") })
    const conflict = makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-11T10:00:00Z") })
    repo.items.push(appointment, conflict)

    const useCase = new RescheduleAppointmentUseCase(repo, dateProvider, cache)

    await expect(
      useCase.execute({ appointmentId: appointment.id.toString(), newDate: new Date("2026-01-11T10:00:00Z") })
    ).rejects.toBeInstanceOf(UserScheduleConflictError)
  })
})
