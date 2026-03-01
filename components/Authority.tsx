import Link from "next/link";

export default function Authority() {
  return (
    <section className="px-6 py-24 bg-[#060914]">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Autoridade e oportunidade</h2>
          <p className="text-white/70 mt-4 max-w-3xl mx-auto">
            Transparência na pensão alimentícia, educação financeira na mesada e
            um diferencial que não tem precedente.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-3xl p-8 shadow-soft">
            <div className="text-sm text-white/60">Patente / Busca</div>
            <div className="mt-2 text-2xl font-bold">BR 10 2018 011970 2</div>
            <p className="mt-3 text-white/70">
              Consulte no INPI usando o código acima e veja o registro do
              conceito.
            </p>
            <div className="mt-6">
              <Link
                href="/patente"
                className="inline-flex rounded-full border border-white/15 px-5 py-2.5 font-semibold hover:bg-white/10 transition"
              >
                Ver página da patente
              </Link>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 shadow-soft">
            <div className="text-sm text-white/60">Pesquisa (amostra)</div>
            <div className="mt-2 text-2xl font-bold">1.911 pessoas</div>
            <p className="mt-3 text-white/70">
              Alta aceitação do modelo de recebimento por cartão e do extrato
              detalhado.
            </p>
            <div className="mt-6 text-xs text-white/55">
              * Dados do material institucional.
            </div>
          </div>

          <div className="glass rounded-3xl p-8 shadow-soft">
            <div className="text-sm text-white/60">Visão do produto</div>
            <div className="mt-2 text-2xl font-bold">Extrato por item</div>
            <p className="mt-3 text-white/70">
              Estabelecimento, produto, quantidade e valor — em poucos cliques
              no app.
            </p>
            <div className="mt-6">
              <Link
                href="/planos"
                className="inline-flex rounded-full bg-white text-black px-5 py-2.5 font-semibold hover:scale-105 transition"
              >
                Ver planos
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-4 gap-4 text-center">
          {[
            ["+ Segurança", "Bloqueio rápido e controle"],
            ["+ Controle", "Categorias e limites"],
            ["+ Transparência", "Extrato detalhado (plano)"],
            ["+ Benefícios", "Cashback e clube (plano)"],
          ].map(([title, sub]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-bold">{title}</div>
              <div className="text-sm text-white/65 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}