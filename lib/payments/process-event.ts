import type { PaymentProvider, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaymentWebhookEvent } from "@/lib/payments/contracts";
import { postExternalMovement } from "@/lib/ledger";

function jsonPayload(event: PaymentWebhookEvent): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(event)) as Prisma.InputJsonValue;
}

export async function processPaymentEvent(
  provider: PaymentProvider,
  event: PaymentWebhookEvent
) {
  const providerEvent = await prisma.providerEvent.upsert({
    where: {
      provider_externalId: {
        provider,
        externalId: event.id,
      },
    },
    create: {
      provider,
      externalId: event.id,
      type: event.type,
      payload: jsonPayload(event),
    },
    update: {},
  });

  if (providerEvent.status === "PROCESSED") {
    return { duplicate: true };
  }

  const claim = await prisma.providerEvent.updateMany({
    where: {
      id: providerEvent.id,
      status: { in: ["RECEIVED", "FAILED"] },
    },
    data: {
      status: "PROCESSING",
      error: null,
    },
  });

  if (claim.count === 0) {
    return { duplicate: true };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const account = await tx.walletAccount.findFirst({
        where: {
          provider,
          OR: [
            { externalId: event.accountReference },
            ...(provider === "SANDBOX"
              ? [{ id: event.accountReference }]
              : []),
          ],
        },
        select: { id: true },
      });

      if (!account) {
        throw new Error("Conta do evento não encontrada.");
      }

      const existingTransaction = await tx.transaction.findFirst({
        where: { provider, externalId: event.id },
        select: { id: true },
      });

      if (existingTransaction) {
        await tx.providerEvent.update({
          where: { id: providerEvent.id },
          data: { status: "PROCESSED", processedAt: new Date() },
        });
        return;
      }

      const card = event.cardReference
        ? await tx.card.findFirst({
            where: {
              accountId: account.id,
              provider,
              OR: [
                { externalId: event.cardReference },
                ...(provider === "SANDBOX"
                  ? [{ id: event.cardReference }]
                  : []),
              ],
            },
            select: { id: true, spendingBucketId: true },
          })
        : null;

      const spendingBucket = card?.spendingBucketId
        ? { id: card.spendingBucketId }
        : await tx.walletBucket.findFirst({
            where: { accountId: account.id, type: "PRIMARY", dependentId: null },
            select: { id: true },
          });
      const clearingBucket = await tx.walletBucket.findFirst({
        where: { accountId: account.id, type: "CLEARING", dependentId: null },
        select: { id: true },
      });

      if (!spendingBucket || !clearingBucket) {
        throw new Error("Carteiras contábeis da conta não encontradas.");
      }

      const signedAmount =
        event.type === "purchase.created"
          ? -Math.abs(event.amountCents)
          : Math.abs(event.amountCents);

      const itemTotal = event.items.reduce(
        (sum, item) => sum + item.totalAmountCents,
        0
      );
      const hasItems = event.items.length > 0;
      const detailStatus = !hasItems
        ? "PENDING"
        : itemTotal === Math.abs(event.amountCents)
        ? "AVAILABLE"
        : "REVIEW_REQUIRED";

      await tx.transaction.create({
        data: {
          accountId: account.id,
          cardId: card?.id,
          provider,
          externalId: event.id,
          authorizationCode: event.authorizationCode,
          type:
            event.type === "purchase.created" ? "PURCHASE" : "REFUND",
          amountCents: signedAmount,
          description: event.description,
          merchant: event.merchant,
          category: event.category,
          detailStatus,
          occurredAt: event.occurredAt,
          items: hasItems
            ? {
                create: event.items.map((item) => ({
                  name: item.name,
                  ean: item.ean,
                  quantity: item.quantity,
                  unitPriceCents: item.unitPriceCents,
                  totalAmountCents: item.totalAmountCents,
                  source: "MERCHANT_INTEGRATION",
                  confidenceBasisPoints: item.confidenceBasisPoints,
                })),
              }
            : undefined,
        },
      });

      await postExternalMovement(tx, {
        accountId: account.id,
        spendingBucketId: spendingBucket.id,
        clearingBucketId: clearingBucket.id,
        amountCents: Math.abs(event.amountCents),
        kind: event.type === "purchase.created" ? "PURCHASE" : "REFUND",
        idempotencyKey: `payment:${provider}:${event.id}`,
        description: event.description,
      });

      await tx.walletAccount.update({
        where: { id: account.id },
        data: {
          balanceCents: { increment: signedAmount },
          syncStatus: "SYNCED",
        },
      });

      await tx.providerEvent.update({
        where: { id: providerEvent.id },
        data: {
          status: "PROCESSED",
          processedAt: new Date(),
        },
      });
    });

    return { duplicate: false };
  } catch (error) {
    const message =
      error instanceof Error ? error.message.slice(0, 500) : "Erro desconhecido";

    await prisma.providerEvent.update({
      where: { id: providerEvent.id },
      data: {
        status: "FAILED",
        error: message,
      },
    });

    throw error;
  }
}
