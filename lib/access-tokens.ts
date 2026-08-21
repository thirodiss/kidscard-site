import type { PasswordTokenPurpose } from "@prisma/client"
import { accessEmailHtml, sendTransactionalEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"
import { createSecureToken, getAppBaseUrl, hashToken } from "@/lib/security"

export async function issuePasswordLink(input: {
  userId: string
  purpose: PasswordTokenPurpose
  onboardingApplicationId?: string
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, name: true, email: true },
  })
  if (!user?.email) return { sent: false, reason: "missing_email" as const }

  const rawToken = createSecureToken()
  const now = new Date()
  const expiresAt = new Date(
    now.getTime() + (input.purpose === "FIRST_ACCESS" ? 48 * 60 * 60 * 1000 : 30 * 60 * 1000),
  )

  const token = await prisma.$transaction(async (transaction) => {
    await transaction.passwordResetToken.updateMany({
      where: { userId: user.id, purpose: input.purpose, usedAt: null },
      data: { usedAt: now },
    })
    return transaction.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        purpose: input.purpose,
        expiresAt,
      },
    })
  })

  const firstAccess = input.purpose === "FIRST_ACCESS"
  const url = `${getAppBaseUrl()}/definir-senha?token=${encodeURIComponent(rawToken)}`
  const delivery = await sendTransactionalEmail({
    to: user.email,
    subject: firstAccess ? "Ative seu acesso KidsCard" : "Redefinição de senha KidsCard",
    html: accessEmailHtml({ name: user.name, url, firstAccess }),
    template: firstAccess ? "first-access" : "password-reset",
    idempotencyKey: `${input.purpose.toLowerCase()}-${token.id}`,
  })

  if (delivery.sent && input.onboardingApplicationId) {
    await prisma.onboardingApplication.update({
      where: { id: input.onboardingApplicationId },
      data: { invitationSentAt: new Date() },
    })
  }

  return delivery
}
