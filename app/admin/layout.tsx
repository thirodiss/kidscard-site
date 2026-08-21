import Link from "next/link"
import { requireAdmin } from "@/lib/admin"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm font-semibold text-[#5b2cff]">KidsCard Admin</div>
            <div className="text-xs text-slate-500">Acesso de {admin.name}</div>
          </div>
          <nav className="flex items-center gap-3 text-sm font-semibold">
            <Link className="rounded-full bg-slate-900 px-4 py-2 text-white" href="/admin/cadastros">
              Pré-cadastros
            </Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2" href="/painel">
              Área do cliente
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}
