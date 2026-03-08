import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#0b1533] text-white">
      <div className="container-page px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="KidsCard"
                width={150}
                height={44}
                className="h-auto w-auto brightness-0 invert"
              />
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-white/70">
              Fintech focada em transparência, organização financeira e soluções
              para a rotina familiar com conta digital, planos progressivos e
              experiência mais clara para responsáveis.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Produto
            </div>
            <div className="mt-4 flex flex-col gap-3 text-white/80">
              <Link href="/produtos" className="hover:text-white">
                Produtos
              </Link>
              <Link href="/planos" className="hover:text-white">
                Planos
              </Link>
              <Link href="/sobre" className="hover:text-white">
                Sobre
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Empresa
            </div>
            <div className="mt-4 flex flex-col gap-3 text-white/80">
              <Link href="/investidores" className="hover:text-white">
                Investidores
              </Link>
              <Link href="/contato" className="hover:text-white">
                Contato
              </Link>
              <Link href="/contato" className="hover:text-white">
                Solicitar apresentação
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Contato
            </div>
            <div className="mt-4 flex flex-col gap-3 text-white/80">
              <a
                href="mailto:contato@kidscard.com.br"
                className="hover:text-white"
              >
                contato@kidscard.com.br
              </a>
              <a
                href="mailto:investidores@kidscard.com.br"
                className="hover:text-white"
              >
                investidores@kidscard.com.br
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} KidsCard. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}