import Image from "next/image";
import Link from "next/link";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
      {children}
    </span>
  );
}

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 soft-shadow">
      <div className="font-bold">{title}</div>
      <div className="text-black/70 mt-2">{desc}</div>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        {/* HERO */}
        <div className="text-center">
          <Pill>Produtos Kids Card</Pill>

          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            Tudo em uma conta digital.
          </h1>

          <p className="text-black/70 text-lg mt-4 max-w-3xl mx-auto">
            A Kids Card é uma <b>conta digital</b> focada em <b>Pensão</b> e <b>Mesada</b>.
            O que muda entre os planos são os <b>benefícios</b> e o acesso ao{" "}
            <b>extrato detalhado por item</b> (conforme plano).
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="/planos"
              className="rounded-full bg-[#5b2cff] text-white px-8 py-3 font-semibold hover:opacity-90 transition"
            >
              Ver planos
            </Link>
            <Link
              href="/contato"
              className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold hover:bg-black/5 transition"
            >
              Falar com a Kids Card
            </Link>
          </div>
        </div>

        {/* 1) CONTA */}
        <section id="conta" className="mt-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">1) Conta Digital Kids Card</h2>
            <p className="text-black/70 mt-4 text-lg">
              Uma conta digital para centralizar a gestão do dinheiro da criança,
              com acompanhamento e organização. O produto é a conta — os planos
              adicionam benefícios.
            </p>

            <ul className="mt-6 space-y-3 text-black/80">
              <li>• Conta digital para Pensão + Mesada</li>
              <li>• Histórico e organização por categorias</li>
              <li>• Segurança e controle de uso</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-black/10 soft-shadow p-6 bg-white">
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <Image
                src="/cardpensao.png"
                alt="Cartão Kids Card Pensão"
                width={520}
                height={320}
                className="w-full h-auto rounded-2xl border border-black/10"
              />
              <Image
                src="/cardmesada.png"
                alt="Cartão Kids Card Mesada"
                width={520}
                height={320}
                className="w-full h-auto rounded-2xl border border-black/10"
              />
            </div>

            <p className="text-sm text-black/60 mt-4 text-center">
              Dois cartões vinculados à mesma conta digital.
            </p>
          </div>
        </section>

        {/* 2) EXTRATO */}
        <section id="extrato" className="mt-16 rounded-3xl border border-black/10 bg-black/[0.02] p-10">
          <h2 className="text-3xl font-bold">2) Extrato Detalhado por Item</h2>

          <p className="text-black/70 mt-4 text-lg max-w-4xl">
            Além do extrato padrão (por estabelecimento), no plano elegível você
            pode visualizar o detalhamento: <b>produto</b>, <b>quantidade</b> e{" "}
            <b>valor</b> por item — de forma simples no app.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card
              title="Por produto"
              desc="Veja itens e valores individuais (conforme plano)."
            />
            <Card
              title="Mais clareza"
              desc="Entenda melhor como o recurso está sendo utilizado."
            />
            <Card
              title="Rápido e simples"
              desc="Acesso no app em poucos cliques."
            />
          </div>

          <div className="mt-8 text-sm text-black/55">
            * Disponível conforme plano e cobertura/integração com parceiros.
          </div>
        </section>

        {/* 3) BENEFÍCIOS */}
        <section id="beneficios" className="mt-16">
          <h2 className="text-3xl font-bold">3) Benefícios dos Planos</h2>
          <p className="text-black/70 mt-4 text-lg max-w-4xl">
            Os planos mensais podem incluir produtos e serviços como assessorias,
            seguro e benefícios extras. (A composição exata você define na página
            de planos.)
          </p>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Mensalidade da Conta Digital"
              desc="Acesso à conta, cartões e recursos do app."
            />
            <Card
              title="Assessoria Jurídica"
              desc="Apoio e orientação em temas relacionados."
            />
            <Card
              title="Assessoria Psicológica"
              desc="Suporte emocional e acompanhamento (plano elegível)."
            />
            <Card
              title="Assessoria Psiquiátrica"
              desc="Apoio especializado (plano elegível)."
            />
            <Card
              title="Assessoria Financeira"
              desc="Educação e organização financeira da família."
            />
            <Card
              title="Seguro Pensão / Benefícios"
              desc="Camada extra de segurança e benefícios (plano elegível)."
            />
          </div>

          <div className="mt-10 flex gap-3 flex-wrap">
            <Link
              href="/planos"
              className="rounded-full bg-black text-white px-8 py-3 font-semibold hover:opacity-90 transition"
            >
              Ver planos e preços
            </Link>
            <Link
              href="/contato"
              className="rounded-full border border-black/15 bg-white px-8 py-3 font-semibold hover:bg-black/5 transition"
            >
              Quero conversar
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}