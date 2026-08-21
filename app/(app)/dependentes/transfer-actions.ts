"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { postInternalTransfer } from "@/lib/ledger";
import { randomUUID } from "node:crypto";

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
      status: true,
      buckets: {
        where: { type: "PRIMARY", dependentId: null },
        select: { id: true, balanceCents: true },
        take: 1,
      },
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
  const walletType = String(formData.get("walletType") || "ALLOWANCE");

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

  if (walletType !== "PENSION" && walletType !== "ALLOWANCE") {
    return { success: false, message: "Selecione Pensão ou Mesada." };
  }

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
      buckets: {
        where: { type: walletType },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!dependent) {
    return {
      success: false,
      message: "Dependente inválido ou inativo.",
    };
  }

  const sourceBucket = account.buckets[0];
  const destinationBucket = dependent.buckets[0];

  if (!sourceBucket || !destinationBucket) {
    return {
      success: false,
      message: "As carteiras ainda não foram preparadas. Execute a migração do banco.",
    };
  }

  if (amountCents > sourceBucket.balanceCents) {
    return { success: false, message: "Saldo principal insuficiente." };
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const sentThisMonth = await prisma.transfer.aggregate({
    where: { dependentId: dependent.id, createdAt: { gte: monthStart } },
    _sum: { amountCents: true },
  });

  if (
    dependent.monthlyLimitCents > 0 &&
    (sentThisMonth._sum.amountCents ?? 0) + amountCents >
      dependent.monthlyLimitCents
  ) {
    return { success: false, message: "A transferência ultrapassa o limite mensal." };
  }

  await prisma.$transaction(async (tx) => {
    const journal = await postInternalTransfer(tx, {
      accountId: account.id,
      sourceBucketId: sourceBucket.id,
      destinationBucketId: destinationBucket.id,
      amountCents,
      idempotencyKey: `dependent-transfer:${randomUUID()}`,
      description: `Transferência para ${dependent.name} — ${
        walletType === "PENSION" ? "Pensão" : "Mesada"
      }`,
    });

    await tx.transfer.create({
      data: {
        fromAccountId: account.id,
        dependentId: dependent.id,
        sourceBucketId: sourceBucket.id,
        destinationBucketId: destinationBucket.id,
        journalId: journal.id,
        amountCents,
        note:
          note || (walletType === "PENSION" ? "Pensão" : "Mesada"),
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
