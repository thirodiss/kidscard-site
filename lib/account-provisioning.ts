import { randomBytes, randomInt } from "node:crypto"
import bcrypt from "bcryptjs"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { normalizeDigits } from "@/lib/security"

async function generateAccountNumber(transaction: Prisma.TransactionClient) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const accountNumber = randomInt(10_000_000, 100_000_000).toString()
    const exists = await transaction.user.findUnique({
      where: { accountNumber },
      select: { id: true },
    })
    if (!exists) return accountNumber
  }
  throw new Error("Não foi possível gerar um número de conta único.")
}

export async function provisionGuardian(input: {
  applicationId: string
  cpf: string
  actorUserId: string
}) {
  return prisma.$transaction(async (transaction) => {
    const application = await transaction.onboardingApplication.findUnique({
      where: { id: input.applicationId },
    })
    if (!application) throw new Error("Solicitação não encontrada.")
    if (application.userId) {
      const existingUser = await transaction.user.findUnique({ where: { id: application.userId } })
      if (!existingUser) throw new Error("Conta vinculada não encontrada.")
      return { user: existingUser, application }
    }
    if (!["SUBMITTED", "KYC_PENDING"].includes(application.status)) {
      throw new Error("Esta solicitação não está disponível para aprovação.")
    }

    const cpf = normalizeDigits(input.cpf)
    const conflict = await transaction.user.findFirst({
      where: { OR: [{ cpf }, { email: application.email.toLowerCase() }] },
      select: { id: true },
    })
    if (conflict) throw new Error("Já existe uma conta com este CPF ou e-mail.")

    const accountNumber = await generateAccountNumber(transaction)
    const passwordHash = await bcrypt.hash(randomBytes(48).toString("base64url"), 12)
    const user = await transaction.user.create({
      data: {
        name: application.guardianName,
        email: application.email.toLowerCase(),
        cpf,
        passwordHash,
        role: "GUARDIAN",
        agency: "0001",
        accountNumber,
        mustChangePassword: true,
        walletAccounts: {
          create: {
            provider: "SANDBOX",
            status: "ACTIVE",
            syncStatus: "LOCAL_ONLY",
            buckets: {
              create: [
                { type: "PRIMARY", name: "Saldo principal" },
                { type: "CLEARING", name: "Liquidação externa" },
              ],
            },
          },
        },
      },
    })

    const reviewedAt = new Date()
    const updatedApplication = await transaction.onboardingApplication.update({
      where: { id: application.id },
      data: {
        status: "APPROVED",
        reviewedAt,
        reviewedById: input.actorUserId,
        rejectionReason: null,
        userId: user.id,
      },
    })
    await transaction.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        action: "ONBOARDING_APPROVED",
        subjectType: "OnboardingApplication",
        subjectId: application.id,
        metadata: { userId: user.id, accountNumber: user.accountNumber },
      },
    })
    return { user, application: updatedApplication }
  })
}

export async function createAdminAccount(input: {
  name: string
  email: string
  cpf: string
  password: string
}) {
  return prisma.$transaction(async (transaction) => {
    const adminCount = await transaction.user.count({ where: { role: "ADMIN" } })
    if (adminCount > 0) throw new Error("A configuração inicial já foi concluída.")

    const accountNumber = await generateAccountNumber(transaction)
    const user = await transaction.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        cpf: normalizeDigits(input.cpf),
        passwordHash: await bcrypt.hash(input.password, 12),
        role: "ADMIN",
        agency: "0001",
        accountNumber,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    })
    await transaction.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "ADMIN_BOOTSTRAPPED",
        subjectType: "User",
        subjectId: user.id,
      },
    })
    return user
  })
}
