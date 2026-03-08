"use client";

import { useActionState } from "react";
import { updateCardStatusAction } from "@/app/(app)/cartao/actions";

type ActionState = {
  success: boolean;
  message: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function CardStatusActionForm({
  cardId,
  nextStatus,
  title,
  desc,
  disabled = false,
}: {
  cardId: string;
  nextStatus: "ACTIVE" | "BLOCKED";
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateCardStatusAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="cardId" value={cardId} />
      <input type="hidden" name="nextStatus" value={nextStatus} />

      <button
        type="submit"
        disabled={disabled || pending}
        className="w-full rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-left transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="font-semibold text-[#0f172a]">
          {pending ? "Processando..." : title}
        </div>
        <p className="mt-1 text-sm leading-6 text-black/60">{desc}</p>
      </button>

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
    </form>
  );
}