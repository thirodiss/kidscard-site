import "dotenv/config"
import { PrismaClient, TransactionType } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString =
  process.env.KIDSCARD_CORE_DATABASE_URL ??
  process.env.STORAGE_URL ??
  process.env.KIDSCARD_CORE_URL ??
  process.env.DATABASE_URL
const demoPassword = process.env.SEED_DEMO_PASSWORD ?? ""

if (!connectionString) {
  throw new Error(
    "KIDSCARD_CORE_DATABASE_URL, STORAGE_URL, KIDSCARD_CORE_URL ou DATABASE_URL não definida.",
  )
}

if (!demoPassword || demoPassword.length < 12) {
  throw new Error("SEED_DEMO_PASSWORD deve ter pelo menos 12 caracteres.")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 10)

  const user = await prisma.user.upsert({
    where: { cpf: "12345678900" },
    update: {
      passwordHash,
      agency: "0001",
      accountNumber: "123456",
      name: "Thiago Demo",
      email: "demo@kidscard.com.br",
      role: "GUARDIAN",
    },
    create: {
      name: "Thiago Demo",
      email: "demo@kidscard.com.br",
      cpf: "12345678900",
      passwordHash,
      agency: "0001",
      accountNumber: "123456",
      role: "GUARDIAN",
    },
  })

  const existingAccount = await prisma.walletAccount.findFirst({
    where: { userId: user.id },
  })

  const account =
    existingAccount ??
    (await prisma.walletAccount.create({
      data: {
        userId: user.id,
        balanceCents: 292900,
        status: "ACTIVE",
        provider: "SANDBOX",
        externalId: `sandbox-account-${user.accountNumber}`,
        syncStatus: "SYNCED",
      },
    }))

  if (!account.externalId) {
    await prisma.walletAccount.update({
      where: { id: account.id },
      data: {
        provider: "SANDBOX",
        externalId: `sandbox-account-${user.accountNumber}`,
        syncStatus: "SYNCED",
      },
    })
  }

  const primaryBucket =
    (await prisma.walletBucket.findFirst({
      where: { accountId: account.id, dependentId: null, type: "PRIMARY" },
    })) ??
    (await prisma.walletBucket.create({
      data: {
        accountId: account.id,
        type: "PRIMARY",
        name: "Saldo principal",
        balanceCents: account.balanceCents,
      },
    }))

  const clearingBucket = await prisma.walletBucket.findFirst({
    where: { accountId: account.id, dependentId: null, type: "CLEARING" },
  })
  if (!clearingBucket) {
    await prisma.walletBucket.create({
      data: { accountId: account.id, type: "CLEARING", name: "Liquidação externa" },
    })
  }

  const cardCount = await prisma.card.count({
    where: { accountId: account.id },
  })

  if (cardCount === 0) {
    await prisma.card.create({
      data: {
        accountId: account.id,
        holderName: "THIAGO DEMO",
        brand: "Visa",
        last4: "4821",
        color: "Ocean Blue",
        status: "ACTIVE",
        provider: "SANDBOX",
        externalId: `sandbox-card-${account.id}`,
        syncStatus: "SYNCED",
        spendingBucketId: primaryBucket.id,
      },
    })
  }

  const txCount = await prisma.transaction.count({
    where: { accountId: account.id },
  })

  if (txCount === 0) {
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        provider: "SANDBOX",
        externalId: "sandbox-deposit-initial",
        type: TransactionType.DEPOSIT,
        amountCents: 300000,
        description: "Aporte inicial",
        category: "Saldo",
        occurredAt: new Date("2026-03-01T10:00:00.000Z"),
      },
    })

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        provider: "SANDBOX",
        externalId: "sandbox-purchase-market",
        type: TransactionType.PURCHASE,
        amountCents: -12990,
        description: "Compra no mercado",
        merchant: "SuperKids",
        category: "Alimentação",
        detailStatus: "AVAILABLE",
        occurredAt: new Date("2026-03-03T14:30:00.000Z"),
        items: {
          create: [
            { name: "Arroz 5kg", quantity: 1, unitPriceCents: 2490, totalAmountCents: 2490, source: "SANDBOX" },
            { name: "Leite integral", quantity: 2, unitPriceCents: 750, totalAmountCents: 1500, source: "SANDBOX" },
            { name: "Sabonete", quantity: 1, unitPriceCents: 800, totalAmountCents: 800, source: "SANDBOX" },
            { name: "Frutas", quantity: 1, unitPriceCents: 8200, totalAmountCents: 8200, source: "SANDBOX" },
          ],
        },
      },
    })

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        provider: "SANDBOX",
        externalId: "sandbox-purchase-school",
        type: TransactionType.PURCHASE,
        amountCents: -4110,
        description: "Lanche escolar",
        merchant: "Cantina Kids",
        category: "Educação",
        detailStatus: "AVAILABLE",
        occurredAt: new Date("2026-03-05T16:15:00.000Z"),
        items: {
          create: [
            { name: "Coxinha", quantity: 1, unitPriceCents: 1850, totalAmountCents: 1850, source: "SANDBOX" },
            { name: "Suco de laranja", quantity: 1, unitPriceCents: 1260, totalAmountCents: 1260, source: "SANDBOX" },
            { name: "Esfiha", quantity: 1, unitPriceCents: 1000, totalAmountCents: 1000, source: "SANDBOX" },
          ],
        },
      },
    })

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        provider: "SANDBOX",
        externalId: "sandbox-refund-market",
        type: TransactionType.REFUND,
        amountCents: 10000,
        description: "Estorno",
        merchant: "SuperKids",
        category: "Ajuste",
        occurredAt: new Date("2026-03-06T12:00:00.000Z"),
      },
    })
  }

  const dependentCount = await prisma.dependent.count({
    where: { guardianId: user.id },
  })

  if (dependentCount === 0) {
    await prisma.dependent.create({
      data: {
        guardianId: user.id,
        accountId: account.id,
        name: "Filho Demo",
        cpf: "98765432100",
        monthlyLimitCents: 50000,
        isActive: true,
        buckets: {
          create: [
            { accountId: account.id, type: "PENSION", name: "Pensão" },
            { accountId: account.id, type: "ALLOWANCE", name: "Mesada" },
          ],
        },
      },
    })
  }

  const dependents = await prisma.dependent.findMany({
    where: { accountId: account.id },
    include: { buckets: true },
  })

  for (const dependent of dependents) {
    for (const type of ["PENSION", "ALLOWANCE"] as const) {
      if (!dependent.buckets.some((bucket) => bucket.type === type)) {
        await prisma.walletBucket.create({
          data: { accountId: account.id, dependentId: dependent.id, type, name: type === "PENSION" ? "Pensão" : "Mesada" },
        })
      }
    }
  }

  console.log("Seed concluído.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
