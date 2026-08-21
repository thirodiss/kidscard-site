import PasswordResetRequestForm from "@/components/auth/PasswordResetRequestForm"

export default function RecuperarSenhaPage() {
  return (
    <main className="px-6 py-16">
      <div className="container-page max-w-3xl">
        <div className="rounded-[32px] border border-black/10 bg-white p-8 md:p-10 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Recuperação</div>
          <h1 className="mt-2 text-3xl font-bold">Recuperar senha</h1>
          <p className="mt-4 max-w-2xl text-black/70">
            Informe seu e-mail para receber as instruções de recuperação de acesso.
          </p>

          <PasswordResetRequestForm />
        </div>
      </div>
    </main>
  );
}
