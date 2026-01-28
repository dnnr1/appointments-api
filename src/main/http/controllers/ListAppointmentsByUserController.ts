import { Request, Response } from "express";
import { ListAppointmentsByUserUseCase } from "../../../application/use-cases/ListAppointmentsByUserUseCase";
import { HTTP_STATUS } from "../constants/status";

export class ListAppointmentsByUserController {
  constructor(private readonly useCase: ListAppointmentsByUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }
    const result = await this.useCase.execute({ userId });
    return res.json(result);
  }
}
