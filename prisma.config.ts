import "dotenv/config"
import { defineConfig } from "prisma/config"

const connectionString = process.env.KIDSCARD_CORE_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("KIDSCARD_CORE_URL ou DATABASE_URL não definida.")
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: connectionString,
  },
})
