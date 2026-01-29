import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../application/use-cases/CreateUserUseCase";
import { HTTP_STATUS } from "../constants/status";

export class CreateUserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const result = await this.useCase.execute({ name, email, password });

    return res.status(HTTP_STATUS.CREATED).json(result);
  }
}
