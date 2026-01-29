import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing env DATABASE_URL");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
