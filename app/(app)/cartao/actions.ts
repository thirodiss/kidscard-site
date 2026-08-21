"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getPaymentProvider } from "@/lib/payments";

type ActionState = {
  success: boolean;
  message: string;
};

export async function updateCardStatusAction(
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
  const nextStatus = String(formData.get("nextStatus") || "").trim();

  if (!cardId) {
    return {
      success: false,
      message: "Cartão inválido.",
    };
  }

  if (nextStatus !== "ACTIVE" && nextStatus !== "BLOCKED") {
    return {
      success: false,
      message: "Status inválido.",
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

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      accountId: account.id,
    },
    select: {
      id: true,
      status: true,
      holderName: true,
      last4: true,
      provider: true,
      externalId: true,
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
      message: "Cartões cancelados não podem ser alterados.",
    };
  }

  if (card.status === nextStatus) {
    return {
      success: false,
      message: "O cartão já está nesse status.",
    };
  }

  await prisma.card.update({
    where: { id: card.id },
    data: { syncStatus: "PENDING" },
  });

  try {
    const gateway = getPaymentProvider(card.provider);
    const providerResult = await gateway.setCardStatus(
      { internalId: card.id, externalId: card.externalId },
      nextStatus
    );

    await prisma.card.update({
      where: { id: card.id },
      data: {
        status: nextStatus,
        externalId: providerResult.externalId,
        syncStatus: "SYNCED",
        providerUpdatedAt: providerResult.providerUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Falha ao sincronizar status do cartão", error);
    await prisma.card.update({
      where: { id: card.id },
      data: { syncStatus: "FAILED" },
    });

    return {
      success: false,
      message:
        "Não foi possível sincronizar o cartão com o emissor. Nenhuma alteração financeira foi confirmada.",
    };
  }

  revalidatePath("/cartao");
  revalidatePath("/painel");

  return {
    success: true,
    message:
      nextStatus === "BLOCKED"
        ? "Cartão bloqueado com sucesso."
        : "Cartão desbloqueado com sucesso.",
  };
}
