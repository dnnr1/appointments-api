import { User } from "../../domain/entities/User";

export interface UserRepository {
  exists(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
