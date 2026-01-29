import { Request, Response } from "express";
import { LoginUserUseCase } from "../../../application/use-cases/LoginUserUseCase";
import { HTTP_STATUS } from "../constants/status";

export class LoginUserController {
  constructor(private readonly useCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await this.useCase.execute({ email, password });

    return res.status(HTTP_STATUS.OK).json(result);
  }
}
