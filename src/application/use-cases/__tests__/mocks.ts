import { Appointment } from "../../../domain/entities/Appointment";
import { AppointmentDate } from "../../../domain/value-objects/AppointmentDate";
import { Identifier } from "../../../domain/value-objects/Identifier";
import { AppointmentRepository } from "../../interfaces/AppointmentRepository";
import { CacheProvider } from "../../interfaces/CacheProvider";
import { DateProvider } from "../../interfaces/DateProvider";
import { UserRepository } from "../../interfaces/UserRepository";
import { ServiceRepository } from "../../interfaces/ServiceRepository";

export class InMemoryAppointmentRepository implements AppointmentRepository {
  items: Appointment[] = [];

  async create(appointment: Appointment): Promise<void> {
    this.items.push(appointment);
  }

  async save(appointment: Appointment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === appointment.id.toString(),
    );
    if (index >= 0) {
      this.items[index] = appointment;
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null;
  }

  async findByDate(date: Date): Promise<Appointment | null> {
    return (
      this.items.find(
        (item) =>
          item.date.toDate().getTime() === date.getTime() &&
          item.status === "scheduled",
      ) ?? null
    );
  }

  async findByUserAndDate(
    userId: string,
    date: Date,
  ): Promise<Appointment | null> {
    return (
      this.items.find(
        (item) =>
          item.userId.toString() === userId &&
          item.date.toDate().getTime() === date.getTime() &&
          item.status === "scheduled",
      ) ?? null
    );
  }

  async listByUser(userId: string): Promise<Appointment[]> {
    return this.items.filter((item) => item.userId.toString() === userId);
  }

  async listByDateRange(start: Date, end: Date): Promise<Appointment[]> {
    return this.items.filter(
      (item) => item.date.toDate() >= start && item.date.toDate() <= end,
    );
  }
}

export class InMemoryCacheProvider implements CacheProvider {
  store = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class FixedDateProvider implements DateProvider {
  private current: Date;

  constructor(now: Date) {
    this.current = now;
  }

  setNow(now: Date): void {
    this.current = now;
  }

  now(): Date {
    return new Date(this.current);
  }

  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime();
  }

  diffInHours(a: Date, b: Date): number {
    const diff = a.getTime() - b.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  }

  startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}

export class InMemoryUserRepository implements UserRepository {
  private ids = new Set<string>();

  add(id: string): void {
    this.ids.add(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.ids.has(id);
  }
}

export class InMemoryServiceRepository implements ServiceRepository {
  private ids = new Set<string>();

  add(id: string): void {
    this.ids.add(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.ids.has(id);
  }
}

export const makeAppointment = (props: {
  userId: string;
  serviceId: string;
  date: Date;
  status?: "scheduled" | "canceled";
}): Appointment => {
  return new Appointment({
    id: Identifier.create(),
    userId: Identifier.create(props.userId),
    serviceId: Identifier.create(props.serviceId),
    date: AppointmentDate.create(props.date),
    status: props.status ?? "scheduled",
  });
};
