"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "/painel", label: "Painel", desc: "Visão geral da conta" },
  { href: "/cartao", label: "Cartão", desc: "Dados e preferências" },
  { href: "/extrato", label: "Extrato", desc: "Entradas e saídas" },
  { href: "/dependentes", label: "Dependentes", desc: "Gestão familiar" },
  { href: "/perfil", label: "Perfil", desc: "Dados e segurança" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [plan, setPlan] = useState("Standard");
  const [agency, setAgency] = useState("0001");
  const [account, setAccount] = useState("123456-7");

  useEffect(() => {
    const storedPlan = window.localStorage.getItem("kidscard-user-plan");
    const storedAgency = window.localStorage.getItem("kidscard-user-agency");
    const storedAccount = window.localStorage.getItem("kidscard-user-account");

    if (storedPlan) setPlan(storedPlan);
    if (storedAgency) setAgency(storedAgency);
    if (storedAccount) setAccount(storedAccount);
  }, []);

  return (
    <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:rounded-[32px] lg:border lg:border-black/10 lg:bg-white lg:p-5 lg:soft-shadow">
      <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#1e293b] p-5 text-white">
        <div className="text-sm font-semibold text-white/60">Conta KidsCard</div>
        <div className="mt-2 text-2xl font-bold">Internet Banking</div>

        <div className="mt-5 space-y-2 text-sm text-white/75">
          <div>Agência {agency}</div>
          <div>Conta {account}</div>
          <div>Plano {plan}</div>
        </div>
      </div>

      <nav className="mt-5 flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-3xl px-4 py-4 transition ${
                active
                  ? "bg-[#5b2cff] text-white"
                  : "bg-black/[0.03] text-black/80 hover:bg-black/[0.06]"
              }`}
            >
              <div className="font-semibold">{item.label}</div>
              <div
                className={`mt-1 text-xs ${
                  active ? "text-white/75" : "text-black/50"
                }`}
              >
                {item.desc}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.02] p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-black/50">
          Status da conta
        </div>
        <div className="mt-2 text-lg font-bold text-[#0f172a]">Ativa</div>
        <p className="mt-1 text-sm leading-6 text-black/60">
          Conta simples com função débito e acesso aos recursos da plataforma.
        </p>
      </div>

      <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-black/50">
          Segurança
        </div>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Revise seu perfil, extrato e acessos regularmente para manter a conta protegida.
        </p>
      </div>
    </aside>
  );
}