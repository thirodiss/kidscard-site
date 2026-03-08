"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

const allowedFields = [
  "allowPhysicalPurchase",
  "allowOnlinePurchase",
  "allowContactless",
  "allowNotifications",
] as const;

type AllowedField = (typeof allowedFields)[number];

export async function updateCardPreferenceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sessão inválida. Faça login novamente.",
    };
  }

  const cardId = String(formData.get("cardId") || "").trim();
  const field = String(formData.get("field") || "").trim() as AllowedField;
  const valueRaw = String(formData.get("value") || "").trim();

  if (!cardId) {
    return {
      success: false,
      message: "Cartão inválido.",
    };
  }

  if (!allowedFields.includes(field)) {
    return {
      success: false,
      message: "Preferência inválida.",
    };
  }

  const value = valueRaw === "true";

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!account) {
    return {
      success: false,
      message: "Conta não encontrada.",
    };
  }

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      accountId: account.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!card) {
    return {
      success: false,
      message: "Cartão não encontrado.",
    };
  }

  if (card.status === "CANCELED") {
    return {
      success: false,
      message: "Cartão cancelado não pode ser alterado.",
    };
  }

  await prisma.card.update({
    where: { id: card.id },
    data: {
      [field]: value,
    },
  });

  revalidatePath("/cartao");

  return {
    success: true,
    message: "Preferência atualizada com sucesso.",
  };
}