import { Request, Response } from "express";
import { DeleteUserUseCase } from "../../../application/use-cases/DeleteUserUseCase";
import { HTTP_STATUS } from "../constants/status";

export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    const result = await this.useCase.execute({ userId });

    return res.status(HTTP_STATUS.OK).json(result);
  }
}
