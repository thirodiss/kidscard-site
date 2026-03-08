"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");

  return (
    <main className="px-6 py-16">
      <div className="container-page max-w-3xl">
        <div className="rounded-[32px] border border-black/10 bg-white p-8 md:p-10 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Recuperação</div>
          <h1 className="mt-2 text-3xl font-bold">Recuperar senha</h1>
          <p className="mt-4 max-w-2xl text-black/70">
            Informe seu e-mail para receber as instruções de recuperação de acesso.
          </p>

          <form className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black/70">
                E-mail cadastrado
              </label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#5b2cff]"
              />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#5b2cff] px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Enviar instruções
            </button>

            <Link href="/login" className="block text-center text-sm font-semibold text-[#5b2cff]">
              Voltar para login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}