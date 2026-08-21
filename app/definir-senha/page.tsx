import SetPasswordForm from "@/components/auth/SetPasswordForm"

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = "" } = await searchParams
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="text-sm font-semibold text-[#5b2cff]">KidsCard</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Definir nova senha</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">O link é individual, temporário e deixa de funcionar após o uso.</p>
        <SetPasswordForm token={token} />
      </div>
    </main>
  )
}
