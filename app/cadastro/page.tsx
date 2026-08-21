import Link from "next/link";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function CadastroPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <div className="container-page grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_500px]">
        <div className="lg:sticky lg:top-10">
          <Link href="/" className="text-sm font-semibold text-[#5b2cff]">← Voltar para a KidsCard</Link>
          <div className="mt-8 inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">Ambiente de pré-adesão</div>
          <h1 className="mt-5 text-5xl font-bold tracking-tight text-[#0f172a] md:text-6xl">Comece com segurança e transparência.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70">
            Envie os dados iniciais do responsável. Depois da análise, a validação de identidade e os documentos serão feitos pelo fluxo homologado.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-black/65">
            <div className="rounded-2xl border border-black/10 bg-white p-4">1. Pré-cadastro do responsável</div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">2. KYC e conferência documental</div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">3. Aprovação e criação das carteiras</div>
          </div>
        </div>
        <OnboardingForm />
      </div>
    </main>
  );
}
