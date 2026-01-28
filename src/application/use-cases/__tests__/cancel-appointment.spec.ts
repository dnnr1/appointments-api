import { describe, expect, it } from "vitest";
import { CancelAppointmentUseCase } from "../CancelAppointmentUseCase";
import { CancelTooLateError } from "../../../domain/errors/CancelTooLateError";
import { AppointmentCanceledError } from "../../../domain/errors/AppointmentCanceledError";
import {
  InMemoryAppointmentRepository,
  InMemoryCacheProvider,
  FixedDateProvider,
  makeAppointment,
} from "./mocks";

describe("CancelAppointmentUseCase", () => {
  it("cancels appointment", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T08:00:00Z"),
    );

    const appointment = makeAppointment({
      userId: "u1",
      serviceId: "s1",
      date: new Date("2026-01-10T16:00:00Z"),
    });
    repo.items.push(appointment);

    const useCase = new CancelAppointmentUseCase(repo, dateProvider, cache);
    const result = await useCase.execute({
      appointmentId: appointment.id.toString(),
      cancelLimitHours: 4,
    });

    expect(result.status).toBe("canceled");
  });

  it("rejects late cancel", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T15:00:00Z"),
    );

    const appointment = makeAppointment({
      userId: "u1",
      serviceId: "s1",
      date: new Date("2026-01-10T16:00:00Z"),
    });
    repo.items.push(appointment);

    const useCase = new CancelAppointmentUseCase(repo, dateProvider, cache);

    await expect(
      useCase.execute({
        appointmentId: appointment.id.toString(),
        cancelLimitHours: 4,
      }),
    ).rejects.toBeInstanceOf(CancelTooLateError);
  });

  it("rejects cancel if already canceled", async () => {
    const repo = new InMemoryAppointmentRepository();
    const cache = new InMemoryCacheProvider();
    const dateProvider = new FixedDateProvider(
      new Date("2026-01-10T08:00:00Z"),
    );

    const appointment = makeAppointment({
      userId: "u1",
      serviceId: "s1",
      date: new Date("2026-01-10T16:00:00Z"),
      status: "canceled",
    });
    repo.items.push(appointment);

    const useCase = new CancelAppointmentUseCase(repo, dateProvider, cache);

    await expect(
      useCase.execute({
        appointmentId: appointment.id.toString(),
        cancelLimitHours: 4,
      }),
    ).rejects.toBeInstanceOf(AppointmentCanceledError);
  });
});
