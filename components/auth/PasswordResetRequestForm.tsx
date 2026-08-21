"use client"

import Link from "next/link"
import { useActionState } from "react"
import {
  requestPasswordResetAction,
  type PasswordResetRequestState,
} from "@/app/recuperar-senha/actions"

const initialState: PasswordResetRequestState = { success: false, message: "" }

export default function PasswordResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initialState)

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm font-semibold text-black/70">
        E-mail cadastrado
        <input required name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#5b2cff]" />
      </label>

      {state.message ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {state.message}
        </div>
      ) : null}

      <button disabled={pending} className="inline-flex w-full items-center justify-center rounded-full bg-[#5b2cff] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
        {pending ? "Enviando..." : "Enviar instruções"}
      </button>
      <Link href="/login" className="block text-center text-sm font-semibold text-[#5b2cff]">Voltar para login</Link>
    </form>
  )
}
