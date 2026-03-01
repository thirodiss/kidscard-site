import Image from "next/image";
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        <div className="text-center">
          <h1 className="h1">Sobre a Kids Card</h1>
          <p className="text-black/70 mt-4 text-lg max-w-3xl mx-auto">
            A Kids Card é uma conta digital focada em pensão alimentícia e mesada,
            com o objetivo de trazer mais visibilidade, organização e segurança
            para famílias.
          </p>
        </div>

        <section className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <div className="card soft-shadow p-10">
            <h2 className="h2">Missão</h2>
            <p className="text-black/70 mt-4">
              Contribuir para o conforto das famílias através de soluções modernas e
              tecnologia adequada, melhorando a qualidade de vida.
            </p>

            <h2 className="h2 mt-10">Visão</h2>
            <p className="text-black/70 mt-4">
              Perpetuar valores e legado às futuras gerações, sendo a companhia que
              melhor entende e satisfaz as necessidades das famílias.
            </p>

            <h2 className="h2 mt-10">Valores</h2>
            <ul className="text-black/70 mt-4 space-y-2">
              <li>• Ética</li>
              <li>• Amor</li>
              <li>• Integridade</li>
              <li>• Respeito</li>
              <li>• Harmonia familiar</li>
              <li>• Responsabilidade social</li>
            </ul>
          </div>

          <div className="rounded-3xl overflow-hidden border border-black/10 soft-shadow">
            <Image
              src="/familia-hero.jpg"
              alt="Família"
              width={1200}
              height={900}
              className="w-full h-[420px] object-cover"
              priority
            />
          </div>
        </section>

        <section className="mt-10 card soft-shadow p-10">
          <h2 className="h2">O que entregamos</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {[
              ["Conta digital", "Pensão e Mesada na mesma experiência."],
              ["Extrato detalhado", "Por item (conforme plano e cobertura)."],
              ["Benefícios", "Módulos e serviços agregados conforme plano."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="font-bold">{t}</div>
                <div className="text-black/70 mt-2">{d}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link href="/produtos" className="btn-primary">
              Ver produtos
            </Link>
            <Link href="/planos" className="btn-outline">
              Ver planos
            </Link>
            <Link href="/contato" className="btn-outline">
              Contato
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}