"use client";

import { useActionState } from "react";
import { assignCardWalletAction } from "@/app/(app)/cartao/wallet-actions";

type Option = { id: string; label: string; balanceLabel: string };
const initialState = { success: false, message: "" };

export default function AssignCardWalletForm({ cardId, currentBucketId, options }: { cardId: string; currentBucketId: string | null; options: Option[] }) {
  const [state, action, pending] = useActionState(assignCardWalletAction, initialState);
  return (
    <form action={action} className="mt-5 space-y-3">
      <input type="hidden" name="cardId" value={cardId} />
      <label className="block text-sm font-semibold text-black/65">
        Carteira usada nas compras
        <select name="bucketId" defaultValue={currentBucketId || options[0]?.id} className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#5b2cff]">
          {options.map((option) => <option key={option.id} value={option.id}>{option.label} • {option.balanceLabel}</option>)}
        </select>
      </label>
      {state.message ? <div className={`rounded-2xl border p-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{state.message}</div> : null}
      <button disabled={pending || options.length === 0} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60">
        {pending ? "Salvando..." : "Vincular carteira"}
      </button>
    </form>
  );
}
