"use server"

import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashToken, isStrongPassword } from "@/lib/security"

export type SetPasswordState = { success: boolean; message: string }

const schema = z
  .object({
    token: z.string().min(32).max(256),
    password: z.string().refine(isStrongPassword),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"] })

export async function setPasswordAction(
  _previousState: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, message: "Use uma senha de 12 a 128 caracteres, com letras e números, e confirme corretamente." }
  }

  const tokenHash = hashToken(parsed.data.token)
  const now = new Date()
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  try {
    await prisma.$transaction(async (transaction) => {
      const token = await transaction.passwordResetToken.findUnique({ where: { tokenHash } })
      if (!token || token.usedAt || token.expiresAt <= now) throw new Error("TOKEN_INVALID")

      const claimed = await transaction.passwordResetToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      })
      if (claimed.count !== 1) throw new Error("TOKEN_INVALID")

      await transaction.user.update({
        where: { id: token.userId },
        data: { passwordHash, mustChangePassword: false, passwordChangedAt: now },
      })
      await transaction.passwordResetToken.updateMany({
        where: { userId: token.userId, usedAt: null },
        data: { usedAt: now },
      })
      await transaction.auditLog.create({
        data: {
          actorUserId: token.userId,
          action: token.purpose === "FIRST_ACCESS" ? "FIRST_ACCESS_COMPLETED" : "PASSWORD_RESET_COMPLETED",
          subjectType: "User",
          subjectId: token.userId,
        },
      })
    })
    return { success: true, message: "Senha definida com sucesso. Seu acesso já está disponível." }
  } catch (error) {
    console.error("Falha ao definir senha:", error)
    return { success: false, message: "Este link é inválido, expirou ou já foi utilizado. Solicite um novo link." }
  }
}
