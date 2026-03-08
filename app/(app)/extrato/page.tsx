import DashboardShell from "../../../components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Prisma, TransactionType } from "@prisma/client";
import ExtratoFilters from "@/components/extrato/ExtratoFilters";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

function getTypeBadge(type: TransactionType) {
  switch (type) {
    case "DEPOSIT":
    case "TRANSFER_IN":
    case "REFUND":
      return "bg-emerald-500/10 text-emerald-700";
    case "TRANSFER_OUT":
      return "bg-[#5b2cff]/10 text-[#5b2cff]";
    default:
      return "bg-black/5 text-black/60";
  }
}

function getTransactionTone(type: TransactionType) {
  switch (type) {
    case "TRANSFER_OUT":
      return "border-[#5b2cff]/20 bg-[#5b2cff]/[0.04]";
    case "DEPOSIT":
    case "TRANSFER_IN":
    case "REFUND":
      return "border-emerald-500/20 bg-emerald-500/[0.04]";
    default:
      return "border-black/10 bg-black/[0.02]";
  }
}

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

  const latestTransaction = transactions[0] ?? null;

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

        <div className="mt-5 grid gap-3 md:grid-cols-3">
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
              Conta
            </div>
            <div className="mt-2 text-xl font-bold text-[#0f172a]">
              Ag. {session.user.agency} • {session.user.accountNumber}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#5b2cff]">
                Movimentações recentes
              </div>
              <h2 className="mt-2 text-2xl font-bold">Lançamentos do período</h2>
            </div>

            <div className="rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-sm font-semibold text-black/60">
              {transactions.length} lançamentos
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-black/60">
                Nenhuma movimentação encontrada para este filtro.
              </div>
            ) : (
              transactions.map((item) => {
                const amountLabel =
                  item.amountCents >= 0
                    ? `+ ${formatCurrency(item.amountCents)}`
                    : `- ${formatCurrency(Math.abs(item.amountCents))}`;

                const isDependentTransfer = item.type === "TRANSFER_OUT";

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 ${getTransactionTone(item.type)}`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-lg font-bold text-[#0f172a]">
                            {item.description}
                          </div>

                          {isDependentTransfer ? (
                            <span className="rounded-full bg-[#5b2cff]/10 px-3 py-1 text-xs font-semibold text-[#5b2cff]">
                              Enviado para dependente
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 text-sm text-black/55">
                          {formatDate(item.occurredAt)}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#5b2cff]/10 px-3 py-1 text-xs font-semibold text-[#5b2cff]">
                            {item.category || "Sem categoria"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadge(
                              item.type
                            )}`}
                          >
                            {getTypeLabel(item.type)}
                          </span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
                          {item.merchant
                            ? `Estabelecimento: ${item.merchant}.`
                            : isDependentTransfer
                            ? "Transferência registrada para perfil dependente vinculado à conta."
                            : "Movimentação registrada na conta KidsCard."}
                        </p>
                      </div>

                      <div className="text-lg font-bold text-[#0f172a]">
                        {amountLabel}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Último lançamento
            </div>
            <h2 className="mt-2 text-2xl font-bold">Resumo da movimentação</h2>

            {latestTransaction ? (
              <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="text-lg font-bold text-[#0f172a]">
                  {latestTransaction.description}
                </div>
                <div className="mt-1 text-sm text-black/55">
                  {formatDate(latestTransaction.occurredAt)}
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Tipo</span>
                    <span className="font-semibold">
                      {getTypeLabel(latestTransaction.type)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Categoria</span>
                    <span className="font-semibold">
                      {latestTransaction.category || "Sem categoria"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Estabelecimento</span>
                    <span className="font-semibold">
                      {latestTransaction.merchant || "Não informado"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between text-base font-bold">
                    <span>Valor</span>
                    <span>
                      {latestTransaction.amountCents >= 0
                        ? `+ ${formatCurrency(latestTransaction.amountCents)}`
                        : `- ${formatCurrency(
                            Math.abs(latestTransaction.amountCents)
                          )}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-black/60">
                Ainda não há lançamentos para exibir.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Destaques financeiros
            </div>
            <h2 className="mt-2 text-2xl font-bold">Resumo do período</h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4">
                <div className="font-semibold text-[#0f172a]">Entradas</div>
                <div className="font-bold text-emerald-700">
                  {formatCurrency(totalEntries)}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4">
                <div className="font-semibold text-[#0f172a]">Compras</div>
                <div className="font-bold text-[#0f172a]">
                  {formatCurrency(totalPurchases)}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4">
                <div className="font-semibold text-[#0f172a]">
                  Transferências para dependentes
                </div>
                <div className="font-bold text-[#5b2cff]">
                  {formatCurrency(totalTransfersToDependents)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
            <div className="text-sm font-semibold text-white/60">
              Extrato financeiro
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              Mais clareza sobre o uso do recurso
            </h2>
            <p className="mt-4 leading-7 text-white/75">
              Acompanhe entradas, gastos, compras, estornos e transferências para
              dependentes em uma visão clara da conta digital da família.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Segurança</div>
            <p className="mt-3 leading-7 text-black/65">
              Revise regularmente suas movimentações. Em caso de dúvida, confira
              o histórico da conta e acompanhe cada lançamento registrado.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}