"use client";

import { useState } from "react";

type TransferItem = {
  id: string;
  amountCents: number;
  note: string | null;
  createdAt: string;
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

export default function DependentHistoryPanel({
  dependentName,
  transfers,
}: {
  dependentName: string;
  transfers: TransferItem[];
}) {
  const [open, setOpen] = useState(false);

  const totalReceived = transfers.reduce((sum, item) => sum + item.amountCents, 0);
  const latestTransfer = transfers[0] ?? null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-black/10 bg-white px-4 py-2 font-semibold hover:bg-black/[0.03]"
      >
        {open ? "Fechar histórico" : "Ver histórico"}
      </button>

      {open ? (
        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Histórico individual
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#0f172a]">
            Transferências para {dependentName}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Total recebido
              </div>
              <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                {formatCurrency(totalReceived)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Última transferência
              </div>
              <div className="mt-2 text-sm font-semibold text-[#0f172a]">
                {latestTransfer
                  ? formatDate(latestTransfer.createdAt)
                  : "Nenhuma transferência"}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {transfers.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                Nenhuma transferência registrada para este dependente.
              </div>
            ) : (
              transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[#0f172a]">
                        Transferência recebida
                      </div>
                      <div className="mt-1 text-sm text-black/55">
                        {formatDate(transfer.createdAt)}
                      </div>
                      {transfer.note ? (
                        <p className="mt-2 text-sm text-black/60">{transfer.note}</p>
                      ) : null}
                    </div>

                    <div className="text-lg font-bold text-[#0f172a]">
                      {formatCurrency(transfer.amountCents)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}