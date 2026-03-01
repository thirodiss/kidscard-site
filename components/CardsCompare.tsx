import Image from "next/image";
import Link from "next/link";

export default function CardsCompare() {
  return (
    <section className="bg-[#0b1224] py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">Dois cartões. Um ecossistema.</h2>
          <p className="text-white/80 mt-4 max-w-3xl mx-auto">
            O Kids Card resolve duas dores reais: transparência na pensão e
            educação financeira na mesada. Tudo com segurança e controle.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Pensão */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-purple-500/10 via-indigo-500/10 to-transparent p-8 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    Cartão Pensão
                  </span>
                  <h3 className="text-2xl font-bold mt-4">
                    Transparência + Segurança
                  </h3>
                  <p className="text-white/80 mt-3">
                    Útil para o responsável pela guarda da criança. Dependendo
                    do plano, você tem acesso ao <b>extrato detalhado por item</b>{" "}
                    de cada compra.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Image
                  src="/cardpensao.png"
                  alt="Cartão Kids Card Pensão"
                  width={520}
                  height={320}
                  className="rounded-2xl shadow-2xl hover:scale-[1.03] transition duration-300"
                  priority
                />
              </div>

              <ul className="mt-8 space-y-3 text-white/85">
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-purple-400" />
                  Extrato detalhado por produto (plano elegível)
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-purple-400" />
                  Bloqueio rápido em caso de perda/roubo
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-purple-400" />
                  Controle por categorias: alimentação, saúde, educação e mais
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-purple-400" />
                  Visibilidade para decisões e comprovação
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/planos"
                  className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 font-semibold hover:scale-105 transition"
                >
                  Ver planos
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Falar com a Kids Card
                </Link>
              </div>
            </div>
          </div>

          {/* Card Mesada */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-yellow-500/10 via-amber-500/10 to-transparent p-8 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-yellow-500/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />

            <div className="relative">
              <div>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  Cartão Mesada
                </span>
                <h3 className="text-2xl font-bold mt-4">
                  Autonomia + Educação Financeira
                </h3>
                <p className="text-white/80 mt-3">
                  Útil para pais e jovens. Um cartão pré-pago para organizar a
                  mesada, incentivar responsabilidade e controlar limites.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <Image
                  src="/cardmesada.png"
                  alt="Cartão Kids Card Mesada"
                  width={520}
                  height={320}
                  className="rounded-2xl shadow-2xl hover:scale-[1.03] transition duration-300"
                />
              </div>

              <ul className="mt-8 space-y-3 text-white/85">
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-yellow-400" />
                  Recargas e transferências quando quiser
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-yellow-400" />
                  Limites e controle por app
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-yellow-400" />
                  Incentivo ao uso consciente do dinheiro
                </li>
                <li className="flex gap-3">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-yellow-400" />
                  Cashback e benefícios (conforme plano)
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/planos"
                  className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 font-semibold hover:scale-105 transition"
                >
                  Ver planos
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Tirar dúvidas
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="mt-10 text-center text-sm text-white/60">
          * Extrato detalhado por item disponível conforme plano e cobertura de
          parceiros/segmentos.
        </div>
      </div>
    </section>
  );
}