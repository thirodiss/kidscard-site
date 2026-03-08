"use client";

import { useActionState, useEffect, useState } from "react";
import { createTransferToDependentAction } from "@/app/(app)/dependentes/transfer-actions";

type DependentOption = {
  id: string;
  name: string;
};

type ActionState = {
  success: boolean;
  message: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function TransferToDependentForm({
  dependents,
}: {
  dependents: DependentOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createTransferToDependentAction,
    initialState
  );

  const [dependentId, setDependentId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (state.success) {
      setDependentId("");
      setAmount("");
      setNote("");
      setOpen(false);
    }
  }, [state]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={dependents.length === 0}
        className="rounded-full border border-black/10 bg-white px-5 py-3 font-semibold hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {open ? "Fechar transferência" : "Transferir para dependente"}
      </button>

      {open ? (
        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Nova transferência
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#0f172a]">
            Enviar saldo para dependente
          </h3>

          <form action={formAction} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black/65">
                Dependente
              </label>
              <select
                name="dependentId"
                value={dependentId}
                onChange={(e) => setDependentId(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
              >
                <option value="">Selecione</option>
                {dependents.map((dependent) => (
                  <option key={dependent.id} value={dependent.id}>
                    {dependent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black/65">
                Valor
              </label>
              <input
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex.: 100"
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black/65">
                Observação
              </label>
              <input
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: Mesada da semana"
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
              />
            </div>

            {state.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  state.success
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {state.message}
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-[#5b2cff] px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Transferindo..." : "Confirmar transferência"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 bg-white px-5 py-3 font-semibold hover:bg-black/[0.03]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}