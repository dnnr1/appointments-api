import { Appointment } from "../../domain/entities/Appointment"

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<void>
  save(appointment: Appointment): Promise<void>
  findById(id: string): Promise<Appointment | null>
  findByDate(date: Date): Promise<Appointment | null>
  findByUserAndDate(userId: string, date: Date): Promise<Appointment | null>
  listByUser(userId: string): Promise<Appointment[]>
  listByDateRange(start: Date, end: Date): Promise<Appointment[]>
}
