"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "5511959819146";
const WHATSAPP_TEXT = encodeURIComponent(
  "Olá! Quero montar meu plano Kids Card (Conta Digital + módulos). Pode me ajudar?"
);

type Addon = {
  id: string;
  title: string;
  desc: string;
  price: number;
  badge?: string;
};

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
      {children}
    </span>
  );
}

export default function PlanosPage() {
  const basePrice = 29;

  const addons: Addon[] = useMemo(
    () => [
      {
        id: "extrato",
        title: "Extrato detalhado por item",
        desc: "Visualize produtos, quantidades e valores por item (conforme plano e cobertura).",
        price: 39,
        badge: "Diferencial",
      },
      {
        id: "juridico",
        title: "Assessoria jurídica",
        desc: "Apoio e orientação em temas relacionados (benefício do plano).",
        price: 29,
      },
      {
        id: "psicologica",
        title: "Assessoria psicológica",
        desc: "Suporte emocional e acompanhamento (benefício do plano).",
        price: 25,
      },
      {
        id: "psiquiatrica",
        title: "Assessoria psiquiátrica",
        desc: "Apoio especializado (benefício do plano).",
        price: 39,
      },
      {
        id: "financeira",
        title: "Assessoria financeira",
        desc: "Organização e educação financeira da família (benefício do plano).",
        price: 19,
      },
      {
        id: "seguro",
        title: "Seguro Pensão",
        desc: "Camada extra de segurança e tranquilidade (benefício do plano).",
        price: 29,
        badge: "Proteção",
      },
      {
        id: "intercambio",
        title: "Prime Intercâmbio",
        desc: "Benefício premium adicional (plano elegível).",
        price: 59,
        badge: "Premium",
      },
    ],
    []
  );

  const [selected, setSelected] = useState<Record<string, boolean>>({
    extrato: true,
    juridico: true,
    seguro: true,
  });

  const addonsTotal = addons.reduce((sum, a) => sum + (selected[a.id] ? a.price : 0), 0);
  const total = basePrice + addonsTotal;

  const planTag =
    total >= 159 ? "Prime" : total >= 99 ? "Premium" : total >= 59 ? "Plus" : "Básico";

  const summaryLines = addons
    .filter((a) => selected[a.id])
    .map((a) => `• ${a.title} (${brl(a.price)}/mês)`);

  const waText = encodeURIComponent(
    `Olá! Quero montar meu plano Kids Card.\n\nBase: Conta Digital (${brl(
      basePrice
    )}/mês)\nMódulos:\n${summaryLines.join("\n") || "• Nenhum"}\n\nTotal: ${brl(
      total
    )}/mês\nTag: ${planTag}`
  );

  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        {/* HERO */}
        <div className="text-center">
          <Pill>Planos por módulos</Pill>

          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            Monte seu plano Kids Card
          </h1>

          <p className="text-black/70 text-lg mt-4 max-w-3xl mx-auto">
            A Kids Card é uma conta digital. Você paga uma mensalidade base e adiciona
            módulos de benefícios conforme sua necessidade.
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#5b2cff] text-white px-8 py-3 font-semibold hover:opacity-90 transition"
            >
              Montar pelo WhatsApp
            </a>
            <Link
              href="/contato"
              className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold hover:bg-black/5 transition"
            >
              Falar por formulário
            </Link>
          </div>
        </div>

        {/* GRID */}
        <section className="mt-14 grid lg:grid-cols-3 gap-8 items-start">
          {/* BASE */}
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-black/60">Plano Base</div>
                <div className="text-2xl font-bold mt-1">Conta Digital</div>
              </div>
              <div className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold">
                Obrigatório
              </div>
            </div>

            <div className="mt-6">
              <div className="text-4xl font-bold">{brl(basePrice)}</div>
              <div className="text-black/60">/mês</div>
            </div>

            <ul className="mt-6 space-y-3 text-black/80">
              <li>• Conta digital Pensão + Mesada</li>
              <li>• Extrato padrão por estabelecimento</li>
              <li>• Organização por categorias</li>
              <li>• Benefícios do plano (quando disponível)</li>
            </ul>

            <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="font-semibold">Recomendação</div>
              <div className="text-black/70 mt-2">
                Para a maioria dos casos, combine o <b>Extrato detalhado</b> +{" "}
                <b>Seguro Pensão</b> e, se necessário, <b>Assessoria Jurídica</b>.
              </div>
            </div>
          </div>

          {/* ADDONS */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-black/60">Módulos</div>
                <div className="text-2xl font-bold mt-1">Escolha seus benefícios</div>
                <p className="text-black/70 mt-3 max-w-2xl">
                  Marque os módulos desejados. O total mensal é calculado na hora.
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-black/60">Tag do plano</div>
                <div className="inline-flex mt-1 rounded-full bg-black text-white px-3 py-1 text-xs font-semibold">
                  {planTag}
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-5">
              {addons.map((a) => {
                const isOn = !!selected[a.id];
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelected((s) => ({ ...s, [a.id]: !s[a.id] }))}
                    className={`text-left rounded-2xl border p-5 transition ${
                      isOn
                        ? "border-[#5b2cff] bg-[#5b2cff]/[0.06]"
                        : "border-black/10 bg-white hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{a.title}</div>
                          {a.badge ? (
                            <span className="text-[11px] rounded-full border border-black/10 bg-black/5 px-2 py-0.5 font-semibold text-black/70">
                              {a.badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-sm text-black/70 mt-2">{a.desc}</div>
                      </div>

                      <div className="text-right min-w-[88px]">
                        <div className="font-bold">{brl(a.price)}</div>
                        <div className="text-xs text-black/60">/mês</div>
                        <div
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isOn ? "bg-[#5b2cff] text-white" : "bg-black/5 text-black/70"
                          }`}
                        >
                          {isOn ? "Ativo" : "Adicionar"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* TOTAL */}
            <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-black/60">
                    Resumo do seu plano
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    Total: {brl(total)} <span className="text-black/60 text-lg">/mês</span>
                  </div>

                  <div className="text-black/70 mt-3">
                    Base: {brl(basePrice)}/mês
                    {addonsTotal > 0 ? ` + Módulos: ${brl(addonsTotal)}/mês` : ""}
                  </div>

                  <div className="mt-4 text-sm text-black/70">
                    {summaryLines.length ? (
                      <div className="space-y-1">
                        {summaryLines.map((l) => (
                          <div key={l}>{l}</div>
                        ))}
                      </div>
                    ) : (
                      <div>• Nenhum módulo selecionado</div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-black/55">
                    * Alguns benefícios podem depender de cobertura e regras do plano.
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[260px]">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-black text-white px-7 py-3 font-semibold hover:opacity-90 transition text-center"
                  >
                    Fechar no WhatsApp
                  </a>

                  <Link
                    href="/contato"
                    className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5 transition text-center"
                  >
                    Falar por formulário
                  </Link>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5 transition text-center"
                  >
                    Tirar dúvidas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 rounded-3xl border border-black/10 bg-white p-10 soft-shadow">
          <h2 className="text-2xl font-bold">Dúvidas rápidas</h2>

          <div className="mt-6 grid md:grid-cols-2 gap-8">
            <div>
              <div className="font-bold">O cartão é recarregável?</div>
              <div className="text-black/70 mt-2">
                Não. O produto principal é uma <b>conta digital</b>. O cartão é apenas o meio
                de uso vinculado à conta.
              </div>
            </div>

            <div>
              <div className="font-bold">O que muda nos planos?</div>
              <div className="text-black/70 mt-2">
                Os <b>benefícios</b> e o acesso ao <b>extrato detalhado por item</b> (quando
                elegível).
              </div>
            </div>

            <div>
              <div className="font-bold">Posso contratar só o extrato detalhado?</div>
              <div className="text-black/70 mt-2">
                Sim. Mantenha a Conta Digital (base) e adicione o módulo de Extrato Detalhado.
              </div>
            </div>

            <div>
              <div className="font-bold">Como contratar?</div>
              <div className="text-black/70 mt-2">
                Clique em “Fechar no WhatsApp” e envie o resumo do seu plano.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}