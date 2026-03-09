import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Prisma, TransactionType } from "@prisma/client";
import PainelPremiumClient from "@/components/dashboard/PainelPremiumClient";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTypeLabel(type: TransactionType) {
  switch (type) {
    case "DEPOSIT":
      return "Entrada";
    case "TRANSFER_IN":
      return "Transferência recebida";
    case "TRANSFER_OUT":
      return "Transferência enviada";
    case "PURCHASE":
      return "Compra";
    case "REFUND":
      return "Estorno";
    case "FEE":
      return "Tarifa";
    case "ADJUSTMENT":
      return "Ajuste";
    default:
      return "Movimentação";
  }
}

type WalletAccountWithRelations = Prisma.WalletAccountGetPayload<{
  include: {
    cards: true;
    transactions: true;
    dependents: true;
  };
}>;

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(date);
}

export default async function PainelPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const account: WalletAccountWithRelations | null =
    await prisma.walletAccount.findFirst({
      where: { userId: session.user.id },
      include: {
        cards: true,
        transactions: {
          orderBy: { occurredAt: "desc" },
          take: 12,
        },
        dependents: true,
      },
    });

  if (!account) {
    return <div className="p-8">Conta não encontrada.</div>;
  }

  const allTransactions = await prisma.transaction.findMany({
    where: { accountId: account.id },
    orderBy: { occurredAt: "asc" },
    take: 100,
  });

  const allTransfers = await prisma.transfer.findMany({
    where: { fromAccountId: account.id },
    include: { dependent: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const entriesCents = allTransactions
    .filter((tx) => tx.amountCents > 0)
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const debitsCents = allTransactions
    .filter((tx) => tx.amountCents < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);

  const activeDependents = account.dependents.filter((item) => item.isActive);
  const monthlyLimitTotal = activeDependents.reduce(
    (sum, item) => sum + item.monthlyLimitCents,
    0
  );

  const transfersByDependent = await prisma.transfer.groupBy({
    by: ["dependentId"],
    where: {
      fromAccountId: account.id,
    },
    _sum: {
      amountCents: true,
    },
  });

  const transferTotalsMap = new Map(
    transfersByDependent.map((item) => [
      item.dependentId,
      item._sum.amountCents ?? 0,
    ])
  );

  const dependentUsage = activeDependents.map((dependent) => {
    const usedCents = transferTotalsMap.get(dependent.id) ?? 0;
    const remainingCents = Math.max(dependent.monthlyLimitCents - usedCents, 0);
    const percentUsed =
      dependent.monthlyLimitCents > 0
        ? (usedCents / dependent.monthlyLimitCents) * 100
        : 0;

    return {
      name: dependent.name,
      usedCents,
      limitCents: dependent.monthlyLimitCents,
      remainingCents,
      percentUsed,
    };
  });

  const totalSentToDependentsCents = dependentUsage.reduce(
    (sum, item) => sum + item.usedCents,
    0
  );

  const familyRemainingLimitCents = Math.max(
    monthlyLimitTotal - totalSentToDependentsCents,
    0
  );

  const purchasesByCategory = allTransactions
    .filter((tx) => tx.amountCents < 0)
    .reduce<Record<string, number>>((acc, tx) => {
      const key = tx.category || "Outros";
      acc[key] = (acc[key] || 0) + Math.abs(tx.amountCents);
      return acc;
    }, {});

  const categoryEntries = Object.entries(purchasesByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  const highestCategoryName = categoryEntries[0]?.[0] || "Sem dados";
  const highestCategoryValueCents = categoryEntries[0]?.[1] || 0;

  const now = new Date();
  const monthlyChart = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    const entries = allTransactions
      .filter(
        (tx) =>
          tx.occurredAt.getMonth() === date.getMonth() &&
          tx.occurredAt.getFullYear() === date.getFullYear() &&
          tx.amountCents > 0
      )
      .reduce((sum, tx) => sum + tx.amountCents, 0);

    const exits = allTransactions
      .filter(
        (tx) =>
          tx.occurredAt.getMonth() === date.getMonth() &&
          tx.occurredAt.getFullYear() === date.getFullYear() &&
          tx.amountCents < 0
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);

    return {
      label: monthLabel(date),
      entradas: entries,
      saidas: exits,
    };
  });

  const recentTransactions = account.transactions.map((tx) => ({
    id: tx.id,
    description: tx.description,
    merchant: tx.merchant,
    category: tx.category,
    typeLabel: getTypeLabel(tx.type),
    amountLabel:
      tx.amountCents >= 0
        ? `+ ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(tx.amountCents / 100)}`
        : `- ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Math.abs(tx.amountCents) / 100)}`,
    occurredAtLabel: formatDate(tx.occurredAt),
    positive: tx.amountCents >= 0,
  }));

  return (
    <PainelPremiumClient
      balanceCents={account.balanceCents}
      entriesCents={entriesCents}
      debitsCents={debitsCents}
      dependentsCount={activeDependents.length}
      totalSentToDependentsCents={totalSentToDependentsCents}
      familyRemainingLimitCents={familyRemainingLimitCents}
      monthlyChart={monthlyChart}
      dependentUsage={dependentUsage}
      recentTransactions={recentTransactions}
      highestCategoryName={highestCategoryName}
      highestCategoryValueCents={highestCategoryValueCents}
    />
  );
}