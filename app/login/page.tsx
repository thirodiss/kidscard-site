"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [agency, setAgency] = useState("")
  const [account, setAccount] = useState("")
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      agency,
      account,
      cpf,
      password,
      redirect: false,
      callbackUrl: "/painel",
    })

    setLoading(false)

    if (res?.ok) {
      router.push("/painel")
      router.refresh()
      return
    }

    setError("Dados inválidos. Confira agência, conta, CPF e senha.")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#183b8f_0%,_#0b1530_45%,_#08101f_100%)]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[-80px] top-[-80px] h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-40px] h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          <section className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-[#0d1b3f] via-[#0d234f] to-[#0a1223] p-10 text-white lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                KidsCard
              </div>

              <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
                A conta digital pensada para famílias.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                Controle de saldo, cartão, extrato e dependentes em uma experiência
                segura, moderna e simples.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Experiência KidsCard
                </p>
                <p className="mt-3 text-2xl font-semibold">
                  Conta, cartão e dependentes
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Ambiente seguro para gestão financeira familiar, com visão do
                  responsável e acompanhamento dos filhos.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs text-white/60">Gestão familiar</p>
                  <p className="mt-2 text-2xl font-semibold">100%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs text-white/60">Acesso seguro</p>
                  <p className="mt-2 text-2xl font-semibold">24/7</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-medium text-slate-500">KidsCard</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                  Acessar conta
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Entre com os dados bancários da sua conta KidsCard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="agency"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Agência
                    </label>
                    <input
                      id="agency"
                      name="agency"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0001"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="account"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Conta
                    </label>
                    <input
                      id="account"
                      name="account"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="123456"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cpf"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    CPF
                  </label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="username"
                    placeholder="12345678900"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs leading-6 text-slate-500">
                <p className="font-semibold text-slate-700">Acesso de demonstração</p>
                <p>Agência: 0001</p>
                <p>Conta: 123456</p>
                <p>CPF: 12345678900</p>
                <p>Senha: 123456</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}