import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
