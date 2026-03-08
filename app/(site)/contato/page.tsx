import Link from "next/link";

export default function ContatoPage() {
  return (
    <main>
      {/* HERO */}
      <section className="px-6 pt-16 pb-14 bg-[#f5f7fb]">
        <div className="container-page text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
            KidsCard • Contato
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#0b1533] md:text-6xl">
            Vamos conversar
          </h1>

          <p className="mt-6 text-xl leading-9 text-black/70">
            Seja para conhecer os planos da KidsCard ou para conversar sobre
            oportunidades de parceria e investimento, nossa equipe está pronta
            para falar com você.
          </p>
        </div>
      </section>

      {/* OPÇÕES DE CONTATO */}
      <section className="px-6 py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">

          {/* CLIENTES */}
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Para clientes
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Conhecer a KidsCard
            </h2>

            <p className="mt-4 leading-7 text-black/70">
              Saiba mais sobre a conta digital KidsCard, os planos disponíveis
              e como organizar pensão e mesada com mais transparência.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/planos"
                className="rounded-full bg-[#5b2cff] px-6 py-3 font-semibold text-white text-center hover:opacity-90"
              >
                Ver planos
              </Link>

              <Link
                href="/produtos"
                className="rounded-full border border-black/15 px-6 py-3 font-semibold text-center hover:bg-black/5"
              >
                Ver produtos
              </Link>
            </div>
          </div>

          {/* INVESTIDORES */}
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Para investidores
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Solicitar apresentação
            </h2>

            <p className="mt-4 leading-7 text-black/70">
              Se você deseja conhecer melhor o projeto KidsCard, nosso mercado,
              modelo de receita e estratégia de crescimento, podemos apresentar
              a proposta completa.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:investidores@kidscard.com.br"
                className="rounded-full bg-black px-6 py-3 font-semibold text-white text-center hover:opacity-90"
              >
                Enviar e-mail
              </a>

              <Link
                href="/investidores"
                className="rounded-full border border-black/15 px-6 py-3 font-semibold text-center hover:bg-black/5"
              >
                Ver página de investidores
              </Link>
            </div>
          </div>

          {/* CONTATO GERAL */}
          <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Contato geral
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#0b1533]">
              Fale com nossa equipe
            </h2>

            <p className="mt-4 leading-7 text-black/70">
              Para dúvidas, parcerias ou qualquer outra informação sobre a
              KidsCard, entre em contato diretamente com nossa equipe.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-black/80">
              <a
                href="mailto:contato@kidscard.com.br"
                className="rounded-full border border-black/15 px-6 py-3 font-semibold text-center hover:bg-black/5"
              >
                contato@kidscard.com.br
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-20 bg-black text-white">
        <div className="container-page text-center">

          <h2 className="text-4xl font-bold">
            Quer conhecer a KidsCard mais de perto?
          </h2>

          <p className="mt-4 text-white/70 max-w-3xl mx-auto">
            Entre em contato e nossa equipe irá apresentar a proposta,
            explicar o produto e conversar sobre oportunidades de parceria
            ou investimento.
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="/investidores"
              className="rounded-full bg-white text-black px-8 py-3 font-semibold hover:opacity-90"
            >
              Ver página de investidores
            </Link>

            <Link
              href="/planos"
              className="rounded-full border border-white/20 bg-black px-8 py-3 font-semibold hover:bg-white/10"
            >
              Conhecer planos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}