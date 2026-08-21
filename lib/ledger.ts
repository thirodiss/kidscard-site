import type { Prisma } from "@prisma/client";

type InternalTransferInput = {
  accountId: string;
  sourceBucketId: string;
  destinationBucketId: string;
  amountCents: number;
  idempotencyKey: string;
  description: string;
};

export async function postInternalTransfer(
  tx: Prisma.TransactionClient,
  input: InternalTransferInput
) {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error("O valor do lançamento deve ser positivo e em centavos.");
  }

  if (input.sourceBucketId === input.destinationBucketId) {
    throw new Error("As carteiras de origem e destino devem ser diferentes.");
  }

  const existing = await tx.ledgerJournal.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    select: { id: true },
  });

  if (existing) {
    return existing;
  }

  const sourceUpdate = await tx.walletBucket.updateMany({
    where: {
      id: input.sourceBucketId,
      accountId: input.accountId,
      balanceCents: { gte: input.amountCents },
    },
    data: { balanceCents: { decrement: input.amountCents } },
  });

  if (sourceUpdate.count !== 1) {
    throw new Error("Saldo principal insuficiente para esta transferência.");
  }

  const destinationUpdate = await tx.walletBucket.updateMany({
    where: {
      id: input.destinationBucketId,
      accountId: input.accountId,
    },
    data: { balanceCents: { increment: input.amountCents } },
  });

  if (destinationUpdate.count !== 1) {
    throw new Error("Carteira de destino inválida.");
  }

  return tx.ledgerJournal.create({
    data: {
      accountId: input.accountId,
      idempotencyKey: input.idempotencyKey,
      referenceType: "DEPENDENT_TRANSFER",
      description: input.description,
      entries: {
        create: [
          {
            bucketId: input.sourceBucketId,
            direction: "DEBIT",
            amountCents: input.amountCents,
          },
          {
            bucketId: input.destinationBucketId,
            direction: "CREDIT",
            amountCents: input.amountCents,
          },
        ],
      },
    },
    select: { id: true },
  });
}

type ExternalMovementInput = {
  accountId: string;
  spendingBucketId: string;
  clearingBucketId: string;
  amountCents: number;
  kind: "PURCHASE" | "REFUND";
  idempotencyKey: string;
  description: string;
};

export async function postExternalMovement(
  tx: Prisma.TransactionClient,
  input: ExternalMovementInput
) {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error("O valor do lançamento deve ser positivo e em centavos.");
  }

  const debitBucketId =
    input.kind === "PURCHASE"
      ? input.spendingBucketId
      : input.clearingBucketId;
  const creditBucketId =
    input.kind === "PURCHASE"
      ? input.clearingBucketId
      : input.spendingBucketId;

  if (input.kind === "PURCHASE") {
    const debit = await tx.walletBucket.updateMany({
      where: {
        id: debitBucketId,
        accountId: input.accountId,
        balanceCents: { gte: input.amountCents },
      },
      data: { balanceCents: { decrement: input.amountCents } },
    });
    if (debit.count !== 1) throw new Error("Saldo da carteira insuficiente.");

    await tx.walletBucket.update({
      where: { id: creditBucketId },
      data: { balanceCents: { increment: input.amountCents } },
    });
  } else {
    await tx.walletBucket.update({
      where: { id: debitBucketId },
      data: { balanceCents: { decrement: input.amountCents } },
    });
    await tx.walletBucket.update({
      where: { id: creditBucketId },
      data: { balanceCents: { increment: input.amountCents } },
    });
  }

  return tx.ledgerJournal.create({
    data: {
      accountId: input.accountId,
      idempotencyKey: input.idempotencyKey,
      referenceType: input.kind,
      description: input.description,
      entries: {
        create: [
          {
            bucketId: debitBucketId,
            direction: "DEBIT",
            amountCents: input.amountCents,
          },
          {
            bucketId: creditBucketId,
            direction: "CREDIT",
            amountCents: input.amountCents,
          },
        ],
      },
    },
  });
}
