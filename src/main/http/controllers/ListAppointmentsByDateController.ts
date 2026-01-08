import { Request, Response } from "express"
import { ListAppointmentsByDateUseCase } from "../../../application/use-cases/ListAppointmentsByDateUseCase"

export class ListAppointmentsByDateController {
  constructor(private readonly useCase: ListAppointmentsByDateUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { date } = req.query
    const result = await this.useCase.execute({
      date: new Date(String(date))
    })
    return res.json(result)
  }
}
