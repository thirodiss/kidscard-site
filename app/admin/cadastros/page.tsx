import { isEmailConfigured } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
import {
  approveApplicationAction,
  rejectApplicationAction,
  resendInvitationAction,
} from "./actions"

const notices: Record<string, string> = {
  approved: "Solicitação aprovada e link de primeiro acesso enviado.",
  rejected: "Solicitação rejeitada e decisão registrada na auditoria.",
  resent: "Novo link de primeiro acesso enviado.",
  "invalid-cpf": "Informe um CPF válido e já verificado no processo de KYC.",
  "invalid-rejection": "Informe um motivo de rejeição com pelo menos 5 caracteres.",
  "email-not-configured": "Configure RESEND_API_KEY e EMAIL_FROM antes de aprovar contas.",
  "email-failed": "A conta foi processada, mas o e-mail não foi entregue. Revise a configuração e reenvie.",
  "approval-failed": "Não foi possível aprovar. Verifique conflitos de CPF/e-mail e tente novamente.",
  "rejection-failed": "Não foi possível rejeitar esta solicitação.",
  "invalid-request": "A solicitação informada não está disponível para essa ação.",
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>
}) {
  const { notice } = await searchParams
  const [applications, grouped] = await Promise.all([
    prisma.onboardingApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { agency: true, accountNumber: true } } },
    }),
    prisma.onboardingApplication.groupBy({ by: ["status"], _count: { _all: true } }),
  ])
  const counts = Object.fromEntries(grouped.map((item) => [item.status, item._count._all]))

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-[#5b2cff]">Operação segura</div>
          <h1 className="mt-2 text-3xl font-bold">Pré-cadastros</h1>
          <p className="mt-2 text-slate-600">Aprovação somente após validação de identidade do responsável.</p>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isEmailConfigured() ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
          E-mail {isEmailConfigured() ? "configurado" : "pendente"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["KYC_PENDING", "Em validação"],
          ["APPROVED", "Aprovados"],
          ["REJECTED", "Rejeitados"],
          ["SUBMITTED", "Recebidos"],
        ].map(([status, label]) => (
          <div key={status} className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{counts[status] ?? 0}</div>
          </div>
        ))}
      </div>

      {notice && notices[notice] ? (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          {notices[notice]}
        </div>
      ) : null}

      <div className="mt-8 space-y-5">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">Nenhuma solicitação recebida.</div>
        ) : applications.map((application) => {
          const pending = application.status === "KYC_PENDING" || application.status === "SUBMITTED"
          return (
            <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Protocolo {application.id.slice(-8).toUpperCase()}</div>
                  <h2 className="mt-2 text-xl font-bold">{application.guardianName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{application.email} • {application.phone}</p>
                  <p className="mt-1 text-sm text-slate-600">{application.city}/{application.state} • {application.dependentCount} dependente(s)</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold">{application.status}</div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4"><strong>Uso:</strong> {application.intendedUse}</div>
                <div className="rounded-2xl bg-slate-50 p-4"><strong>Recebido:</strong> {application.createdAt.toLocaleString("pt-BR")}</div>
                <div className="rounded-2xl bg-slate-50 p-4"><strong>Consentimento:</strong> {application.consentVersion}</div>
              </div>

              {pending ? (
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <form action={approveApplicationAction} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <input type="hidden" name="applicationId" value={application.id} />
                    <label className="text-sm font-semibold text-emerald-950">
                      CPF validado no KYC
                      <input required name="cpf" inputMode="numeric" autoComplete="off" maxLength={14} className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 outline-none" />
                    </label>
                    <button className="mt-3 w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Aprovar e enviar primeiro acesso</button>
                  </form>
                  <form action={rejectApplicationAction} className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <input type="hidden" name="applicationId" value={application.id} />
                    <label className="text-sm font-semibold text-red-950">
                      Motivo da rejeição
                      <textarea required name="rejectionReason" minLength={5} maxLength={500} className="mt-2 min-h-20 w-full rounded-xl border border-red-200 bg-white px-4 py-3 outline-none" />
                    </label>
                    <button className="mt-3 w-full rounded-full bg-red-700 px-5 py-3 text-sm font-bold text-white">Rejeitar solicitação</button>
                  </form>
                </div>
              ) : null}

              {application.status === "APPROVED" && application.user ? (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
                  <div>Conta criada: Ag. {application.user.agency} • {application.user.accountNumber} • convite {application.invitationSentAt ? "enviado" : "pendente"}</div>
                  <form action={resendInvitationAction}>
                    <input type="hidden" name="applicationId" value={application.id} />
                    <button className="rounded-full bg-blue-700 px-4 py-2 font-bold text-white">Reenviar primeiro acesso</button>
                  </form>
                </div>
              ) : null}

              {application.rejectionReason ? (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900"><strong>Motivo:</strong> {application.rejectionReason}</div>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
