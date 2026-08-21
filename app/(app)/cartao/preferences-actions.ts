"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getPaymentProvider } from "@/lib/payments";

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
      provider: true,
      externalId: true,
      allowPhysicalPurchase: true,
      allowOnlinePurchase: true,
      allowContactless: true,
      allowNotifications: true,
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

  const preferences = {
    allowPhysicalPurchase: card.allowPhysicalPurchase,
    allowOnlinePurchase: card.allowOnlinePurchase,
    allowContactless: card.allowContactless,
    allowNotifications: card.allowNotifications,
    [field]: value,
  };

  await prisma.card.update({
    where: { id: card.id },
    data: { syncStatus: "PENDING" },
  });

  try {
    const gateway = getPaymentProvider(card.provider);
    const providerResult = await gateway.setCardPreferences(
      { internalId: card.id, externalId: card.externalId },
      preferences
    );

    await prisma.card.update({
      where: { id: card.id },
      data: {
        ...preferences,
        externalId: providerResult.externalId,
        syncStatus: "SYNCED",
        providerUpdatedAt: providerResult.providerUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Falha ao sincronizar preferências do cartão", error);
    await prisma.card.update({
      where: { id: card.id },
      data: { syncStatus: "FAILED" },
    });

    return {
      success: false,
      message:
        "Não foi possível sincronizar a preferência com o emissor. Tente novamente mais tarde.",
    };
  }

  revalidatePath("/cartao");

  return {
    success: true,
    message: "Preferência atualizada com sucesso.",
  };
}
