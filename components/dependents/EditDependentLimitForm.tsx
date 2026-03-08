"use client";

import { useActionState, useEffect, useState } from "react";
import { updateDependentLimitAction } from "@/app/(app)/dependentes/update-limit-actions";

type ActionState = {
  success: boolean;
  message: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function EditDependentLimitForm({
  dependentId,
  dependentName,
  currentLimitCents,
}: {
  dependentId: string;
  dependentName: string;
  currentLimitCents: number;
}) {
  const [open, setOpen] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(
    String(currentLimitCents / 100)
  );

  const [state, formAction, pending] = useActionState(
    updateDependentLimitAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-black/10 bg-white px-4 py-2 font-semibold hover:bg-black/[0.03]"
      >
        {open ? "Fechar limite" : "Editar limite"}
      </button>

      {open ? (
        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Limite mensal
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#0f172a]">
            Atualizar limite de {dependentName}
          </h3>

          <form action={formAction} className="mt-5 space-y-4">
            <input type="hidden" name="dependentId" value={dependentId} />

            <div>
              <label className="mb-2 block text-sm font-semibold text-black/65">
                Novo limite mensal
              </label>
              <input
                name="monthlyLimit"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="Ex.: 250"
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
                {pending ? "Salvando..." : "Salvar limite"}
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