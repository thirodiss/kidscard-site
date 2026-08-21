"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getPaymentProvider } from "@/lib/payments";
import type { ProviderCardResult } from "@/lib/payments/contracts";

type ActionState = {
  success: boolean;
  message: string;
};

export async function reissueCardAction(
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

  if (!cardId) {
    return {
      success: false,
      message: "Cartão inválido.",
    };
  }

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

  const currentCard = await prisma.card.findFirst({
    where: {
      id: cardId,
      accountId: account.id,
    },
  });

  if (!currentCard) {
    return {
      success: false,
      message: "Cartão não encontrado.",
    };
  }

  if (currentCard.status === "CANCELED") {
    return {
      success: false,
      message: "Este cartão já está cancelado.",
    };
  }

  await prisma.card.update({
    where: { id: currentCard.id },
    data: { syncStatus: "PENDING" },
  });

  let providerResult: ProviderCardResult;

  try {
    const gateway = getPaymentProvider(currentCard.provider);
    providerResult = await gateway.reissueCard({
      internalId: currentCard.id,
      externalId: currentCard.externalId,
    });
  } catch (error) {
    console.error("Falha ao solicitar segunda via ao emissor", error);
    await prisma.card.update({
      where: { id: currentCard.id },
      data: { syncStatus: "FAILED" },
    });

    return {
      success: false,
      message:
        "O emissor não confirmou a segunda via. O cartão atual não foi cancelado.",
    };
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.card.update({
      where: { id: currentCard.id },
      data: {
        status: "CANCELED",
        syncStatus: "SYNCED",
        providerUpdatedAt: providerResult.providerUpdatedAt,
      },
    });

    await tx.card.create({
      data: {
        accountId: currentCard.accountId,
        spendingBucketId: currentCard.spendingBucketId,
        holderName: currentCard.holderName,
        brand: currentCard.brand,
        color: currentCard.color,
        last4: providerResult.last4 || currentCard.last4,
        status: "ACTIVE",
        provider: currentCard.provider,
        externalId: providerResult.externalId,
        syncStatus: "SYNCED",
        providerUpdatedAt: providerResult.providerUpdatedAt,
        allowPhysicalPurchase: currentCard.allowPhysicalPurchase,
        allowOnlinePurchase: currentCard.allowOnlinePurchase,
        allowContactless: currentCard.allowContactless,
        allowNotifications: currentCard.allowNotifications,
      },
    });
  });

  revalidatePath("/cartao");
  revalidatePath("/painel");

  return {
    success: true,
    message: "Segunda via solicitada com sucesso. Um novo cartão foi emitido.",
  };
}
