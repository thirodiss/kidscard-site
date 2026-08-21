"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

type ActionState = { success: boolean; message: string; protocol?: string };

const schema = z.object({
  guardianName: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(10).max(20),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2),
  intendedUse: z.enum(["PENSION", "ALLOWANCE", "BOTH"]),
  dependentCount: z.coerce.number().int().min(1).max(20),
  privacyConsent: z.literal("on"),
  termsConsent: z.literal("on"),
  guardianDeclaration: z.literal("on"),
});

export async function submitOnboardingAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos e confirme as declarações obrigatórias.",
    };
  }

  const now = new Date();
  const recentThreshold = new Date(now.getTime() - 15 * 60 * 1000);
  const normalizedEmail = parsed.data.email.toLowerCase();
  const recentApplication = await prisma.onboardingApplication.findFirst({
    where: { email: normalizedEmail, createdAt: { gte: recentThreshold } },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (recentApplication) {
    return {
      success: true,
      message: "Sua solicitação recente já está na fila de validação.",
      protocol: recentApplication.id.slice(-8).toUpperCase(),
    };
  }

  const application = await prisma.onboardingApplication.create({
    data: {
      guardianName: parsed.data.guardianName,
      email: normalizedEmail,
      phone: parsed.data.phone.replace(/\D/g, ""),
      city: parsed.data.city,
      state: parsed.data.state.toUpperCase(),
      intendedUse: parsed.data.intendedUse,
      dependentCount: parsed.data.dependentCount,
      status: "KYC_PENDING",
      consentVersion: "2026-08-21",
      privacyConsentAt: now,
      termsConsentAt: now,
      guardianDeclarationAt: now,
    },
  });

  return {
    success: true,
    message:
      "Pré-cadastro recebido. A conta só será criada após a validação de identidade do responsável.",
    protocol: application.id.slice(-8).toUpperCase(),
  };
}
