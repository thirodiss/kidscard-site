import Link from "next/link";

function Block({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
      <div className="text-sm font-semibold text-black/60">{title}</div>
      <div className="text-black/75 mt-3 text-lg">{desc}</div>
    </div>
  );
}

export default function InvestidoresPage() {
  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        <div className="text-center">
          <h1 className="h1">Kids Card para investidores</h1>
          <p className="text-black/70 mt-5 text-lg max-w-3xl mx-auto">
            Uma fintech com foco em pensão alimentícia e mesada, trazendo visibilidade e
            organização via conta digital e extrato detalhado por item (conforme plano).
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="/contato"
              className="rounded-full bg-black text-white px-8 py-3 font-semibold hover:opacity-90"
            >
              Falar sobre parceria
            </Link>
            <Link
              href="/planos"
              className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold hover:bg-black/5"
            >
              Ver planos (módulos)
            </Link>
          </div>
        </div>

        <section className="mt-14 grid lg:grid-cols-2 gap-6">
          <Block
            title="O problema"
            desc="Falta de obrigação legal de prestação de contas detalhada torna a fiscalização difícil, lenta e burocrática, gerando conflito e insegurança."
          />
          <Block
            title="A solução"
            desc="Conta digital para Pensão e Mesada com extrato padrão e, no plano elegível, extrato detalhado por item (produto, quantidade e valor)."
          />
          <Block
            title="Diferencial"
            desc="Extrato detalhado por item como proposta central — experiência simples no app, com organização por categorias e visibilidade prática."
          />
          <Block
            title="Modelo de receita"
            desc="Mensalidade da conta digital + módulos/benefícios (assessorias, seguro, benefícios premium) com potencial de recorrência."
          />
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-10">
          <h2 className="h2">Teses de crescimento</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Block
              title="Aquisição"
              desc="Parcerias com advocacias, influenciadores de família e canais de relacionamento."
            />
            <Block
              title="Retenção"
              desc="Uso recorrente via extrato, categorias e benefícios por plano. Evolução com educação financeira."
            />
            <Block
              title="Expansão"
              desc="Parcerias por segmentos (alimentação, saúde, educação) e upgrades para módulos premium."
            />
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
              href="/patente"
              className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5"
            >
              Ver patente
            </Link>
            <Link
              href="/produtos"
              className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5"
            >
              Ver produtos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}