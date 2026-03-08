import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Prisma, TransactionType } from "@prisma/client";

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
    default:
      return "bg-black/5 text-black/60";
  }
}

type WalletAccountWithRelations = Prisma.WalletAccountGetPayload<{
  include: {
    cards: true;
    transactions: true;
    dependents: true;
  };
}>;

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
      <p className="text-sm font-semibold text-[#5b2cff]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
        {value}
      </p>
      {note ? <p className="mt-2 text-sm text-black/60">{note}</p> : null}
    </div>
  );
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
          take: 8,
        },
        dependents: true,
      },
    });

  if (!account) {
    return <div className="p-8">Conta não encontrada.</div>;
  }

  const entries = account.transactions
    .filter((tx) => tx.amountCents > 0)
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const debits = account.transactions
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

  const enrichedDependents = activeDependents.map((dependent) => {
    const receivedCents = transferTotalsMap.get(dependent.id) ?? 0;
    const remainingLimitCents = Math.max(
      dependent.monthlyLimitCents - receivedCents,
      0
    );

    return {
      ...dependent,
      receivedCents,
      remainingLimitCents,
    };
  });

  const totalSentToDependents = enrichedDependents.reduce(
    (sum, item) => sum + item.receivedCents,
    0
  );

  const familyRemainingLimit = Math.max(
    monthlyLimitTotal - totalSentToDependents,
    0
  );

  const topDependent =
    enrichedDependents.length > 0
      ? [...enrichedDependents].sort(
          (a, b) => b.receivedCents - a.receivedCents
        )[0]
      : null;

  const purchasesByCategory = account.transactions
    .filter((tx) => tx.amountCents < 0)
    .reduce<Record<string, number>>((acc, tx) => {
      const key = tx.category || "Outros";
      acc[key] = (acc[key] || 0) + Math.abs(tx.amountCents);
      return acc;
    }, {});

  const categoryEntries = Object.entries(purchasesByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  const topCategoryValue = categoryEntries[0]?.[1] || 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/10 bg-white p-6 soft-shadow">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <div className="text-sm font-semibold text-[#5b2cff]">
              Saldo disponível
            </div>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-[#0f172a]">
              {formatCurrency(account.balanceCents)}
            </h1>
            <p className="mt-3 text-sm text-black/55">
              Agência {session.user.agency} • Conta {session.user.accountNumber}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Entradas recentes
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {formatCurrency(entries)}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Saídas recentes
              </div>
              <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                {formatCurrency(debits)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Cartões"
          value={String(account.cards.length)}
          note="Cartões vinculados à conta principal."
        />
        <MetricCard
          label="Dependentes"
          value={String(account.dependents.length)}
          note="Perfis vinculados à família."
        />
        <MetricCard
          label="Status da conta"
          value={account.status}
          note="Situação atual da conta digital."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#5b2cff]">
                Últimas movimentações
              </div>
              <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
                Atividade recente da conta
              </h2>
            </div>

            <div className="rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-sm font-semibold text-black/60">
              {account.transactions.length} lançamentos
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {account.transactions.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-sm text-black/60">
                Nenhuma movimentação encontrada.
              </div>
            ) : (
              account.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a]">
                      {tx.description}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-black/55">
                      <span>{tx.merchant || tx.category || "Movimentação"}</span>
                      <span>•</span>
                      <span>{formatDate(tx.occurredAt)}</span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadge(
                          tx.type
                        )}`}
                      >
                        {getTypeLabel(tx.type)}
                      </span>
                    </div>
                  </div>

                  <p className="text-right text-lg font-bold text-[#0f172a]">
                    {tx.amountCents >= 0
                      ? `+ ${formatCurrency(tx.amountCents)}`
                      : `- ${formatCurrency(Math.abs(tx.amountCents))}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Estrutura familiar
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
              Resumo dos dependentes
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-black/55">
                  Ativos
                </div>
                <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                  {activeDependents.length}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-black/55">
                  Limite mensal total
                </div>
                <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                  {formatCurrency(monthlyLimitTotal)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-black/55">
                  Total enviado
                </div>
                <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                  {formatCurrency(totalSentToDependents)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-black/55">
                  Restante familiar
                </div>
                <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                  {formatCurrency(familyRemainingLimit)}
                </div>
              </div>
            </div>

            {topDependent ? (
              <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="text-sm font-semibold text-[#5b2cff]">
                  Maior uso atual
                </div>
                <div className="mt-2 text-lg font-bold text-[#0f172a]">
                  {topDependent.name}
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Recebeu {formatCurrency(topDependent.receivedCents)} de{" "}
                  {formatCurrency(topDependent.monthlyLimitCents)}.
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Uso por dependente
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
              Distribuição familiar
            </h2>

            <div className="mt-5 space-y-4">
              {enrichedDependents.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                  Ainda não há dependentes suficientes para exibir o resumo.
                </div>
              ) : (
                enrichedDependents.map((dependent) => {
                  const progress =
                    dependent.monthlyLimitCents > 0
                      ? Math.min(
                          (dependent.receivedCents / dependent.monthlyLimitCents) * 100,
                          100
                        )
                      : 0;

                  return (
                    <div key={dependent.id}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#0f172a]">
                          {dependent.name}
                        </span>
                        <span className="text-black/60">
                          {formatCurrency(dependent.receivedCents)}
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-black/5">
                        <div
                          className="h-3 rounded-full bg-[#5b2cff]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-2 text-xs text-black/55">
                        Restante: {formatCurrency(dependent.remainingLimitCents)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Gastos por categoria
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
              Distribuição recente
            </h2>

            <div className="mt-5 space-y-4">
              {categoryEntries.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                  Ainda não há gastos suficientes para exibir categorias.
                </div>
              ) : (
                categoryEntries.map(([category, value]) => {
                  const width =
                    topCategoryValue > 0
                      ? Math.max((value / topCategoryValue) * 100, 10)
                      : 10;

                  return (
                    <div key={category}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#0f172a]">
                          {category}
                        </span>
                        <span className="text-black/60">
                          {formatCurrency(value)}
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-black/5">
                        <div
                          className="h-3 rounded-full bg-[#5b2cff]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
            <div className="text-sm font-semibold text-white/60">
              Conta digital KidsCard
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              Visão clara do dinheiro da família
            </h2>
            <p className="mt-4 leading-7 text-white/75">
              Acompanhe saldo, movimentações, dependentes e gastos por categoria
              em uma experiência bancária simples, organizada e segura.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}