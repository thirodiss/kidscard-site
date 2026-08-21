"use client"

import Link from "next/link"
import { useActionState } from "react"
import { bootstrapAdminAction, type AdminSetupState } from "@/app/configurar-admin/actions"

const initialState: AdminSetupState = { success: false, message: "" }

export default function AdminSetupForm() {
  const [state, action, pending] = useActionState(bootstrapAdminAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-bold text-emerald-950">Administrador criado</h2>
        <p className="mt-3 text-sm leading-6 text-emerald-900">{state.message}</p>
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm">
          Agência <strong>{state.agency}</strong> • Conta <strong>{state.accountNumber}</strong>
        </div>
        <Link href="/login" className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">
          Entrar no KidsCard
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <Input name="setupToken" label="Chave de configuração" type="password" autoComplete="off" />
      <Input name="name" label="Nome do administrador" autoComplete="name" />
      <Input name="email" label="E-mail" type="email" autoComplete="email" />
      <Input name="cpf" label="CPF" inputMode="numeric" autoComplete="off" />
      <Input name="password" label="Senha (mínimo 12 caracteres, letras e números)" type="password" autoComplete="new-password" />
      {state.message ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.message}</div> : null}
      <button disabled={pending} className="w-full rounded-full bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-60">
        {pending ? "Configurando..." : "Criar administrador"}
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
