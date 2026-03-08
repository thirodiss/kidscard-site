"use client";

import { useActionState, useEffect, useState } from "react";
import { createDependentAction } from "@/app/(app)/dependentes/actions";

type ActionState = {
  success: boolean;
  message: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

function SubmitButton() {
  return (
    <button
      type="submit"
      className="rounded-full bg-[#5b2cff] px-5 py-3 font-semibold text-white hover:opacity-90"
    >
      Salvar dependente
    </button>
  );
}

export default function CreateDependentForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createDependentAction,
    initialState
  );

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  useEffect(() => {
    if (state.success) {
      setName("");
      setCpf("");
      setBirthDate("");
      setMonthlyLimit("");
      setOpen(false);
    }
  }, [state]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-[#5b2cff] px-5 py-3 font-semibold text-white hover:opacity-90"
      >
        {open ? "Fechar cadastro" : "Adicionar dependente"}
      </button>

      {open ? (
        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-5 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">
            Novo dependente
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#0f172a]">
            Cadastrar perfil vinculado
          </h3>

          <form action={formAction} className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-black/65">
                  Nome completo
                </label>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: João Pedro"
                  className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black/65">
                  CPF
                </label>
                <input
                  name="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="Somente números"
                  className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black/65">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black/65">
                  Limite mensal
                </label>
                <input
                  name="monthlyLimit"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  placeholder="Ex.: 250"
                  className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 outline-none transition focus:border-[#5b2cff]"
                />
              </div>
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
                {pending ? "Salvando..." : "Salvar dependente"}
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