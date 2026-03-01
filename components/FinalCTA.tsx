import Link from "next/link";

export default function FinalCTA() {
  const number = "5511959819146";
  const text = encodeURIComponent(
    "Olá! Quero falar sobre a Kids Card (planos / parceria / investimento)."
  );

  return (
    <section className="px-6 py-20">
      <div className="container-page">
        <div className="noise rounded-3xl border border-white/10 bg-linear-to-r from-indigo-600/30 via-purple-600/25 to-pink-500/25 p-10 overflow-hidden shadow-soft relative">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto pra levar transparência e controle para sua família?
            </h2>
            <p className="text-white/80 mt-4 max-w-3xl">
              Conheça os planos e veja como o Kids Card pode ajudar no dia a
              dia: pensão com visibilidade e mesada com educação financeira.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${number}?text=${text}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-7 py-3 font-semibold hover:scale-105 transition"
              >
                Falar no WhatsApp
              </a>

              <Link
                href="/contato"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 font-semibold hover:bg-white/10 transition"
              >
                Enviar mensagem
              </Link>

              <Link
                href="/planos"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 font-semibold hover:bg-white/10 transition"
              >
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}