"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { provisionGuardian } from "@/lib/account-provisioning"
import { requireAdmin } from "@/lib/admin"
import { issuePasswordLink } from "@/lib/access-tokens"
import { isEmailConfigured } from "@/lib/email"
import { prisma } from "@/lib/prisma"
import { isValidCpf } from "@/lib/security"

const approvalSchema = z.object({
  applicationId: z.string().cuid(),
  cpf: z.string().refine(isValidCpf, "CPF inválido."),
})

const rejectionSchema = z.object({
  applicationId: z.string().cuid(),
  rejectionReason: z.string().trim().min(5).max(500),
})

export async function approveApplicationAction(formData: FormData) {
  const admin = await requireAdmin()
  const parsed = approvalSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) redirect("/admin/cadastros?notice=invalid-cpf")
  if (!isEmailConfigured()) redirect("/admin/cadastros?notice=email-not-configured")

  let notice = "approved"
  try {
    const result = await provisionGuardian({
      applicationId: parsed.data.applicationId,
      cpf: parsed.data.cpf,
      actorUserId: admin.id,
    })
    const delivery = await issuePasswordLink({
      userId: result.user.id,
      purpose: "FIRST_ACCESS",
      onboardingApplicationId: result.application.id,
    })
    notice = delivery.sent ? "approved" : "email-failed"
  } catch (error) {
    console.error("Falha ao aprovar solicitação:", error)
    notice = "approval-failed"
  }
  revalidatePath("/admin/cadastros")
  redirect(`/admin/cadastros?notice=${notice}`)
}

export async function rejectApplicationAction(formData: FormData) {
  const admin = await requireAdmin()
  const parsed = rejectionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) redirect("/admin/cadastros?notice=invalid-rejection")

  let notice = "rejected"
  try {
    await prisma.$transaction(async (transaction) => {
      const application = await transaction.onboardingApplication.findUnique({
        where: { id: parsed.data.applicationId },
        select: { status: true, userId: true },
      })
      if (!application || application.userId || application.status === "APPROVED") {
        throw new Error("Solicitação indisponível para rejeição.")
      }
      await transaction.onboardingApplication.update({
        where: { id: parsed.data.applicationId },
        data: {
          status: "REJECTED",
          rejectionReason: parsed.data.rejectionReason,
          reviewedAt: new Date(),
          reviewedById: admin.id,
        },
      })
      await transaction.auditLog.create({
        data: {
          actorUserId: admin.id,
          action: "ONBOARDING_REJECTED",
          subjectType: "OnboardingApplication",
          subjectId: parsed.data.applicationId,
          metadata: { reason: parsed.data.rejectionReason },
        },
      })
    })
  } catch (error) {
    console.error("Falha ao rejeitar solicitação:", error)
    notice = "rejection-failed"
  }
  revalidatePath("/admin/cadastros")
  redirect(`/admin/cadastros?notice=${notice}`)
}

export async function resendInvitationAction(formData: FormData) {
  const admin = await requireAdmin()
  const applicationId = z.string().cuid().safeParse(formData.get("applicationId"))
  if (!applicationId.success) redirect("/admin/cadastros?notice=invalid-request")
  if (!isEmailConfigured()) redirect("/admin/cadastros?notice=email-not-configured")

  const application = await prisma.onboardingApplication.findUnique({
    where: { id: applicationId.data },
    select: { id: true, userId: true, status: true },
  })
  if (!application?.userId || application.status !== "APPROVED") {
    redirect("/admin/cadastros?notice=invalid-request")
  }

  const delivery = await issuePasswordLink({
    userId: application.userId,
    purpose: "FIRST_ACCESS",
    onboardingApplicationId: application.id,
  })
  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: "FIRST_ACCESS_RESENT",
      subjectType: "OnboardingApplication",
      subjectId: application.id,
    },
  })
  revalidatePath("/admin/cadastros")
  redirect(delivery.sent ? "/admin/cadastros?notice=resent" : "/admin/cadastros?notice=email-failed")
}
