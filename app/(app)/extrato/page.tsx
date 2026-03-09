import DashboardShell from "../../../components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Prisma, TransactionType } from "@prisma/client";
import ExtratoFilters from "@/components/extrato/ExtratoFilters";
import ExtratoInteractive from "@/components/extrato/ExtratoInteractive";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

const transactionItemDetails: Record<
  string,
  { name: string; amountCents: number }[]
> = {
  "Lanche escolar": [
    { name: "Coxinha", amountCents: 1850 },
    { name: "Suco de laranja", amountCents: 1260 },
    { name: "Esfiha", amountCents: 1000 },
  ],
  "Compra no mercado": [
    { name: "Arroz 5kg", amountCents: 2490 },
    { name: "Leite integral (2)", amountCents: 1500 },
    { name: "Sabonete", amountCents: 800 },
    { name: "Frutas", amountCents: 8200 },
  ],
  "Compra no supermercado": [
    { name: "Macarrão", amountCents: 1290 },
    { name: "Molho de tomate", amountCents: 690 },
    { name: "Refrigerante", amountCents: 850 },
  ],
  Padaria: [
    { name: "Pão francês", amountCents: 900 },
    { name: "Café", amountCents: 650 },
  ],
};

function SummaryCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
      <div className="text-sm font-semibold text-[#5b2cff]">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60">{note}</p>
    </div>
  );
}

function getWhereByType(type: string): Prisma.TransactionWhereInput {
  switch (type) {
    case "entries":
      return { amountCents: { gt: 0 } };
    case "debits":
      return { amountCents: { lt: 0 } };
    case "transfers":
      return { type: "TRANSFER_OUT" };
    case "purchases":
      return { type: "PURCHASE" };
    default:
      return {};
  }
}

export default async function ExtratoPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string;
    limit?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const currentType = resolvedSearchParams.type || "all";
  const limitRaw = resolvedSearchParams.limit || "20";
  const currentLimit = ["20", "50", "100"].includes(limitRaw) ? limitRaw : "20";
  const take = Number(currentLimit);

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      balanceCents: true,
    },
  });

  if (!account) {
    return (
      <DashboardShell
        title="Extrato da conta"
        subtitle="Acompanhe entradas, saídas e movimentações da conta KidsCard com mais clareza e organização."
      >
        <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
          Conta não encontrada.
        </div>
      </DashboardShell>
    );
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      accountId: account.id,
      ...getWhereByType(currentType),
    },
    orderBy: { occurredAt: "desc" },
    take,
  });

  const allTransactions = await prisma.transaction.findMany({
    where: { accountId: account.id },
    orderBy: { occurredAt: "desc" },
    take: 100,
  });

  const totalEntries = allTransactions
    .filter((tx) => tx.amountCents > 0)
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const totalDebits = allTransactions
    .filter((tx) => tx.amountCents < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);

  const totalTransfersToDependents = allTransactions
    .filter((tx) => tx.type === "TRANSFER_OUT")
    .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);

  const totalPurchases = allTransactions
    .filter((tx) => tx.type === "PURCHASE")
    .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);

  const serializedTransactions = transactions.map((item) => ({
    id: item.id,
    description: item.description,
    occurredAt: item.occurredAt.toISOString(),
    amountCents: item.amountCents,
    type: item.type as TransactionType,
    category: item.category,
    merchant: item.merchant,
  }));

  return (
    <DashboardShell
      title="Extrato da conta"
      subtitle="Acompanhe entradas, saídas e movimentações da conta KidsCard com mais clareza e organização."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <SummaryCard
          label="Entradas"
          value={formatCurrency(totalEntries)}
          note="Créditos registrados nas movimentações recentes da conta."
        />
        <SummaryCard
          label="Saídas"
          value={formatCurrency(totalDebits)}
          note="Movimentações de débito registradas no histórico recente."
        />
        <SummaryCard
          label="Transferências"
          value={formatCurrency(totalTransfersToDependents)}
          note="Valor enviado para dependentes no período recente."
        />
        <SummaryCard
          label="Saldo atual"
          value={formatCurrency(account.balanceCents)}
          note="Valor atualmente disponível na conta principal."
        />
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-[#5b2cff]">
              Filtros do extrato
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              Período e tipo de movimentação
            </h2>
          </div>

          <ExtratoFilters
            currentType={currentType}
            currentLimit={currentLimit}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Compras
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a]">
              {formatCurrency(totalPurchases)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Enviado para dependentes
            </div>
            <div className="mt-2 text-xl font-bold text-[#5b2cff]">
              {formatCurrency(totalTransfersToDependents)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Saídas
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a]">
              {formatCurrency(totalDebits)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Conta
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a]">
              Ag. {session.user.agency} • {session.user.accountNumber}
            </div>
          </div>
        </div>
      </div>

      <ExtratoInteractive
        transactions={serializedTransactions}
        totalEntries={totalEntries}
        totalPurchases={totalPurchases}
        totalTransfersToDependents={totalTransfersToDependents}
        transactionItemDetails={transactionItemDetails}
      />
    </DashboardShell>
  );
}