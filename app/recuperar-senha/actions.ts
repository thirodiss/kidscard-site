"use server"

import { z } from "zod"
import { issuePasswordLink } from "@/lib/access-tokens"
import { prisma } from "@/lib/prisma"

export type PasswordResetRequestState = { success: boolean; message: string }

const schema = z.object({ email: z.string().trim().email().max(160) })
const genericMessage = "Se o e-mail estiver cadastrado, enviaremos um link temporário de recuperação."

export async function requestPasswordResetAction(
  _previousState: PasswordResetRequestState,
  formData: FormData,
): Promise<PasswordResetRequestState> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, message: "Informe um e-mail válido." }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true },
  })
  if (user) {
    const recentThreshold = new Date(Date.now() - 15 * 60 * 1000)
    const recentToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        createdAt: { gte: recentThreshold },
      },
      select: { id: true },
    })
    if (!recentToken) {
      await issuePasswordLink({ userId: user.id, purpose: "PASSWORD_RESET" })
    }
  }

  return { success: true, message: genericMessage }
}
