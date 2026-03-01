import Link from "next/link";

const INPI_URL =
  "https://gru.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp";

export default function PatentePage() {
  return (
    <main className="px-6 pt-12 pb-20">
      <div className="container-page">
        <div className="text-center">
          <h1 className="h1">Patente</h1>
          <p className="text-black/70 mt-4 text-lg max-w-3xl mx-auto">
            O conceito da Kids Card foi registrado e pode ser consultado no INPI.
            Use o código abaixo na busca.
          </p>
        </div>

        <section className="mt-12 card soft-shadow p-10">
          <div className="text-sm font-semibold text-black/60">
            Código de busca
          </div>

          <div className="mt-3 text-3xl font-extrabold tracking-tight">
            BR 10 2018 011970 2
          </div>

          <p className="text-black/70 mt-4">
            Abra o site do INPI, cole o código na busca e visualize os detalhes do
            registro.
          </p>

          <div className="mt-8 flex gap-3 flex-wrap">
            <a
              href={INPI_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Abrir site do INPI
            </a>

            <Link href="/produtos" className="btn-outline">
              Ver produtos
            </Link>

            <Link href="/planos" className="btn-outline">
              Ver planos
            </Link>
          </div>

          <div className="mt-6 text-xs text-black/55">
            * Se o INPI estiver instável, tente novamente mais tarde.
          </div>
        </section>
      </div>
    </main>
  );
}