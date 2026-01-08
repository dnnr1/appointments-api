import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../../config/env"

type JwtPayload = {
  sub: string
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization
  if (!header) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const [type, token] = header.split(" ")
  if (type !== "Bearer" || !token) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload
    req.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
}
