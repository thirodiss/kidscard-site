import Link from "next/link";

function MetricCard({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
      <div className="text-3xl font-bold tracking-tight text-[#0b1533] md:text-4xl">
        {value}
      </div>
      <div className="mt-2 text-lg font-semibold text-[#0b1533]">{label}</div>
      <p className="mt-2 text-sm leading-6 text-black/65">{note}</p>
    </div>
  );
}

function BarChartCard() {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
      <div className="text-sm font-semibold text-[#5b2cff]">Mercado</div>
      <h3 className="mt-2 text-2xl font-bold text-[#0b1533]">
        Potencial de mercado e recorrência
      </h3>
      <p className="mt-3 max-w-2xl text-black/70">
        A proposta combina conta digital, extrato detalhado e receita recorrente
        em um segmento com alto potencial de escala.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-black/70">
            <span>Pagadores de pensão no Brasil</span>
            <span>20,2 mi</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#5b2cff] to-[#8d6bff]" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-black/70">
            <span>Gasto estimado com pensão</span>
            <span>R$ 12,9 bi</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#111827] to-[#374151]" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-black/70">
            <span>Margem média projetada</span>
            <span>40–60%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-[56%] rounded-full bg-gradient-to-r from-[#ff4f8b] to-[#ff7aa8]" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-black/70">
            <span>Crescimento de mercado</span>
            <span>3,4%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-[34%] rounded-full bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutCard({
  title,
  percent,
  subtitle,
  colorClass,
}: {
  title: string;
  percent: string;
  subtitle: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
      <div className="text-sm font-semibold text-[#5b2cff]">{title}</div>

      <div className="mt-6 flex items-center gap-6">
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-full ${colorClass}`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#0b1533]">
            {percent}
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold text-[#0b1533]">{percent}</div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-black/70">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvestidoresPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-[#f5f7fb] px-6 pt-16 pb-14">
        <div className="container-page">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
              KidsCard • Investor Overview
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#0b1533] md:text-6xl">
              KidsCard para investidores
            </h1>

            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-black/70">
              Uma fintech com proposta diferenciada para pensão alimentícia e
              mesada, unindo conta digital, extrato detalhado e receita
              recorrente em um mercado amplo e ainda pouco explorado.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contato"
                className="rounded-full bg-black px-8 py-3 font-semibold text-white hover:opacity-90"
              >
                Falar sobre parceria
              </Link>

              <Link
                href="/planos"
                className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold text-[#0b1533] hover:bg-black/5"
              >
                Ver planos
              </Link>
            </div>
          </div>

          {/* KPIS */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              value="20,2 mi"
              label="Mercado potencial"
              note="Pagadores de pensão no Brasil, mostrando um universo amplo para expansão."
            />
            <MetricCard
              value="R$ 12,9 bi"
              label="Tamanho estimado"
              note="Volume de gastos associado ao segmento de pensão e rotina familiar."
            />
            <MetricCard
              value="78,4%"
              label="Aceitação da proposta"
              note="Percentual de concordância na pesquisa com a ideia de receber pelo cartão."
            />
            <MetricCard
              value="94,1%"
              label="Valor percebido"
              note="Percentual que reconhece valor no detalhamento dos gastos para a criança."
            />
          </div>
        </div>
      </section>

      {/* GRÁFICOS */}
      <section className="px-6 py-20">
        <div className="container-page grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <BarChartCard />

          <div className="grid gap-6">
            <DonutCard
              title="Pesquisa com usuários"
              percent="78,4%"
              subtitle="Concordam com a proposta de recebimento da pensão por meio do cartão KidsCard."
              colorClass="bg-gradient-to-br from-[#5b2cff]/20 to-[#8d6bff]/20"
            />

            <DonutCard
              title="Percepção de valor"
              percent="94,1%"
              subtitle="Acreditam que o detalhamento dos produtos comprados ajuda no melhor aproveitamento do recurso."
              colorClass="bg-gradient-to-br from-[#ff4f8b]/20 to-[#ff8fb6]/20"
            />
          </div>
        </div>
      </section>

      {/* TESE */}
      <section className="bg-black/[0.02] px-6 py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Problema</div>
            <h3 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Falta de visibilidade
            </h3>
            <p className="mt-4 leading-7 text-black/70">
              Hoje, a rotina da pensão alimentícia costuma ter pouca
              transparência, baixa organização e dificuldade de acompanhamento
              do uso do recurso.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Solução</div>
            <h3 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Conta + extrato + recorrência
            </h3>
            <p className="mt-4 leading-7 text-black/70">
              A KidsCard conecta conta digital, cartões, extrato detalhado e
              estrutura recorrente de planos em uma experiência mais clara para
              a família.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Diferencial
            </div>
            <h3 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Categoria própria
            </h3>
            <p className="mt-4 leading-7 text-black/70">
              A proposta não compete só por preço. Ela cria uma camada de
              transparência e gestão que aumenta percepção de valor e fortalece
              retenção.
            </p>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="px-6 py-20">
        <div className="container-page grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl bg-[#0b1533] px-8 py-10 text-white soft-shadow">
            <div className="text-sm font-semibold text-white/60">
              Por que isso importa
            </div>
            <h2 className="mt-2 text-3xl font-bold">
              Um produto com apelo financeiro, emocional e jurídico
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-white/75">
              A KidsCard não é apenas uma conta digital. Ela se posiciona como
              ferramenta de organização familiar, visibilidade do uso do
              recurso, apoio à rotina da criança e monetização recorrente com
              benefícios escaláveis.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white px-8 py-10 soft-shadow">
            <div className="text-sm font-semibold text-black/60">
              Receita
            </div>
            <h3 className="mt-2 text-3xl font-bold text-[#0b1533]">
              Modelo recorrente
            </h3>
            <ul className="mt-5 space-y-3 text-black/70">
              <li>• Conta digital como base de relacionamento</li>
              <li>• Planos progressivos com benefícios escaláveis</li>
              <li>• Receita mensal previsível</li>
              <li>• Expansão por serviços e parcerias</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="container-page text-center">
          <h2 className="text-4xl font-bold">
            Vamos conversar sobre a oportunidade?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-white/70">
            A KidsCard reúne mercado potencial, proposta diferenciada e um
            modelo que pode crescer com receita recorrente e percepção clara de
            valor.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contato"
              className="rounded-full bg-white px-8 py-3 font-semibold text-black hover:opacity-90"
            >
              Falar com a KidsCard
            </Link>

            <Link
              href="/sobre"
              className="rounded-full border border-white/20 bg-black px-8 py-3 font-semibold hover:bg-white/10"
            >
              Conhecer a empresa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}