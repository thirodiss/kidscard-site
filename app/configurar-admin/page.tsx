import Link from "next/link"
import AdminSetupForm from "@/components/admin/AdminSetupForm"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ConfigureAdminPage() {
  const hasAdmin = (await prisma.user.count({ where: { role: "ADMIN" } })) > 0
  const enabled = Boolean(process.env.ADMIN_SETUP_TOKEN && process.env.ADMIN_SETUP_TOKEN.length >= 32)

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="text-sm font-semibold text-[#5b2cff]">KidsCard</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Configuração administrativa</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Esta página funciona uma única vez e exige a chave secreta definida na Vercel.
        </p>

        <div className="mt-8">
          {hasAdmin ? (
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-950">
              <div className="font-bold">Configuração já concluída</div>
              <p className="mt-2 text-sm">Já existe um administrador. A criação pública permanece bloqueada.</p>
              <Link href="/login" className="mt-4 inline-flex font-bold text-blue-700">Ir para o login</Link>
            </div>
          ) : enabled ? (
            <AdminSetupForm />
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
              <div className="font-bold">Configuração desativada</div>
              <p className="mt-2 text-sm leading-6">Defina ADMIN_SETUP_TOKEN com pelo menos 32 caracteres na Vercel e faça um novo deploy.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
