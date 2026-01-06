import pino from "pino"
import { Logger } from "../../application/interfaces/Logger"

export class PinoLogger implements Logger {
  private readonly logger = pino()

  info(message: string, data?: Record<string, unknown>): void {
    this.logger.info(data ?? {}, message)
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.logger.error(data ?? {}, message)
  }
}
