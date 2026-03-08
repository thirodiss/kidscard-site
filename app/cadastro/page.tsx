"use client";

import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <main className="px-6 py-16">
      <div className="container-page max-w-5xl grid gap-10 lg:grid-cols-[1fr_460px] items-center">
        <div>
          <div className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
            Novo cadastro
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-[#0f172a] md:text-6xl">
            Crie sua conta KidsCard
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70">
            Cadastre-se para acompanhar movimentações, visualizar o cartão, gerenciar
            dependentes e acessar a experiência completa da KidsCard.
          </p>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-8 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Cadastro</div>
          <h2 className="mt-2 text-2xl font-bold">Abrir acesso à plataforma</h2>

          <form className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black/70">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#5b2cff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black/70">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#5b2cff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black/70">
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#5b2cff]"
              />
            </div>

            <Link
              href="/painel"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#5b2cff] px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Criar conta
            </Link>

            <div className="text-sm text-black/60">
              Já tem conta?{" "}
              <Link href="/login" className="font-semibold text-[#5b2cff]">
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}