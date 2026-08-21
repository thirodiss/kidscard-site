"use client";

import { useActionState, useState } from "react";
import { submitReceiptAction } from "@/app/(app)/extrato/receipt-actions";

const initialState = { success: false, message: "" };

export default function ReceiptIntakeForm({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitReceiptAction, initialState);

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#5b2cff]/20 bg-[#5b2cff]/5 px-4 py-2 text-sm font-semibold text-[#5b2cff]">
        {open ? "Fechar envio" : "Enviar comprovante"}
      </button>

      {state.message ? (
        <div className={`mt-3 rounded-2xl border p-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {state.message}
        </div>
      ) : null}

      {open && !state.success ? (
        <form action={action} className="mt-4 space-y-3 rounded-2xl border border-black/10 bg-white p-4">
          <input type="hidden" name="transactionId" value={transactionId} />
          <Field name="accessKey" label="Chave NFC-e (opcional)" placeholder="44 dígitos" />
          <Field name="merchantTaxId" label="CNPJ do estabelecimento (opcional)" />
          <label className="block text-xs font-semibold text-black/65">
            Itens do comprovante
            <textarea name="items" required rows={5} placeholder={"Arroz 5kg; 1; 24,90; 789...\nLeite; 2; 7,50"} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 font-normal outline-none focus:border-[#5b2cff]" />
          </label>
          <p className="text-xs leading-5 text-black/50">Uma linha por item: nome; quantidade; preço unitário; EAN opcional. Neste sandbox, a leitura é manual.</p>
          <button disabled={pending} className="rounded-full bg-[#5b2cff] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? "Conciliando..." : "Conciliar comprovante"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Field(props: { name: string; label: string; placeholder?: string }) {
  return (
    <label className="block text-xs font-semibold text-black/65">
      {props.label}
      <input name={props.name} placeholder={props.placeholder} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 font-normal outline-none focus:border-[#5b2cff]" />
    </label>
  );
}
