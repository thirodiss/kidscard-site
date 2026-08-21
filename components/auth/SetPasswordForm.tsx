"use client"

import Link from "next/link"
import { useActionState } from "react"
import { setPasswordAction, type SetPasswordState } from "@/app/definir-senha/actions"

const initialState: SetPasswordState = { success: false, message: "" }

export default function SetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(setPasswordAction, initialState)

  if (state.success) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <div className="text-xl font-bold">Acesso liberado</div>
        <p className="mt-2 text-sm leading-6">{state.message}</p>
        <Link href="/login" className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">Ir para o login</Link>
      </div>
    )
  }

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="token" value={token} />
      <Input name="password" label="Nova senha" type="password" autoComplete="new-password" />
      <Input name="confirmPassword" label="Confirmar nova senha" type="password" autoComplete="new-password" />
      <p className="text-xs leading-5 text-slate-500">Use de 12 a 128 caracteres, incluindo letras e números.</p>
      {state.message ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.message}</div> : null}
      <button disabled={pending || token.length < 32} className="w-full rounded-full bg-[#5b2cff] px-6 py-3 font-bold text-white disabled:opacity-60">
        {pending ? "Salvando..." : "Definir senha"}
      </button>
    </form>
  )
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input required {...props} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-[#5b2cff]" />
    </label>
  )
}
