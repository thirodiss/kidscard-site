import { spawnSync } from "node:child_process"
import pg from "pg"

const { Client } = pg
const prismaCommand = process.platform === "win32" ? "prisma.cmd" : "prisma"
const connectionString =
  process.env.KIDSCARD_CORE_DATABASE_URL ??
  process.env.STORAGE_URL ??
  process.env.KIDSCARD_CORE_URL ??
  process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "KIDSCARD_CORE_DATABASE_URL, STORAGE_URL, KIDSCARD_CORE_URL ou DATABASE_URL não definida.",
  )
}

process.env.DATABASE_URL = connectionString

const legacyMigrations = [
  "20260308134155_init",
  "20260308164416_add_transfer_model",
  "20260308191805_add_card_preferences",
]

const requiredTables = [
  "User",
  "WalletAccount",
  "Card",
  "Transaction",
  "Dependent",
  "Transfer",
]

const requiredCardColumns = [
  "allowContactless",
  "allowNotifications",
  "allowOnlinePurchase",
  "allowPhysicalPurchase",
]

function runPrisma(args) {
  const result = spawnSync(prismaCommand, args, {
    encoding: "utf8",
    env: process.env,
  })

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  return result
}

async function verifyLegacySchema() {
  const client = new Client({ connectionString })
  await client.connect()

  try {
    const tablesResult = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    )
    const tables = new Set(tablesResult.rows.map((row) => row.table_name))
    const missingTables = requiredTables.filter((table) => !tables.has(table))

    const columnsResult = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Card'`,
    )
    const columns = new Set(columnsResult.rows.map((row) => row.column_name))
    const missingColumns = requiredCardColumns.filter((column) => !columns.has(column))

    if (missingTables.length > 0 || missingColumns.length > 0) {
      throw new Error(
        `Schema legado não reconhecido. Tabelas ausentes: ${missingTables.join(", ") || "nenhuma"}. Colunas ausentes: ${missingColumns.join(", ") || "nenhuma"}.`,
      )
    }
  } finally {
    await client.end()
  }
}

const firstDeploy = runPrisma(["migrate", "deploy"])

if (firstDeploy.status === 0) {
  process.exit(0)
}

const deployOutput = `${firstDeploy.stdout ?? ""}\n${firstDeploy.stderr ?? ""}`
if (!deployOutput.includes("P3005")) {
  process.exit(firstDeploy.status ?? 1)
}

console.log("Banco legado detectado. Validando estrutura antes do baseline...")
await verifyLegacySchema()

for (const migration of legacyMigrations) {
  const resolution = runPrisma(["migrate", "resolve", "--applied", migration])
  if (resolution.status !== 0) process.exit(resolution.status ?? 1)
}

const finalDeploy = runPrisma(["migrate", "deploy"])
process.exit(finalDeploy.status ?? 1)
