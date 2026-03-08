import Image from "next/image";
import Link from "next/link";
import FadeIn from "../../components/FadeIn";
import HoverCard from "../../components/HoverCard";
import InvestorSection from "../../components/InvestorSection";

export default function Home() {
  return (
    <main>
      {/* HERO PRINCIPAL */}
      <section className="px-6 pt-12 pb-16">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div>
              <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                Conta Digital • Pensão e Mesada
              </span>

              <h1 className="h1 mt-5">
                Transparência e cuidado com o dinheiro que é da criança.
              </h1>

              <p className="mt-5 max-w-xl text-lg text-black/70">
                A KidsCard é uma <b>conta digital</b> para organizar pensão
                alimentícia e mesada com mais transparência, controle e
                segurança. Os planos liberam benefícios progressivos e recursos
                diferentes conforme a opção escolhida.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/planos"
                  className="rounded-full bg-[#5b2cff] px-8 py-3 font-semibold text-white hover:opacity-90"
                >
                  Conhecer planos
                </Link>

                <Link
                  href="/produtos"
                  className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold hover:bg-black/5"
                >
                  Ver produtos
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="overflow-hidden rounded-3xl border border-black/10 soft-shadow">
              <Image
                src="/familia-hero.jpg"
                alt="Família utilizando conta digital KidsCard"
                width={1200}
                height={900}
                className="h-[380px] w-full object-cover"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CARTÕES LADO A LADO */}
      <section className="px-6 pb-18">
        <div className="container-page">
          <FadeIn>
            <div className="text-center">
              <h2 className="h2">Dois cartões. Mesma conta digital.</h2>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-black/70">
                Os cartões são vinculados à conta digital. Os planos liberam
                benefícios progressivos e recursos diferentes para cada perfil
                de família.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <HoverCard className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
                <div className="text-sm font-semibold text-black/60">
                  Cartão Pensão
                </div>
                <div className="mt-1 text-2xl font-bold">
                  Transparência e visibilidade
                </div>
                <p className="mt-3 text-black/70">
                  Ideal para acompanhar o uso do recurso com mais clareza,
                  organização e segurança para os responsáveis.
                </p>

                <div className="mt-6 flex justify-center">
                  <Image
                    src="/cardpensao.png"
                    alt="Cartão KidsCard Pensão"
                    width={520}
                    height={320}
                    className="h-auto w-full max-w-[520px] rounded-2xl border border-black/10"
                  />
                </div>

                <ul className="mt-6 space-y-2 text-black/80">
                  <li>• Extrato por estabelecimento</li>
                  <li>• Mais transparência no acompanhamento</li>
                  <li>• Organização por categorias</li>
                </ul>
              </HoverCard>
            </FadeIn>

            <FadeIn delay={0.1}>
              <HoverCard className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
                <div className="text-sm font-semibold text-black/60">
                  Cartão Mesada
                </div>
                <div className="mt-1 text-2xl font-bold">
                  Educação financeira
                </div>
                <p className="mt-3 text-black/70">
                  Perfeito para jovens e adolescentes: autonomia com
                  acompanhamento e mais consciência na rotina financeira.
                </p>

                <div className="mt-6 flex justify-center">
                  <Image
                    src="/cardmesada.png"
                    alt="Cartão KidsCard Mesada"
                    width={520}
                    height={320}
                    className="h-auto w-full max-w-[520px] rounded-2xl border border-black/10"
                  />
                </div>

                <ul className="mt-6 space-y-2 text-black/80">
                  <li>• Histórico e controle</li>
                  <li>• Organização por categorias</li>
                  <li>• Benefícios do plano escolhido</li>
                </ul>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* O QUE ENTREGAMOS */}
      <section className="px-6 pb-20">
        <div className="container-page">
          <FadeIn>
            <div className="rounded-[32px] border border-black/10 bg-white px-6 py-10 md:px-10 md:py-14 soft-shadow">
              <div className="max-w-3xl">
                <div className="text-sm font-semibold text-[#5b2cff]">
                  KidsCard
                </div>
                <h2 className="mt-3 text-4xl font-bold tracking-tight text-black">
                  Tudo o que a KidsCard oferece para sua família
                </h2>
                <p className="mt-4 text-lg leading-8 text-black/70">
                  Uma plataforma pensada para organizar pensão, mesada, controle
                  financeiro e benefícios em uma experiência mais simples,
                  moderna e segura.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-6">
                  <h3 className="text-xl font-bold">Conta digital</h3>
                  <p className="mt-3 leading-7 text-black/70">
                    Pensão e mesada em uma experiência centralizada, com mais
                    organização, previsibilidade e praticidade para a rotina da
                    família.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-6">
                  <h3 className="text-xl font-bold">Extrato detalhado</h3>
                  <p className="mt-3 leading-7 text-black/70">
                    Mais clareza sobre movimentações e uso dos recursos,
                    conforme o plano contratado e a cobertura disponível.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-6">
                  <h3 className="text-xl font-bold">Planos progressivos</h3>
                  <p className="mt-3 leading-7 text-black/70">
                    Os benefícios evoluem conforme o plano escolhido,
                    permitindo mais recursos, suporte e acompanhamento para
                    cada perfil de família.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fafafa] p-6">
                  <h3 className="text-xl font-bold">Mais controle</h3>
                  <p className="mt-3 leading-7 text-black/70">
                    A família acompanha melhor a rotina financeira e toma
                    decisões com mais confiança, segurança e transparência.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-3xl bg-black px-8 py-8 text-white">
                  <div className="text-sm font-semibold text-white/60">
                    Diferencial KidsCard
                  </div>
                  <h3 className="mt-2 text-2xl font-bold">
                    Mais do que uma conta digital
                  </h3>
                  <p className="mt-4 max-w-2xl leading-7 text-white/75">
                    A KidsCard reúne organização financeira, acompanhamento
                    familiar e benefícios que tornam a experiência mais
                    completa para responsáveis e dependentes.
                  </p>
                </div>

                <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-[#5b2cff]/10 to-[#7c4dff]/5 px-8 py-8">
                  <div className="text-sm font-semibold text-black/60">
                    Planos
                  </div>
                  <h3 className="mt-2 text-2xl font-bold">
                    Escolha o nível ideal para sua família
                  </h3>
                  <p className="mt-4 leading-7 text-black/70">
                    Do plano essencial ao mais completo, a KidsCard acompanha
                    diferentes momentos com benefícios progressivos e
                    contratação mais simples.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/produtos"
                  className="rounded-full bg-[#5b2cff] px-7 py-3 font-semibold text-white hover:opacity-90"
                >
                  Ver produtos
                </Link>
                <Link
                  href="/planos"
                  className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5"
                >
                  Ver planos
                </Link>
                <Link
                  href="/contato"
                  className="rounded-full border border-black/15 bg-white px-7 py-3 font-semibold hover:bg-black/5"
                >
                  Contato
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EXTRATO DETALHADO - FLUXO VISUAL */}
      <section className="border-y border-black/10 bg-black/[0.02] px-6 py-20">
        <div className="container-page">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-sm font-semibold text-[#5b2cff]">
                Extrato detalhado
              </div>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Veja exatamente como o extrato funciona no app
              </h2>

              <p className="mt-4 text-lg text-black/70">
                Da visualização padrão até o detalhamento completo da compra,
                a KidsCard entrega mais clareza para quem acompanha o uso do
                recurso no dia a dia.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mt-14 rounded-[32px] border border-black/10 bg-white p-4 md:p-8 soft-shadow">
              <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f7f5ff] to-[#fff] p-4 md:p-8">
                <Image
                  src="/extrato-fluxo.png"
                  alt="Fluxo do extrato no app KidsCard mostrando extrato padrão, clique para detalhar e extrato detalhado"
                  width={1600}
                  height={900}
                  className="h-auto w-full rounded-2xl"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
                <div className="text-sm font-semibold text-[#5b2cff]">
                  01. Extrato padrão
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  Visualização inicial clara
                </h3>
                <p className="mt-3 leading-7 text-black/70">
                  A família acompanha compras por data, estabelecimento e valor,
                  de forma organizada e fácil de entender.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
                <div className="text-sm font-semibold text-[#5b2cff]">
                  02. Ação simples
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  Toque para ver os detalhes
                </h3>
                <p className="mt-3 leading-7 text-black/70">
                  Com poucos cliques, o responsável acessa uma visão mais
                  profunda da compra diretamente no app.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
                <div className="text-sm font-semibold text-[#5b2cff]">
                  03. Extrato detalhado
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  Mais transparência por item
                </h3>
                <p className="mt-3 leading-7 text-black/70">
                  Quando disponível conforme o plano, é possível visualizar os
                  itens da compra com muito mais clareza e confiança.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
                <div className="text-sm font-semibold text-white/60">
                  Diferencial KidsCard
                </div>
                <h3 className="mt-2 text-2xl font-bold">
                  Menos dúvida. Mais transparência.
                </h3>
                <p className="mt-4 max-w-2xl leading-7 text-white/75">
                  O fluxo visual do extrato ajuda responsáveis a entenderem
                  rapidamente o que foi comprado, como foi comprado e qual foi
                  o valor total da operação.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white px-8 py-8 soft-shadow">
                <div className="text-sm font-semibold text-black/60">
                  Observação
                </div>
                <h3 className="mt-2 text-2xl font-bold">
                  Recurso conforme plano
                </h3>
                <p className="mt-4 leading-7 text-black/70">
                  O extrato detalhado pode variar conforme o plano contratado e
                  a disponibilidade de integração com parceiros.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SEÇÃO EMOCIONAL */}
      <section className="px-6 py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl border border-black/10 soft-shadow">
              <Image
                src="/familia-mae-filho.jpg"
                alt="Mãe e filho utilizando KidsCard"
                width={900}
                height={700}
                className="h-[350px] w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div>
              <h2 className="h2">Para mães e filhos</h2>
              <p className="mt-4 text-lg text-black/70">
                Uma solução pensada para facilitar o dia a dia e trazer mais
                clareza sobre os recursos e o cuidado com a criança.
              </p>
              <ul className="mt-6 space-y-3 text-black/80">
                <li>• Conta digital completa</li>
                <li>• Organização por categorias</li>
                <li>• Recursos conforme o plano escolhido</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-black/[0.02] px-6 py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div>
              <h2 className="h2">Para pais e filhos</h2>
              <p className="mt-4 text-lg text-black/70">
                Controle, acompanhamento e mais segurança na gestão da pensão e
                da mesada.
              </p>
              <ul className="mt-6 space-y-3 text-black/80">
                <li>• Visibilidade dos gastos</li>
                <li>• Segurança e controle</li>
                <li>• Planos com benefícios exclusivos</li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="overflow-hidden rounded-3xl border border-black/10 soft-shadow">
              <Image
                src="/familia-pai-filho.jpg"
                alt="Pai e filho organizando finanças"
                width={900}
                height={700}
                className="h-[350px] w-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <InvestorSection />

      {/* CTA FINAL */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="container-page text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold md:text-4xl">
              Escolha o plano ideal para sua família
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-white/70">
              Conta digital focada em pensão e mesada, com planos mensais que
              oferecem benefícios e acesso a recursos conforme a opção
              escolhida.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/planos"
                className="rounded-full bg-white px-8 py-3 font-semibold text-black hover:opacity-90"
              >
                Ver planos
              </Link>
              <Link
                href="/produtos"
                className="rounded-full border border-white/20 bg-black px-8 py-3 font-semibold hover:bg-white/10"
              >
                Ver produtos
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}