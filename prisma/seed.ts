import "dotenv/config"
import { PrismaClient, TransactionType } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10)

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
        balanceCents: 245900,
        status: "ACTIVE",
      },
    }))

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
      },
    })
  }

  const txCount = await prisma.transaction.count({
    where: { accountId: account.id },
  })

  if (txCount === 0) {
    await prisma.transaction.createMany({
      data: [
        {
          accountId: account.id,
          type: TransactionType.DEPOSIT,
          amountCents: 300000,
          description: "Aporte inicial",
          category: "Saldo",
          occurredAt: new Date("2026-03-01T10:00:00.000Z"),
        },
        {
          accountId: account.id,
          type: TransactionType.PURCHASE,
          amountCents: -12990,
          description: "Compra no mercado",
          merchant: "SuperKids",
          category: "Alimentação",
          occurredAt: new Date("2026-03-03T14:30:00.000Z"),
        },
        {
          accountId: account.id,
          type: TransactionType.PURCHASE,
          amountCents: -4110,
          description: "Lanche escolar",
          merchant: "Cantina Kids",
          category: "Educação",
          occurredAt: new Date("2026-03-05T16:15:00.000Z"),
        },
        {
          accountId: account.id,
          type: TransactionType.REFUND,
          amountCents: 10000,
          description: "Estorno",
          merchant: "SuperKids",
          category: "Ajuste",
          occurredAt: new Date("2026-03-06T12:00:00.000Z"),
        },
      ],
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
      },
    })
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