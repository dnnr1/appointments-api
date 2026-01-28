import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { DomainError } from "../../domain/errors/DomainError";
import { appLogger } from "../container";
import { HTTP_STATUS } from "./constants/status";

const app = express();

app.use(express.json());
app.use(router);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError) {
    const statusMap: Record<string, number> = {
      APPOINTMENT_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
      USER_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
      SERVICE_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
      SCHEDULE_CONFLICT: HTTP_STATUS.CONFLICT,
      USER_SCHEDULE_CONFLICT: HTTP_STATUS.CONFLICT,
    };
    const status = statusMap[err.code] ?? HTTP_STATUS.BAD_REQUEST;
    return res
      .status(status)
      .json({ error: err.message, code: err.code, details: err.details });
  }

  appLogger.error("unexpected_error", { err });
  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
});

export { app };
