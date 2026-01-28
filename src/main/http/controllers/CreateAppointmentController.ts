import { Request, Response } from "express";
import { CreateAppointmentUseCase } from "../../../application/use-cases/CreateAppointmentUseCase";
import { HTTP_STATUS } from "../constants/status";

export class CreateAppointmentController {
  constructor(private readonly useCase: CreateAppointmentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { serviceId, date } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
    const result = await this.useCase.execute({
      userId,
      serviceId,
      date: new Date(date),
    });

    return res.status(HTTP_STATUS.CREATED).json(result);
  }
}
