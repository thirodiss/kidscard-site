"use client";

import { useMemo, useState } from "react";

type TransactionType =
  | "DEPOSIT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "PURCHASE"
  | "REFUND"
  | "FEE"
  | "ADJUSTMENT";

type TransactionItemDetail = {
  name: string;
  amountCents: number;
};

type ExtratoTransaction = {
  id: string;
  description: string;
  occurredAt: string;
  amountCents: number;
  type: TransactionType;
  category: string | null;
  merchant: string | null;
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
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

function getTransactionTone(type: TransactionType, active: boolean) {
  if (active) {
    return "border-[#5b2cff] bg-[#5b2cff]/[0.06] ring-2 ring-[#5b2cff]/10";
  }

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

export default function ExtratoInteractive({
  transactions,
  totalEntries,
  totalPurchases,
  totalTransfersToDependents,
  transactionItemDetails,
}: {
  transactions: ExtratoTransaction[];
  totalEntries: number;
  totalPurchases: number;
  totalTransfersToDependents: number;
  transactionItemDetails: Record<string, TransactionItemDetail[]>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    transactions[0]?.id ?? null
  );

  const selectedTransaction = useMemo(
    () => transactions.find((item) => item.id === selectedId) ?? transactions[0] ?? null,
    [selectedId, transactions]
  );

  const selectedItems = selectedTransaction
    ? transactionItemDetails[selectedTransaction.description] || null
    : null;

  return (
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
              const isActive = selectedTransaction?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${getTransactionTone(
                    item.type,
                    isActive
                  )}`}
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
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Lançamento selecionado
          </div>
          <h2 className="mt-2 text-2xl font-bold">Resumo da movimentação</h2>

          {selectedTransaction ? (
            <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-lg font-bold text-[#0f172a]">
                {selectedTransaction.description}
              </div>
              <div className="mt-1 text-sm text-black/55">
                {formatDate(selectedTransaction.occurredAt)}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Tipo</span>
                  <span className="font-semibold">
                    {getTypeLabel(selectedTransaction.type)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Categoria</span>
                  <span className="font-semibold">
                    {selectedTransaction.category || "Sem categoria"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Estabelecimento</span>
                  <span className="font-semibold">
                    {selectedTransaction.merchant || "Não informado"}
                  </span>
                </div>
              </div>

              {selectedItems ? (
                <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-[#5b2cff]">
                    Detalhamento da compra
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedItems.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-black/60">{item.name}</span>
                        <span className="font-semibold text-[#0f172a]">
                          {formatCurrency(item.amountCents)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Valor</span>
                  <span>
                    {selectedTransaction.amountCents >= 0
                      ? `+ ${formatCurrency(selectedTransaction.amountCents)}`
                      : `- ${formatCurrency(
                          Math.abs(selectedTransaction.amountCents)
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
            Clique em qualquer lançamento para visualizar os detalhes da
            movimentação e, quando disponível, o detalhamento completo da compra.
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
  );
}