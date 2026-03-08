"use client";

import Link from "next/link";

type Feature = {
  label: string;
  basic: boolean;
  standard: boolean;
  gold: boolean;
  diamond: boolean;
};

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  badge?: string;
  accent: string;
  ring: string;
  button: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
      {children}
    </span>
  );
}

function CheckIcon({ active, color }: { active: boolean; color: string }) {
  if (active) {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
      >
        ✓
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-sm font-bold text-black/35">
      ✕
    </span>
  );
}

export default function PlanosPage() {
  const plans: Plan[] = [
    {
      id: "basic",
      name: "Plano Básico",
      price: "R$ 9,99",
      description: "Ideal para começar a organizar a rotina financeira da criança.",
      accent: "from-fuchsia-700 to-pink-600",
      ring: "ring-fuchsia-200",
      button: "bg-fuchsia-700 hover:opacity-90",
    },
    {
      id: "standard",
      name: "Plano Standard",
      price: "R$ 34,99",
      description: "Mais controle e acompanhamento para a família no dia a dia.",
      badge: "Mais popular",
      accent: "from-pink-600 to-rose-500",
      ring: "ring-pink-200",
      button: "bg-pink-600 hover:opacity-90",
    },
    {
      id: "gold",
      name: "Plano Gold",
      price: "R$ 99,99",
      description: "Recursos avançados e benefícios premium para uma gestão completa.",
      accent: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-200",
      button: "bg-emerald-500 hover:opacity-90",
    },
    {
      id: "diamond",
      name: "Plano Diamante",
      price: "R$ 299,99",
      description: "A experiência mais completa da KidsCard com todos os benefícios.",
      accent: "from-violet-700 to-purple-600",
      ring: "ring-violet-200",
      button: "bg-violet-700 hover:opacity-90",
    },
  ];

  const features: Feature[] = [
    {
      label: "Dashboard",
      basic: false,
      standard: false,
      gold: true,
      diamond: true,
    },
    {
      label: "Extrato comum",
      basic: true,
      standard: true,
      gold: true,
      diamond: true,
    },
    {
      label: "Extrato detalhado",
      basic: false,
      standard: false,
      gold: true,
      diamond: true,
    },
    {
      label: "Prime Intercâmbio",
      basic: false,
      standard: false,
      gold: false,
      diamond: true,
    },
    {
      label: "Assessoria jurídica",
      basic: false,
      standard: false,
      gold: true,
      diamond: true,
    },
    {
      label: "Assessoria financeira",
      basic: false,
      standard: false,
      gold: false,
      diamond: true,
    },
    {
      label: "Assessoria psicológica",
      basic: false,
      standard: false,
      gold: false,
      diamond: true,
    },
    {
      label: "Relatórios analíticos",
      basic: false,
      standard: true,
      gold: true,
      diamond: true,
    },
    {
      label: "Seguro pensão alimentícia",
      basic: false,
      standard: false,
      gold: false,
      diamond: true,
    },
  ];

  const planKeyMap = {
    basic: "basic",
    standard: "standard",
    gold: "gold",
    diamond: "diamond",
  } as const;

  const colorMap = {
    basic: "bg-fuchsia-700",
    standard: "bg-pink-600",
    gold: "bg-emerald-500",
    diamond: "bg-violet-700",
  } as const;

  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        <section className="text-center">
          <Pill>Planos KidsCard</Pill>

          <h1 className="mt-5 text-4xl font-bold md:text-5xl">
            Escolha o plano ideal para sua família
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-black/70">
            A KidsCard agora funciona com planos fixos. Cada opção libera benefícios
            diferentes conforme o nível escolhido, com mais segurança, controle e apoio
            para os responsáveis.
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="/contato"
              className="rounded-full bg-[#5b2cff] px-8 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Falar com a KidsCard
            </Link>

            <Link
              href="/sobre"
              className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold transition hover:bg-black/5"
            >
              Conhecer a plataforma
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-3xl border border-black/10 bg-white soft-shadow ring-1 ${plan.ring}`}
            >
              <div className={`bg-gradient-to-r ${plan.accent} px-6 py-6 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white/80">KidsCard</div>
                    <div className="mt-1 text-2xl font-bold">{plan.name}</div>
                  </div>

                  {plan.badge ? (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-6">
                <p className="min-h-[72px] text-sm leading-6 text-black/70">
                  {plan.description}
                </p>

                <div className="mt-6">
                  <div className="text-4xl font-bold">{plan.price}</div>
                  <div className="text-black/60">/mês</div>
                </div>

                <Link
                  href="/contato"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${plan.button}`}
                >
                  Escolher plano
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-black/10 bg-white p-4 md:p-8 soft-shadow">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold text-black/60">Comparativo</div>
              <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                Benefícios liberados por plano
              </h2>
            </div>

            <p className="max-w-xl text-sm text-black/65">
              Quanto mais completo o plano, mais recursos e serviços ficam disponíveis
              para a família.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-5 border-b border-black/10 pb-4">
                <div className="px-4 text-sm font-semibold text-black/50">Benefícios</div>
                {plans.map((plan) => (
                  <div key={plan.id} className="px-4 text-center">
                    <div className="font-bold">{plan.name.replace("Plano ", "")}</div>
                    <div className="mt-1 text-sm text-black/60">{plan.price}/mês</div>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-black/10">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="grid grid-cols-5 items-center py-4"
                  >
                    <div className="px-4 font-medium text-black/80">{feature.label}</div>

                    {(["basic", "standard", "gold", "diamond"] as const).map((key) => (
                      <div key={key} className="flex justify-center px-4">
                        <CheckIcon
                          active={feature[planKeyMap[key]]}
                          color={colorMap[key]}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-black/60">Como funciona</div>
            <h3 className="mt-2 text-2xl font-bold">
              Planos fechados, simples e fáceis de entender
            </h3>

            <div className="mt-5 space-y-4 text-black/75">
              <p>
                Você não precisa mais montar um plano por módulos. Agora a KidsCard
                trabalha com opções fixas, cada uma com um conjunto de benefícios
                definidos.
              </p>
              <p>
                Isso deixa a contratação mais clara, melhora a comparação entre os
                planos e facilita a escolha da família.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black p-8 text-white soft-shadow">
            <div className="text-sm font-semibold text-white/60">Resumo</div>
            <h3 className="mt-2 text-2xl font-bold">
              Mais previsibilidade, mais clareza, mais confiança
            </h3>

            <div className="mt-5 space-y-3 text-white/75">
              <p>• Planos organizados por faixa de benefício</p>
              <p>• Sem composição individual</p>
              <p>• Sem cálculo dinâmico</p>
              <p>• Sem CTA de fechar pelo WhatsApp</p>
              <p>• Estrutura melhor para conversão e apresentação premium</p>
            </div>

            <Link
              href="/contato"
              className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Solicitar apresentação
            </Link>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-black/10 bg-white p-10 soft-shadow">
          <h2 className="text-2xl font-bold">Dúvidas rápidas</h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <div className="font-bold">Posso montar meu próprio plano?</div>
              <div className="mt-2 text-black/70">
                Não. Agora a KidsCard trabalha com planos fixos, com benefícios
                definidos conforme o valor de cada opção.
              </div>
            </div>

            <div>
              <div className="font-bold">O que muda entre os planos?</div>
              <div className="mt-2 text-black/70">
                O nível de benefícios, suporte e recursos liberados para a família.
              </div>
            </div>

            <div>
              <div className="font-bold">Como contratar?</div>
              <div className="mt-2 text-black/70">
                Basta escolher o plano ideal e seguir pelo formulário de contato da
                plataforma.
              </div>
            </div>

            <div>
              <div className="font-bold">Posso migrar depois?</div>
              <div className="mt-2 text-black/70">
                Sim, a estrutura pode prever evolução para planos superiores conforme a
                necessidade da família.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}