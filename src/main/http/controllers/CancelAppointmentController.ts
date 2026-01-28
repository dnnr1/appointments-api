import { Request, Response } from "express";
import { CancelAppointmentUseCase } from "../../../application/use-cases/CancelAppointmentUseCase";
import { env } from "../../config/env";

export class CancelAppointmentController {
  constructor(private readonly useCase: CancelAppointmentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const appointmentId = req.params.id;
    const result = await this.useCase.execute({
      appointmentId,
      cancelLimitHours: env.cancelLimitHours,
    });

    return res.json(result);
  }
}
