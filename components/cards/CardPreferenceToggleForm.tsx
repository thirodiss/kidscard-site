"use client";

import { useActionState } from "react";
import { updateCardPreferenceAction } from "@/app/(app)/cartao/preferences-actions";

type ActionState = {
  success: boolean;
  message: string;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function CardPreferenceToggleForm({
  cardId,
  field,
  label,
  enabled,
}: {
  cardId: string;
  field:
    | "allowPhysicalPurchase"
    | "allowOnlinePurchase"
    | "allowContactless"
    | "allowNotifications";
  label: string;
  enabled: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateCardPreferenceAction,
    initialState
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="cardId" value={cardId} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!enabled)} />

      <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4">
        <div>
          <div className="font-semibold text-[#0f172a]">{label}</div>
          {state.message ? (
            <div
              className={`mt-1 text-xs ${
                state.success ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {state.message}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
            enabled
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-black/5 text-black/60"
          } disabled:opacity-60`}
        >
          {pending ? "Salvando..." : enabled ? "Ativado" : "Desativado"}
        </button>
      </div>
    </form>
  );
}