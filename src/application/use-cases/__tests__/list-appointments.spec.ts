import { describe, expect, it } from "vitest"
import { ListAppointmentsByUserUseCase } from "../ListAppointmentsByUserUseCase"
import { ListAppointmentsByDateUseCase } from "../ListAppointmentsByDateUseCase"
import { InMemoryAppointmentRepository, InMemoryCacheProvider, FixedDateProvider, makeAppointment } from "./mocks"

describe("List appointments use cases", () => {
  it("lists by user", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const useCase = new ListAppointmentsByUserUseCase(repo, cache)

    repo.items.push(
      makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T10:00:00Z") }),
      makeAppointment({ userId: "u2", serviceId: "s1", date: new Date("2026-01-10T11:00:00Z") })
    )

    const result = await useCase.execute({ userId: "u1" })
    expect(result).toHaveLength(1)
  })

  it("lists by date", async () => {
    const repo = new InMemoryAppointmentRepository()
    const cache = new InMemoryCacheProvider()
    const dateProvider = new FixedDateProvider(new Date("2026-01-10T08:00:00Z"))
    const useCase = new ListAppointmentsByDateUseCase(repo, cache, dateProvider)

    repo.items.push(
      makeAppointment({ userId: "u1", serviceId: "s1", date: new Date("2026-01-10T10:00:00Z") }),
      makeAppointment({ userId: "u2", serviceId: "s1", date: new Date("2026-01-11T10:00:00Z") })
    )

    const result = await useCase.execute({ date: new Date("2026-01-10T00:00:00Z") })
    expect(result).toHaveLength(1)
  })
})
