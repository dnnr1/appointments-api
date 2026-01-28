import { Request, Response } from "express";
import { CreateAppointmentUseCase } from "../../../application/use-cases/CreateAppointmentUseCase";

export class CreateAppointmentController {
  constructor(private readonly useCase: CreateAppointmentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { serviceId, date } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await this.useCase.execute({
      userId,
      serviceId,
      date: new Date(date),
    });

    return res.status(201).json(result);
  }
}
