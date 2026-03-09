"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

type MonthlyChartItem = {
  label: string;
  entradas: number;
  saidas: number;
};

type WeeklyChartItem = {
  label: string;
  total: number;
};

type DependentUsageItem = {
  name: string;
  usedCents: number;
  limitCents: number;
  remainingCents: number;
  percentUsed: number;
};

type RecentTransactionItem = {
  id: string;
  description: string;
  merchant: string | null;
  category: string | null;
  typeLabel: string;
  amountLabel: string;
  occurredAtLabel: string;
  positive: boolean;
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function ExecutiveCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
      <div className="text-sm font-semibold text-[#5b2cff]">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-black/60">{note}</p>
    </div>
  );
}

function InsightCard({
  title,
  text,
  tone = "default",
}: {
  title: string;
  text: string;
  tone?: "default" | "warning" | "success" | "danger";
}) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "danger"
      ? "border-red-200 bg-red-50"
      : "border-black/10 bg-white";

  return (
    <div className={`rounded-3xl border p-5 ${toneClasses}`}>
      <div className="text-sm font-semibold text-[#5b2cff]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-black/70">{text}</p>
    </div>
  );
}

function BadgeCard({
  title,
  value,
  active,
}: {
  title: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        active
          ? "border-[#5b2cff]/20 bg-[#5b2cff]/[0.05]"
          : "border-black/10 bg-white"
      }`}
    >
      <div className="text-sm font-semibold text-[#5b2cff]">{title}</div>
      <div className="mt-2 text-xl font-bold text-[#0f172a]">{value}</div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-black/45">
        {active ? "Conquistado" : "Em progresso"}
      </div>
    </div>
  );
}

export default function PainelPremiumClient({
  balanceCents,
  entriesCents,
  debitsCents,
  dependentsCount,
  totalSentToDependentsCents,
  familyRemainingLimitCents,
  monthlyChart,
  weeklyChart,
  dependentUsage,
  recentTransactions,
  highestCategoryName,
  highestCategoryValueCents,
}: {
  balanceCents: number;
  entriesCents: number;
  debitsCents: number;
  dependentsCount: number;
  totalSentToDependentsCents: number;
  familyRemainingLimitCents: number;
  monthlyChart: MonthlyChartItem[];
  weeklyChart: WeeklyChartItem[];
  dependentUsage: DependentUsageItem[];
  recentTransactions: RecentTransactionItem[];
  highestCategoryName: string;
  highestCategoryValueCents: number;
}) {
  const topDependent =
    dependentUsage.length > 0
      ? [...dependentUsage].sort((a, b) => b.usedCents - a.usedCents)[0]
      : null;

  const alertCritical = dependentUsage.find((item) => item.percentUsed >= 100);
  const alertWarning = dependentUsage.find(
    (item) => item.percentUsed >= 80 && item.percentUsed < 100
  );

  const pieData = dependentUsage.map((item) => ({
    name: item.name,
    value: item.usedCents,
  }));

  const weekCurrent = weeklyChart[weeklyChart.length - 1]?.total ?? 0;
  const weekPrevious = weeklyChart[weeklyChart.length - 2]?.total ?? 0;
  const weeklyVariation =
    weekPrevious > 0 ? ((weekCurrent - weekPrevious) / weekPrevious) * 100 : 0;

  const premiumBadges = [
    {
      title: "Família ativa",
      value: dependentsCount > 0 ? `${dependentsCount} dependentes` : "Sem vínculos",
      active: dependentsCount > 0,
    },
    {
      title: "Fluxo monitorado",
      value: entriesCents > 0 || debitsCents > 0 ? "Conta em uso" : "Sem uso",
      active: entriesCents > 0 || debitsCents > 0,
    },
    {
      title: "Extrato inteligente",
      value: recentTransactions.length > 0 ? "Ativo" : "Pendente",
      active: recentTransactions.length > 0,
    },
    {
      title: "Gestão premium",
      value: familyRemainingLimitCents > 0 ? "Operacional" : "Revisar limites",
      active: familyRemainingLimitCents > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/10 bg-white p-6 soft-shadow">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="text-sm font-semibold text-[#5b2cff]">
              Saldo disponível
            </div>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-[#0f172a]">
              {formatCurrency(balanceCents)}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-black/55">
              Visão consolidada da conta familiar, com inteligência financeira,
              alertas automáticos e acompanhamento premium dos dependentes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Entradas
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {formatCurrency(entriesCents)}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Saídas
              </div>
              <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                {formatCurrency(debitsCents)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <ExecutiveCard
          label="Dependentes ativos"
          value={String(dependentsCount)}
          note="Perfis familiares vinculados à conta principal."
        />
        <ExecutiveCard
          label="Total enviado"
          value={formatCurrency(totalSentToDependentsCents)}
          note="Valor transferido para dependentes."
        />
        <ExecutiveCard
          label="Restante familiar"
          value={formatCurrency(familyRemainingLimitCents)}
          note="Saldo disponível dentro dos limites familiares."
        />
        <ExecutiveCard
          label="Maior categoria"
          value={highestCategoryName}
          note={
            highestCategoryValueCents > 0
              ? `${formatCurrency(highestCategoryValueCents)} no período recente.`
              : "Ainda sem gastos suficientes."
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Fluxo financeiro
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
            Entradas x saídas
          </h2>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value / 100)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: "#0f172a" }}
                />
                <Bar dataKey="entradas" radius={[10, 10, 0, 0]} />
                <Bar dataKey="saidas" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Uso por dependente
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
            Distribuição familiar
          </h2>

          <div className="mt-6 h-[220px]">
            {pieData.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-black/60">
                Ainda não há uso suficiente para exibir o gráfico.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={82}
                    innerRadius={46}
                    paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          ["#5b2cff", "#7c5cff", "#a18bff", "#c4bbff"][index % 4]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {dependentUsage.length === 0 ? (
              <div className="text-sm text-black/60">
                Nenhum dependente ativo encontrado.
              </div>
            ) : (
              dependentUsage.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#0f172a]">{item.name}</span>
                    <span className="text-black/60">
                      {formatCurrency(item.usedCents)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-black/5">
                    <div
                      className="h-3 rounded-full bg-[#5b2cff]"
                      style={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-black/45">
                    Restante: {formatCurrency(item.remainingCents)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Comparativo semanal
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
            Evolução dos últimos 7 dias
          </h2>

          <div className="mt-3 text-sm text-black/60">
            {weeklyVariation > 0
              ? `Crescimento de ${weeklyVariation.toFixed(0)}% em relação à semana anterior.`
              : weeklyVariation < 0
              ? `Queda de ${Math.abs(weeklyVariation).toFixed(
                  0
                )}% em relação à semana anterior.`
              : "Sem variação relevante entre as últimas semanas."}
          </div>

          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value / 100)
                  }
                />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#5b2cff"
                  fill="#5b2cff"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Insights</div>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
            Inteligência da conta
          </h2>

          <div className="mt-5 space-y-4">
            <InsightCard
              title="Maior uso atual"
              text={
                topDependent
                  ? `${topDependent.name} utilizou ${formatCurrency(
                      topDependent.usedCents
                    )} e já consumiu ${topDependent.percentUsed.toFixed(
                      0
                    )}% do limite definido.`
                  : "Ainda não há dependentes com uso registrado."
              }
              tone={topDependent ? "success" : "default"}
            />

            <InsightCard
              title="Alerta de limite"
              text={
                alertCritical
                  ? `${alertCritical.name} ultrapassou ou atingiu 100% do limite. É recomendável revisar imediatamente.`
                  : alertWarning
                  ? `${alertWarning.name} atingiu ${alertWarning.percentUsed.toFixed(
                      0
                    )}% do limite mensal. Vale revisar o extrato ou ajustar o limite.`
                  : "Nenhum dependente está próximo do limite neste momento."
              }
              tone={
                alertCritical
                  ? "danger"
                  : alertWarning
                  ? "warning"
                  : "default"
              }
            />

            <InsightCard
              title="Categoria dominante"
              text={
                highestCategoryValueCents > 0
                  ? `${highestCategoryName} representa o maior volume recente, com ${formatCurrency(
                      highestCategoryValueCents
                    )}.`
                  : "Ainda não há dados suficientes para identificar a categoria principal."
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
        <div className="text-sm font-semibold text-[#5b2cff]">
          Badges da experiência
        </div>
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
          Progresso da conta KidsCard
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {premiumBadges.map((badge) => (
            <BadgeCard
              key={badge.title}
              title={badge.title}
              value={badge.value}
              active={badge.active}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Atividade recente
          </div>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">
            Últimas movimentações
          </h2>

          <div className="mt-5 space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                Nenhuma movimentação recente encontrada.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-4"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[#0f172a]">
                      {tx.description}
                    </div>
                    <div className="mt-1 text-sm text-black/55">
                      {tx.merchant || tx.category || tx.typeLabel}
                    </div>
                    <div className="mt-1 text-xs text-black/45">
                      {tx.occurredAtLabel}
                    </div>
                  </div>

                  <div
                    className={`text-right text-lg font-bold ${
                      tx.positive ? "text-emerald-700" : "text-[#0f172a]"
                    }`}
                  >
                    {tx.amountLabel}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
          <div className="text-sm font-semibold text-white/60">KidsCard Pro</div>
          <h2 className="mt-2 text-3xl font-bold">
            Uma visão bancária moderna para a gestão da família
          </h2>
          <p className="mt-4 max-w-4xl leading-8 text-white/75">
            O painel pro da KidsCard reúne saldo, fluxo financeiro, dependentes,
            limites, alertas e inteligência visual em uma experiência mais
            estratégica, mais clara e mais próxima de uma fintech real.
          </p>
        </div>
      </section>
    </div>
  );
}