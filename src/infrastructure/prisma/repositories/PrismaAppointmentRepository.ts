import { Appointment } from "../../../domain/entities/Appointment"
import { AppointmentDate } from "../../../domain/value-objects/AppointmentDate"
import { Identifier } from "../../../domain/value-objects/Identifier"
import { AppointmentRepository } from "../../../application/interfaces/AppointmentRepository"
import { prisma } from "../PrismaClientFactory"

export class PrismaAppointmentRepository implements AppointmentRepository {
  async create(appointment: Appointment): Promise<void> {
    await prisma.appointment.create({
      data: {
        id: appointment.id.toString(),
        userId: appointment.userId.toString(),
        serviceId: appointment.serviceId.toString(),
        date: appointment.date.toDate(),
        status: appointment.status,
        canceledAt: appointment.canceledAt ?? null
      }
    })
  }

  async save(appointment: Appointment): Promise<void> {
    await prisma.appointment.update({
      where: { id: appointment.id.toString() },
      data: {
        date: appointment.date.toDate(),
        status: appointment.status,
        canceledAt: appointment.canceledAt ?? null
      }
    })
  }

  async findById(id: string): Promise<Appointment | null> {
    const row = await prisma.appointment.findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async findByDate(date: Date): Promise<Appointment | null> {
    const row = await prisma.appointment.findFirst({
      where: { date, status: "scheduled" }
    })
    return row ? this.toDomain(row) : null
  }

  async findByUserAndDate(userId: string, date: Date): Promise<Appointment | null> {
    const row = await prisma.appointment.findFirst({
      where: { userId, date, status: "scheduled" }
    })
    return row ? this.toDomain(row) : null
  }

  async listByUser(userId: string): Promise<Appointment[]> {
    const rows = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: "asc" }
    })
    return rows.map((row) => this.toDomain(row))
  }

  async listByDateRange(start: Date, end: Date): Promise<Appointment[]> {
    const rows = await prisma.appointment.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { date: "asc" }
    })
    return rows.map((row) => this.toDomain(row))
  }

  private toDomain(row: { id: string; userId: string; serviceId: string; date: Date; status: string; canceledAt: Date | null }): Appointment {
    return new Appointment({
      id: Identifier.create(row.id),
      userId: Identifier.create(row.userId),
      serviceId: Identifier.create(row.serviceId),
      date: AppointmentDate.create(row.date),
      status: row.status as "scheduled" | "canceled",
      canceledAt: row.canceledAt
    })
  }
}
