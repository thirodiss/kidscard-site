import Link from "next/link";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 soft-shadow">
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="text-black/70 mt-2">{label}</div>
    </div>
  );
}

export default function InvestorSection() {
  return (
    <section className="px-6 py-20 bg-black/[0.02] border-y border-black/10">
      <div className="container-page">
        <div className="text-center">
          <h2 className="h2">Para investidores e parcerias</h2>
          <p className="text-black/70 mt-4 max-w-3xl mx-auto text-lg">
            A Kids Card nasce para resolver um problema real: falta de visibilidade e
            prestação de contas na pensão, com uma solução prática via conta digital
            e extrato detalhado (conforme plano).
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-4 gap-5">
          <Stat value="1911" label="Pesquisa (amostra) com alta aceitação" />
          <Stat value="INPI" label="Conceito com busca por patente" />
          <Stat value="2 cartões" label="Pensão + Mesada na mesma conta" />
          <Stat value="Módulos" label="Receita mensal por benefícios" />
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-black/60">Problema</div>
            <div className="text-xl font-bold mt-2">Pensão sem transparência</div>
            <p className="text-black/70 mt-3">
              Fiscalizar gastos pode virar algo lento e burocrático. Muitas famílias
              não têm clareza prática do que foi comprado com o recurso da criança.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-black/60">Solução</div>
            <div className="text-xl font-bold mt-2">
              Conta digital + extrato detalhado
            </div>
            <p className="text-black/70 mt-3">
              Extrato por estabelecimento e, no plano elegível, detalhamento por item:
              produto, quantidade e valor, em poucos cliques no app.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-black/60">Modelo</div>
            <div className="text-xl font-bold mt-2">
              Mensalidade + módulos de benefícios
            </div>
            <p className="text-black/70 mt-3">
              Receita recorrente com mensalidade da conta e módulos (jurídico,
              psicológico, seguro, intercâmbio etc.).
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-10 soft-shadow">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-sm font-semibold text-black/60">Diferencial</div>
              <div className="text-2xl font-bold mt-2">
                Extrato detalhado por item (por produto)
              </div>
              <p className="text-black/70 mt-3">
                A proposta é gerar visibilidade, reduzir conflitos e apoiar famílias
                com informação prática e organizada.
              </p>

              <div className="mt-6 flex gap-3 flex-wrap">
                <Link
                  href="/investidores"
                  className="rounded-full bg-black text-white px-7 py-3 font-semibold hover:opacity-90"
                >
                  Ver página investidor
                </Link>

                <Link
                  href="/patente"
                  className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5"
                >
                  Ver patente
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <div className="font-bold">Próximos passos sugeridos</div>
              <ul className="mt-4 space-y-2 text-black/75">
                <li>• MVP do app: extrato padrão + detalhado</li>
                <li>• Parcerias por segmentos (saúde, educação, alimentação)</li>
                <li>• Pilotos regionais + aquisição por parceiros</li>
                <li>• Evolução com métricas de uso e retenção</li>
              </ul>
              <div className="mt-4 text-xs text-black/55">
                * Texto institucional (ajustável depois).
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}