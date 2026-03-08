"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

export async function createTransferToDependentAction(
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

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      balanceCents: true,
      status: true,
    },
  });

  if (!account) {
    return {
      success: false,
      message: "Conta principal não encontrada.",
    };
  }

  if (account.status !== "ACTIVE") {
    return {
      success: false,
      message: "A conta precisa estar ativa para realizar transferências.",
    };
  }

  const dependentId = String(formData.get("dependentId") || "").trim();
  const amountRaw = String(formData.get("amount") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!dependentId) {
    return {
      success: false,
      message: "Selecione um dependente.",
    };
  }

  const normalizedAmount = amountRaw.replace(",", ".");
  const amountNumber = Number(normalizedAmount);

  if (Number.isNaN(amountNumber) || amountNumber <= 0) {
    return {
      success: false,
      message: "Informe um valor válido para a transferência.",
    };
  }

  const amountCents = Math.round(amountNumber * 100);

  const dependent = await prisma.dependent.findFirst({
    where: {
      id: dependentId,
      guardianId: session.user.id,
      accountId: account.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      monthlyLimitCents: true,
    },
  });

  if (!dependent) {
    return {
      success: false,
      message: "Dependente inválido ou inativo.",
    };
  }

  if (amountCents > account.balanceCents) {
    return {
      success: false,
      message: "Saldo insuficiente para realizar a transferência.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.transfer.create({
      data: {
        fromAccountId: account.id,
        dependentId: dependent.id,
        amountCents,
        note: note || null,
      },
    });

    await tx.walletAccount.update({
      where: { id: account.id },
      data: {
        balanceCents: {
          decrement: amountCents,
        },
      },
    });

    await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "TRANSFER_OUT",
        amountCents: -amountCents,
        description: `Transferência para ${dependent.name}`,
        merchant: dependent.name,
        category: "Dependentes",
      },
    });
  });

  revalidatePath("/painel");
  revalidatePath("/extrato");
  revalidatePath("/dependentes");

  return {
    success: true,
    message: "Transferência realizada com sucesso.",
  };
}