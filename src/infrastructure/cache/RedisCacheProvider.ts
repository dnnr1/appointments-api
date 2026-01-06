import Redis from "ioredis"
import { CacheProvider } from "../../application/interfaces/CacheProvider"

export class RedisCacheProvider implements CacheProvider {
  constructor(private readonly client: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    if (!value) {
      return null
    }
    return JSON.parse(value) as T
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value)
    if (ttlSeconds) {
      await this.client.set(key, payload, "EX", ttlSeconds)
      return
    }
    await this.client.set(key, payload)
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }
}
