import { UserRepository } from "../../../application/interfaces/UserRepository"
import { prisma } from "../PrismaClientFactory"

export class PrismaUserRepository implements UserRepository {
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { id } })
    return count > 0
  }
}
