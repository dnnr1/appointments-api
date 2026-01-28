import { describe, expect, it } from "vitest";
import { CreateAppointmentUseCase } from "../CreateAppointmentUseCase";
import { AppointmentInPastError } from "../../../domain/errors/AppointmentInPastError";
import { ScheduleConflictError } from "../../../domain/errors/ScheduleConflictError";
import { UserScheduleConflictError } from "../../../domain/errors/UserScheduleConflictError";
import {
  InMemoryAppointmentRepository,
  InMemoryCacheProvider,
  FixedDateProvider,
  InMemoryUserRepository,
  InMemoryServiceRepository,
  makeAppointment,
} from "./mocks";

describe("CreateAppointmentUseCase", () => {
  it("creates appointment", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T10:00:00Z"),
    );
    const users = new InMemoryUserRepository();
    const services = new InMemoryServiceRepository();
    users.add("u1");
    services.add("s1");

    const useCase = new CreateAppointmentUseCase(
      repo,
      users,
      services,
      dateProvider,
      cache,
    );

    const result = await useCase.execute({
      userId: "u1",
      serviceId: "s1",
      date: new Date("2026-01-10T12:00:00Z"),
    });

    expect(result.status).toBe("scheduled");
    expect(repo.items).toHaveLength(1);
  });

  it("rejects past appointments", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T10:00:00Z"),
    );
    const users = new InMemoryUserRepository();
    const services = new InMemoryServiceRepository();
    users.add("u1");
    services.add("s1");

    const useCase = new CreateAppointmentUseCase(
      repo,
      users,
      services,
      dateProvider,
      cache,
    );

    await expect(
      useCase.execute({
        userId: "u1",
        serviceId: "s1",
        date: new Date("2026-01-10T09:00:00Z"),
      }),
    ).rejects.toBeInstanceOf(AppointmentInPastError);
  });

  it("rejects schedule conflict", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T10:00:00Z"),
    );
    const users = new InMemoryUserRepository();
    const services = new InMemoryServiceRepository();
    users.add("u1");
    services.add("s1");

    repo.items.push(
      makeAppointment({
        userId: "u2",
        serviceId: "s1",
        date: new Date("2026-01-10T12:00:00Z"),
      }),
    );

    const useCase = new CreateAppointmentUseCase(
      repo,
      users,
      services,
      dateProvider,
      cache,
    );

    await expect(
      useCase.execute({
        userId: "u1",
        serviceId: "s1",
        date: new Date("2026-01-10T12:00:00Z"),
      }),
    ).rejects.toBeInstanceOf(ScheduleConflictError);
  });

  it("rejects user conflict", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T10:00:00Z"),
    );
    const users = new InMemoryUserRepository();
    const services = new InMemoryServiceRepository();
    users.add("u1");
    services.add("s1");

    repo.items.push(
      makeAppointment({
        userId: "u1",
        serviceId: "s1",
        date: new Date("2026-01-10T12:00:00Z"),
      }),
    );

    const useCase = new CreateAppointmentUseCase(
      repo,
      users,
      services,
      dateProvider,
      cache,
    );

    await expect(
      useCase.execute({
        userId: "u1",
        serviceId: "s1",
        date: new Date("2026-01-10T12:00:00Z"),
      }),
    ).rejects.toBeInstanceOf(UserScheduleConflictError);
  });
});
