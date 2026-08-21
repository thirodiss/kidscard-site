"use server"

import { timingSafeEqual } from "node:crypto"
import { z } from "zod"
import { createAdminAccount } from "@/lib/account-provisioning"
import { isStrongPassword, isValidCpf } from "@/lib/security"

export type AdminSetupState = {
  success: boolean
  message: string
  agency?: string
  accountNumber?: string
}

const setupSchema = z.object({
  setupToken: z.string().min(32).max(256),
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(160),
  cpf: z.string().refine(isValidCpf),
  password: z.string().refine(isStrongPassword),
})

function tokensMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}

export async function bootstrapAdminAction(
  _previousState: AdminSetupState,
  formData: FormData,
): Promise<AdminSetupState> {
  const expectedToken = process.env.ADMIN_SETUP_TOKEN ?? ""
  const parsed = setupSchema.safeParse(Object.fromEntries(formData))
  if (!expectedToken || expectedToken.length < 32 || !parsed.success) {
    return { success: false, message: "Revise os dados e a chave de configuração." }
  }
  if (!tokensMatch(parsed.data.setupToken, expectedToken)) {
    return { success: false, message: "Chave de configuração inválida." }
  }

  try {
    const admin = await createAdminAccount(parsed.data)
    return {
      success: true,
      message: "Administrador criado. Remova ADMIN_SETUP_TOKEN da Vercel após entrar.",
      agency: admin.agency,
      accountNumber: admin.accountNumber,
    }
  } catch (error) {
    console.error("Falha no bootstrap administrativo:", error)
    return { success: false, message: "A configuração não pôde ser concluída ou já foi realizada." }
  }
}
