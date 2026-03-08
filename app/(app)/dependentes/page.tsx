import DashboardShell from "../../../components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateDependentForm from "@/components/dependents/CreateDependentForm";
import TransferToDependentForm from "@/components/dependents/TransferToDependentForm";
import EditDependentLimitForm from "@/components/dependents/EditDependentLimitForm";
import EditDependentForm from "@/components/dependents/EditDependentForm";
import DependentHistoryPanel from "@/components/dependents/DependentHistoryPanel";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function calculateAge(birthDate: Date | null) {
  if (!birthDate) return "Idade não informada";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} ${age === 1 ? "ano" : "anos"}`;
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

function ActionButton({
  title,
  desc,
  disabled = false,
}: {
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-left transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="font-semibold text-[#0f172a]">{title}</div>
      <p className="mt-1 text-sm leading-6 text-black/60">{desc}</p>
    </button>
  );
}

export default async function DependentesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
  });

  if (!account) {
    return (
      <DashboardShell
        title="Dependentes"
        subtitle="Gerencie os dependentes vinculados à conta, acompanhe o relacionamento familiar e organize os acessos principais da plataforma."
      >
        <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
          Conta não encontrada.
        </div>
      </DashboardShell>
    );
  }

  const dependents = await prisma.dependent.findMany({
    where: {
      guardianId: session.user.id,
      accountId: account.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const activeDependents = dependents.filter((item) => item.isActive);

  const allTransfers = await prisma.transfer.findMany({
    where: {
      fromAccountId: account.id,
    },
    include: {
      dependent: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const recentTransfers = allTransfers.slice(0, 5);

  const transfersByDependent = await prisma.transfer.groupBy({
    by: ["dependentId"],
    where: {
      fromAccountId: account.id,
    },
    _sum: {
      amountCents: true,
    },
  });

  const totalsMap = new Map(
    transfersByDependent.map((item) => [
      item.dependentId,
      item._sum.amountCents ?? 0,
    ])
  );

  const transferHistoryMap = new Map<
    string,
    Array<{
      id: string;
      amountCents: number;
      note: string | null;
      createdAt: string;
    }>
  >();

  for (const transfer of allTransfers) {
    const current = transferHistoryMap.get(transfer.dependentId) ?? [];
    current.push({
      id: transfer.id,
      amountCents: transfer.amountCents,
      note: transfer.note,
      createdAt: transfer.createdAt.toISOString(),
    });
    transferHistoryMap.set(transfer.dependentId, current);
  }

  const enrichedDependents = dependents.map((dependent) => {
    const receivedCents = totalsMap.get(dependent.id) ?? 0;
    const remainingLimitCents = Math.max(
      dependent.monthlyLimitCents - receivedCents,
      0
    );

    return {
      ...dependent,
      receivedCents,
      remainingLimitCents,
      transferHistory: transferHistoryMap.get(dependent.id) ?? [],
    };
  });

  const totalMonthlyLimit = activeDependents.reduce(
    (sum, item) => sum + item.monthlyLimitCents,
    0
  );

  const totalSentToDependents = enrichedDependents.reduce(
    (sum, item) => sum + item.receivedCents,
    0
  );

  return (
    <DashboardShell
      title="Dependentes"
      subtitle="Gerencie os dependentes vinculados à conta, acompanhe o relacionamento familiar e organize os acessos principais da plataforma."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <SummaryCard
          label="Dependentes ativos"
          value={String(activeDependents.length)}
          note="Quantidade de dependentes atualmente vinculados à conta."
        />
        <SummaryCard
          label="Status familiar"
          value={activeDependents.length > 0 ? "Ativo" : "Sem vínculos"}
          note="A estrutura familiar vinculada à conta principal."
        />
        <SummaryCard
          label="Limite total mensal"
          value={formatCurrency(totalMonthlyLimit)}
          note="Soma dos limites mensais definidos para os dependentes ativos."
        />
        <SummaryCard
          label="Total enviado"
          value={formatCurrency(totalSentToDependents)}
          note="Valor total já transferido para dependentes."
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold text-[#5b2cff]">
                Família vinculada
              </div>
              <h2 className="mt-2 text-2xl font-bold">Dependentes cadastrados</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <CreateDependentForm />
              <TransferToDependentForm
                dependents={activeDependents.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {enrichedDependents.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-5 text-sm text-black/60">
                Nenhum dependente foi cadastrado ainda nesta conta.
              </div>
            ) : (
              enrichedDependents.map((dependent) => {
                const initials = dependent.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase();

                const progress =
                  dependent.monthlyLimitCents > 0
                    ? Math.min(
                        (dependent.receivedCents / dependent.monthlyLimitCents) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={dependent.id}
                    className="rounded-3xl border border-black/10 bg-black/[0.02] p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5b2cff] text-sm font-bold text-white">
                            {initials}
                          </div>

                          <div>
                            <div className="text-xl font-bold text-[#0f172a]">
                              {dependent.name}
                            </div>
                            <div className="mt-1 text-sm text-black/55">
                              {calculateAge(dependent.birthDate)} • Dependente vinculado
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              dependent.isActive
                                ? "bg-[#5b2cff]/10 text-[#5b2cff]"
                                : "bg-black/5 text-black/60"
                            }`}
                          >
                            {dependent.isActive ? "Ativo" : "Inativo"}
                          </span>

                          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60">
                            Limite mensal {formatCurrency(dependent.monthlyLimitCents)}
                          </span>

                          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60">
                            CPF {dependent.cpf || "Não informado"}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-black/10 bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                              Recebido
                            </div>
                            <div className="mt-2 text-xl font-bold text-[#0f172a]">
                              {formatCurrency(dependent.receivedCents)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                              Saldo restante
                            </div>
                            <div className="mt-2 text-xl font-bold text-[#0f172a]">
                              {formatCurrency(dependent.remainingLimitCents)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-black/10 bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                              Uso do limite
                            </div>
                            <div className="mt-2 text-xl font-bold text-[#0f172a]">
                              {dependent.monthlyLimitCents > 0
                                ? `${progress.toFixed(0)}%`
                                : "0%"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-[#0f172a]">
                              Progresso do limite
                            </span>
                            <span className="text-black/60">
                              {formatCurrency(dependent.receivedCents)} de{" "}
                              {formatCurrency(dependent.monthlyLimitCents)}
                            </span>
                          </div>

                          <div className="h-3 rounded-full bg-black/5">
                            <div
                              className="h-3 rounded-full bg-[#5b2cff]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <EditDependentForm
                          dependentId={dependent.id}
                          initialName={dependent.name}
                          initialCpf={dependent.cpf}
                          initialBirthDate={dependent.birthDate}
                          initialIsActive={dependent.isActive}
                        />

                        <EditDependentLimitForm
                          dependentId={dependent.id}
                          dependentName={dependent.name}
                          currentLimitCents={dependent.monthlyLimitCents}
                        />

                        <DependentHistoryPanel
                          dependentName={dependent.name}
                          transfers={dependent.transferHistory}
                        />
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
              Ações rápidas
            </div>
            <h2 className="mt-2 text-2xl font-bold">Gestão familiar</h2>

            <div className="mt-5 grid gap-3">
              <ActionButton
                title="Cadastrar novo dependente"
                desc="Inclua um novo dependente vinculado à conta principal."
              />
              <ActionButton
                title="Atualizar dados"
                desc="Revise as informações cadastrais e familiares."
                disabled={dependents.length === 0}
              />
              <ActionButton
                title="Ajustar limites"
                desc="Defina ou revise limites mensais dos dependentes."
                disabled={dependents.length === 0}
              />
              <ActionButton
                title="Consultar histórico"
                desc="Revise alterações e eventos relacionados aos dependentes."
                disabled={dependents.length === 0}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Transferências recentes
            </div>
            <h2 className="mt-2 text-2xl font-bold">Envios para dependentes</h2>

            <div className="mt-5 space-y-3">
              {recentTransfers.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                  Nenhuma transferência realizada ainda.
                </div>
              ) : (
                recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="rounded-2xl border border-black/10 bg-black/[0.02] p-4"
                  >
                    <div className="font-semibold text-[#0f172a]">
                      {transfer.dependent.name}
                    </div>
                    <div className="mt-1 text-sm text-black/55">
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(transfer.createdAt)}
                    </div>
                    <div className="mt-2 text-lg font-bold text-[#0f172a]">
                      {formatCurrency(transfer.amountCents)}
                    </div>
                    {transfer.note ? (
                      <p className="mt-2 text-sm text-black/60">{transfer.note}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
            <div className="text-sm font-semibold text-white/60">
              Organização familiar
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              Mais clareza sobre quem está vinculado à conta
            </h2>
            <p className="mt-4 leading-7 text-white/75">
              A área de dependentes centraliza o acompanhamento familiar, os
              limites mensais e a organização dos perfis vinculados à conta principal.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}