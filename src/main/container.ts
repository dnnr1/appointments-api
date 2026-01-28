import Redis from "ioredis";
import { PrismaAppointmentRepository } from "../infrastructure/prisma/repositories/PrismaAppointmentRepository";
import { PrismaUserRepository } from "../infrastructure/prisma/repositories/PrismaUserRepository";
import { PrismaServiceRepository } from "../infrastructure/prisma/repositories/PrismaServiceRepository";
import { RedisCacheProvider } from "../infrastructure/cache/RedisCacheProvider";
import { DayjsDateProvider } from "../infrastructure/date/DayjsDateProvider";
import { PinoLogger } from "../infrastructure/logger/PinoLogger";
import { CreateAppointmentUseCase } from "../application/use-cases/CreateAppointmentUseCase";
import { CancelAppointmentUseCase } from "../application/use-cases/CancelAppointmentUseCase";
import { RescheduleAppointmentUseCase } from "../application/use-cases/RescheduleAppointmentUseCase";
import { ListAppointmentsByUserUseCase } from "../application/use-cases/ListAppointmentsByUserUseCase";
import { ListAppointmentsByDateUseCase } from "../application/use-cases/ListAppointmentsByDateUseCase";
import { env } from "./config/env";

const redis = new Redis(env.redisUrl);

const appointmentRepository = new PrismaAppointmentRepository();
const userRepository = new PrismaUserRepository();
const serviceRepository = new PrismaServiceRepository();
const cacheProvider = new RedisCacheProvider(redis);
const dateProvider = new DayjsDateProvider();
const logger = new PinoLogger();

export const useCases = {
  createAppointment: new CreateAppointmentUseCase(
    appointmentRepository,
    userRepository,
    serviceRepository,
    dateProvider,
    cacheProvider,
  ),
  cancelAppointment: new CancelAppointmentUseCase(
    appointmentRepository,
    dateProvider,
    cacheProvider,
  ),
  rescheduleAppointment: new RescheduleAppointmentUseCase(
    appointmentRepository,
    dateProvider,
    cacheProvider,
  ),
  listByUser: new ListAppointmentsByUserUseCase(
    appointmentRepository,
    cacheProvider,
  ),
  listByDate: new ListAppointmentsByDateUseCase(
    appointmentRepository,
    cacheProvider,
    dateProvider,
  ),
};

export const appLogger = logger;
