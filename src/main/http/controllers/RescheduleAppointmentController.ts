import { Request, Response } from "express"
import { RescheduleAppointmentUseCase } from "../../../application/use-cases/RescheduleAppointmentUseCase"

export class RescheduleAppointmentController {
  constructor(private readonly useCase: RescheduleAppointmentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const appointmentId = req.params.id
    const { newDate } = req.body

    const result = await this.useCase.execute({
      appointmentId,
      newDate: new Date(newDate)
    })

    return res.json(result)
  }
}
