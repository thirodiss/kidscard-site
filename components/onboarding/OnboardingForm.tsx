"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitOnboardingAction } from "@/app/cadastro/actions";

const initialState: { success: boolean; message: string; protocol?: string } = {
  success: false,
  message: "",
};

export default function OnboardingForm() {
  const [state, action, pending] = useActionState(submitOnboardingAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-8 soft-shadow">
        <div className="text-sm font-semibold text-emerald-700">Solicitação recebida</div>
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">Próxima etapa: validação</h2>
        <p className="mt-4 leading-7 text-black/65">{state.message}</p>
        {state.protocol ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4 text-sm">
            Protocolo <strong>{state.protocol}</strong>
          </div>
        ) : null}
        <p className="mt-4 text-sm leading-6 text-black/55">
          Nenhum cartão, conta de pagamento ou movimentação real foi criado nesta etapa.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-black/10 bg-white p-8 soft-shadow">
      <div className="text-sm font-semibold text-[#5b2cff]">Pré-cadastro</div>
      <h2 className="mt-2 text-2xl font-bold">Solicitar adesão</h2>

      <form action={action} className="mt-6 space-y-4">
        <Input name="guardianName" label="Nome completo do responsável" />
        <Input name="email" label="E-mail" type="email" />
        <Input name="phone" label="Celular com DDD" inputMode="tel" />
        <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
          <Input name="city" label="Cidade" />
          <Input name="state" label="UF" maxLength={2} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-black/70">
            Uso principal
            <select name="intendedUse" defaultValue="BOTH" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#5b2cff]">
              <option value="BOTH">Pensão e mesada</option>
              <option value="PENSION">Pensão</option>
              <option value="ALLOWANCE">Mesada</option>
            </select>
          </label>
          <Input name="dependentCount" label="Quantidade de dependentes" type="number" min={1} max={20} defaultValue="1" />
        </div>

        <div className="space-y-3 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm leading-6 text-black/65">
          <Checkbox name="guardianDeclaration">Declaro ser maior de 18 anos e responsável legal pela solicitação.</Checkbox>
          <Checkbox name="privacyConsent">Li e concordo com o <Link className="font-semibold text-[#5b2cff]" href="/privacidade">Aviso de Privacidade</Link>.</Checkbox>
          <Checkbox name="termsConsent">Li e concordo com os <Link className="font-semibold text-[#5b2cff]" href="/termos">Termos da pré-adesão</Link>.</Checkbox>
        </div>

        {state.message ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div> : null}

        <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center rounded-full bg-[#5b2cff] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
          {pending ? "Enviando..." : "Enviar pré-cadastro"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm font-semibold text-black/70">
      {label}
      <input required {...props} className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#5b2cff]" />
    </label>
  );
}

function Checkbox({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-3">
      <input name={name} type="checkbox" required className="mt-1 h-4 w-4" />
      <span>{children}</span>
    </label>
  );
}
