import DashboardShell from "../../../components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatCpf(cpf?: string | null) {
  if (!cpf) return "Não informado";

  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatAccountNumber(value?: string | null) {
  if (!value) return "Não informado";
  return value.length > 1 ? `${value}-7` : value;
}

function Field({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-sm font-semibold text-black/55">{label}</div>
      <div className="mt-2 text-lg font-bold text-[#0f172a]">{value}</div>
      {note ? <p className="mt-2 text-sm leading-6 text-black/60">{note}</p> : null}
    </div>
  );
}

function ActionItem({
  title,
  desc,
  disabled = false,
}: {
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-left transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="font-semibold text-[#0f172a]">{title}</div>
      <p className="mt-1 text-sm leading-6 text-black/60">{desc}</p>
    </button>
  );
}

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
  });

  if (!user || !account) {
    return (
      <DashboardShell
        title="Perfil da conta"
        subtitle="Consulte os dados principais do responsável, informações da conta e preferências de acesso da plataforma."
      >
        <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
          Dados da conta não encontrados.
        </div>
      </DashboardShell>
    );
  }

  const plan = "Standard";

  return (
    <DashboardShell
      title="Perfil da conta"
      subtitle="Consulte os dados principais do responsável, informações da conta e preferências de acesso da plataforma."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Responsável</div>
          <h2 className="mt-2 text-2xl font-bold">Dados do titular da conta</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nome completo" value={user.name || "Não informado"} />
            <Field label="CPF" value={formatCpf(user.cpf)} />
            <Field label="E-mail" value={user.email || "Não informado"} />
            <Field
              label="Telefone"
              value="Não informado"
              note="Campo disponível para evolução futura do cadastro."
            />
            <Field
              label="Status da conta"
              value={account.status === "ACTIVE" ? "Ativa" : account.status}
            />
            <Field
              label="Tipo de acesso"
              value={user.role === "GUARDIAN" ? "Responsável principal" : user.role}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Plano</div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
              {plan}
            </div>
            <p className="mt-3 leading-7 text-black/65">
              Conta com benefícios progressivos e recursos da plataforma
              conforme disponibilidade.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">
              Conta bancária
            </div>
            <div className="mt-5 grid gap-4">
              <Field label="Agência" value={user.agency} />
              <Field label="Conta" value={formatAccountNumber(user.accountNumber)} />
              <Field label="Tipo" value="Conta simples" />
              <Field label="Função disponível" value="Débito" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Segurança</div>
          <h2 className="mt-2 text-2xl font-bold">Proteção da conta</h2>

          <div className="mt-5 grid gap-3">
            <ActionItem
              title="Alterar senha"
              desc="Atualize sua senha de acesso à plataforma."
            />
            <ActionItem
              title="Gerenciar acessos"
              desc="Revise os dados principais utilizados no login."
            />
            <ActionItem
              title="Ativar verificação adicional"
              desc="Prepare a conta para futuras camadas extras de segurança."
            />
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Preferências</div>
          <h2 className="mt-2 text-2xl font-bold">Configurações da plataforma</h2>

          <div className="mt-5 space-y-4">
            {[
              ["Receber notificações", "Ativado"],
              ["Lembrar acesso neste dispositivo", "Ativado"],
              ["Comunicados da conta", "Ativados"],
              ["Resumo periódico da conta", "Ativado"],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4"
              >
                <div className="font-semibold text-[#0f172a]">{label}</div>
                <div className="rounded-full bg-black/5 px-3 py-1 text-sm font-semibold text-black/60">
                  {status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
          <div className="text-sm font-semibold text-white/60">
            Identidade da conta
          </div>
          <h2 className="mt-2 text-3xl font-bold">
            Uma experiência bancária simples para a família
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-white/75">
            O perfil da conta reúne os dados principais do responsável, a
            estrutura da conta bancária e as preferências da plataforma,
            centralizando o controle da experiência KidsCard.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Observações</div>
          <div className="mt-4 space-y-4 text-black/65">
            <p className="leading-7">
              A conta está estruturada para função débito, sem crédito ativo
              nesta etapa do produto.
            </p>
            <p className="leading-7">
              Os dados exibidos nesta área representam a configuração principal
              do acesso do responsável.
            </p>
            <p className="leading-7">
              Futuramente, esta área poderá concentrar preferências avançadas,
              segurança e controles da conta.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}