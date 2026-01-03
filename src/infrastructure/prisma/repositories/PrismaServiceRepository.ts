import { ServiceRepository } from "../../../application/interfaces/ServiceRepository"
import { prisma } from "../PrismaClientFactory"

export class PrismaServiceRepository implements ServiceRepository {
  async exists(id: string): Promise<boolean> {
    const count = await prisma.service.count({ where: { id } })
    return count > 0
  }
}
