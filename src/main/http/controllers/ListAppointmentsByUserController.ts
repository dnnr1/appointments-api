import { Request, Response } from "express"
import { ListAppointmentsByUserUseCase } from "../../../application/use-cases/ListAppointmentsByUserUseCase"

export class ListAppointmentsByUserController {
  constructor(private readonly useCase: ListAppointmentsByUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.userId
    const result = await this.useCase.execute({ userId })
    return res.json(result)
  }
}
