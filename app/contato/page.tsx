import Link from "next/link";

const WHATSAPP_NUMBER = "5511959819146"; // ajuste se quiser
const WHATSAPP_TEXT = encodeURIComponent(
  "Olá! Quero falar com a Kids Card sobre planos e benefícios."
);

export default function ContatoPage() {
  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        <div className="text-center">
          <h1 className="h1">Contato</h1>
          <p className="text-black/70 mt-4 text-lg max-w-2xl mx-auto">
            Fale com a Kids Card para tirar dúvidas sobre conta digital, planos e
            extrato detalhado (conforme plano).
          </p>
        </div>

        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="card soft-shadow p-8">
            <div className="text-sm font-semibold text-black/60">WhatsApp</div>
            <div className="text-2xl font-bold mt-2">Atendimento rápido</div>
            <p className="text-black/70 mt-3">
              Clique abaixo e já mande mensagem com seu pedido.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Falar no WhatsApp
              </a>

              <Link href="/planos" className="btn-outline">
                Ver planos
              </Link>
            </div>
          </div>

          <div className="card soft-shadow p-8">
            <div className="text-sm font-semibold text-black/60">E-mail</div>
            <div className="text-2xl font-bold mt-2">Prefere mensagem?</div>
            <p className="text-black/70 mt-3">
              Envie um e-mail com seu nome e a dúvida principal.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-black/80">
              <a className="underline" href="mailto:thiago.rodrigues@kidscard.com.br">
                thiago.rodrigues@kidscard.com.br
              </a>
              <a className="underline" href="mailto:thiago.awb@gmail.com">
                thiago.awb@gmail.com
              </a>
            </div>

            <div className="mt-6">
              <Link href="/produtos" className="btn-outline">
                Ver produtos e benefícios
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 card soft-shadow p-10">
          <h2 className="h2">Antes de falar com a gente</h2>
          <p className="text-black/70 mt-4 max-w-3xl">
            Se você quiser o diferencial do produto, peça pelo <b>Extrato detalhado por item</b>.
            E se precisar de suporte adicional, explique quais módulos você quer (jurídico,
            psicológico, seguro, etc.).
          </p>
        </section>
      </div>
    </main>
  );
}