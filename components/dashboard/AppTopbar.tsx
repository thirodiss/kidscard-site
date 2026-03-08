"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const items = [
  { href: "/painel", label: "Painel" },
  { href: "/cartao", label: "Cartão" },
  { href: "/extrato", label: "Extrato" },
  { href: "/dependentes", label: "Dependentes" },
  { href: "/perfil", label: "Perfil" },
];

const pageTitles: Record<string, string> = {
  "/painel": "Painel",
  "/cartao": "Cartão",
  "/extrato": "Extrato",
  "/dependentes": "Dependentes",
  "/perfil": "Perfil",
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function AppTopbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const name = session?.user?.name || "Responsável KidsCard";
  const agency = (session?.user as any)?.agency || "0001";
  const account = (session?.user as any)?.accountNumber || "123456";
  const plan = "Standard";

  const initials = useMemo(() => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [name]);

  const currentPageLabel = pageTitles[pathname] ?? "Área do cliente";

  function handleLogout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur-md">
      <div className="container-page px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#5b2cff]">
              {getGreeting()}, {name.split(" ")[0]}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-black/55">
              <span className="font-semibold text-[#0f172a]">KidsCard</span>
              <span>•</span>
              <span>Área do cliente</span>
              <span>•</span>
              <span>{currentPageLabel}</span>
            </div>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="text-right">
              <div className="text-sm font-semibold text-[#0f172a]">{name}</div>
              <div className="text-xs text-black/55">
                Ag. {agency} • Conta {account} • Plano {plan}
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b2cff] text-sm font-bold text-white">
              {initials}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.03]"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1 lg:hidden"
            aria-label="Abrir menu da área do cliente"
          >
            <span className="h-[2px] w-6 bg-black"></span>
            <span className="h-[2px] w-6 bg-black"></span>
            <span className="h-[2px] w-6 bg-black"></span>
          </button>
        </div>

        <div className="mt-4 hidden items-center justify-between gap-4 lg:flex">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#5b2cff] text-white"
                      : "border border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-sm font-semibold text-black/60">
            Ambiente seguro
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-3 px-6 py-4">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-sm font-semibold">{name}</div>
              <div className="mt-1 text-sm text-black/60">
                Ag. {agency} • Conta {account}
              </div>
              <div className="mt-1 text-sm text-black/60">Plano {plan}</div>
            </div>

            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl border px-4 py-3 font-semibold ${
                  pathname === item.href
                    ? "border-[#5b2cff] bg-[#5b2cff] text-white"
                    : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-black px-5 py-3 text-center font-semibold text-white"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}