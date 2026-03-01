import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import HoverCard from "../components/HoverCard";
import InvestorSection from "../components/InvestorSection";

export default function Home() {
  return (
    <main>
      {/* HERO PRINCIPAL */}
      <section className="px-6 pt-12 pb-16">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                Conta Digital • Pensão e Mesada
              </span>

              <h1 className="h1 mt-5">
                Transparência e cuidado com o dinheiro que é da criança.
              </h1>

              <p className="text-black/70 text-lg mt-5 max-w-xl">
                A Kids Card é uma <b>conta digital</b> para receber pensão alimentícia
                e organizar a mesada. O que muda são os <b>planos de benefícios</b> e
                o acesso ao <b>extrato detalhado por item</b> (conforme plano).
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/planos"
                  className="rounded-full bg-[#5b2cff] text-white px-8 py-3 font-semibold hover:opacity-90"
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
            <div className="rounded-3xl overflow-hidden border border-black/10 soft-shadow">
              <Image
                src="/familia-hero.jpg"
                alt="Família utilizando conta digital Kids Card"
                width={1200}
                height={900}
                className="w-full h-[380px] object-cover"
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
              <p className="text-black/70 mt-4 max-w-3xl mx-auto text-lg">
                Os cartões são vinculados à conta digital. Os planos definem benefícios e
                liberam o extrato detalhado por item (plano elegível).
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            <FadeIn delay={0.05}>
              <HoverCard className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
                <div className="text-sm font-semibold text-black/60">Cartão Pensão</div>
                <div className="text-2xl font-bold mt-1">Transparência e visibilidade</div>
                <p className="text-black/70 mt-3">
                  Ideal para acompanhar o uso do recurso. No plano elegível, acesso ao{" "}
                  <b>extrato detalhado por item</b>.
                </p>

                <div className="mt-6 flex justify-center">
                  <Image
                    src="/cardpensao.png"
                    alt="Cartão Kids Card Pensão"
                    width={520}
                    height={320}
                    className="w-full max-w-[520px] h-auto rounded-2xl border border-black/10"
                  />
                </div>

                <ul className="mt-6 space-y-2 text-black/80">
                  <li>• Extrato por estabelecimento</li>
                  <li>• Extrato detalhado por item (plano elegível)</li>
                  <li>• Organização por categorias</li>
                </ul>
              </HoverCard>
            </FadeIn>

            <FadeIn delay={0.10}>
              <HoverCard className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
                <div className="text-sm font-semibold text-black/60">Cartão Mesada</div>
                <div className="text-2xl font-bold mt-1">Educação financeira</div>
                <p className="text-black/70 mt-3">
                  Perfeito para jovens e adolescentes: autonomia com acompanhamento.
                  Benefícios variam conforme o plano.
                </p>

                <div className="mt-6 flex justify-center">
                  <Image
                    src="/cardmesada.png"
                    alt="Cartão Kids Card Mesada"
                    width={520}
                    height={320}
                    className="w-full max-w-[520px] h-auto rounded-2xl border border-black/10"
                  />
                </div>

                <ul className="mt-6 space-y-2 text-black/80">
                  <li>• Histórico e controle</li>
                  <li>• Organização por categorias</li>
                  <li>• Benefícios do plano</li>
                </ul>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SEÇÃO EMOCIONAL */}
      <section className="px-6 py-20 bg-black/[0.02] border-y border-black/10">
        <div className="container-page grid md:grid-cols-2 gap-10 items-center">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden border border-black/10 soft-shadow">
              <Image
                src="/familia-mae-filho.jpg"
                alt="Mãe e filho utilizando Kids Card"
                width={900}
                height={700}
                className="w-full h-[350px] object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div>
              <h2 className="h2">Para mães e filhos</h2>
              <p className="text-black/70 mt-4 text-lg">
                Uma solução pensada para facilitar o dia a dia e trazer mais clareza
                sobre os recursos e o cuidado com a criança.
              </p>
              <ul className="mt-6 space-y-3 text-black/80">
                <li>• Conta digital completa</li>
                <li>• Organização por categorias</li>
                <li>• Extrato detalhado por item (plano elegível)</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="container-page grid md:grid-cols-2 gap-10 items-center">
          <FadeIn>
            <div>
              <h2 className="h2">Para pais e filhos</h2>
              <p className="text-black/70 mt-4 text-lg">
                Controle, acompanhamento e mais segurança na gestão da pensão e da mesada.
              </p>
              <ul className="mt-6 space-y-3 text-black/80">
                <li>• Visibilidade dos gastos</li>
                <li>• Segurança e controle</li>
                <li>• Planos com benefícios exclusivos</li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="rounded-3xl overflow-hidden border border-black/10 soft-shadow">
              <Image
                src="/familia-pai-filho.jpg"
                alt="Pai e filho organizando finanças"
                width={900}
                height={700}
                className="w-full h-[350px] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

<InvestorSection />

      {/* CTA FINAL */}
      <section className="px-6 py-20 bg-black text-white">
        <div className="container-page text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold">
              Escolha o plano ideal para sua família
            </h2>

            <p className="text-white/70 mt-4 max-w-3xl mx-auto">
              Conta digital focada em pensão e mesada, com planos mensais que oferecem
              benefícios e acesso ao extrato detalhado.
            </p>

            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                href="/planos"
                className="rounded-full bg-white text-black px-8 py-3 font-semibold hover:opacity-90"
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