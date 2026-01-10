import dotenv from "dotenv"

dotenv.config()

type Env = {
  port: number
  databaseUrl: string
  redisUrl: string
  jwtSecret: string
  cancelLimitHours: number
}

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing env ${key}`)
  }
  return value
}

export const env: Env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: requireEnv("DATABASE_URL"),
  redisUrl: requireEnv("REDIS_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  cancelLimitHours: Number(process.env.CANCEL_LIMIT_HOURS ?? 6)
}
