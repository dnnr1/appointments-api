import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { HTTP_STATUS } from "../constants/status";

type JwtPayload = {
  sub: string;
};

export const auth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
};
