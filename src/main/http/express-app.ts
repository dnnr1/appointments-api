import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import { DomainError } from "../../domain/errors/DomainError";
import { appLogger } from "../container";

const app = express();

app.use(express.json());
app.use(router);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError) {
    const statusMap: Record<string, number> = {
      APPOINTMENT_NOT_FOUND: 404,
      USER_NOT_FOUND: 404,
      SERVICE_NOT_FOUND: 404,
      SCHEDULE_CONFLICT: 409,
      USER_SCHEDULE_CONFLICT: 409,
    };
    const status = statusMap[err.code] ?? 400;
    return res
      .status(status)
      .json({ error: err.message, code: err.code, details: err.details });
  }

  appLogger.error("unexpected_error", { err });
  return res.status(500).json({ error: "Internal server error" });
});

export { app };
