import { User } from "../../../domain/entities/User";
import { Identifier } from "../../../domain/value-objects/Identifier";
import { UserRepository } from "../../../application/interfaces/UserRepository";
import { prisma } from "../PrismaClientFactory";

export class PrismaUserRepository implements UserRepository {
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { id } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    if (!row) {
      return null;
    }
    return new User({
      id: Identifier.create(row.id),
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash ?? "",
    });
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
