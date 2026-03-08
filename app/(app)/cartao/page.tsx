import DashboardShell from "../../../components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CardStatusActionForm from "@/components/cards/CardStatusActionForm";
import CardPreferenceToggleForm from "@/components/cards/CardPreferenceToggleForm";
import ReissueCardForm from "@/components/cards/ReissueCardForm";

type CardStatus = "ACTIVE" | "BLOCKED" | "CANCELED";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatAccountNumber(value: string) {
  if (!value) return "";
  return value.length > 1 ? `${value}-7` : value;
}

function getCardStatusLabel(status: CardStatus) {
  switch (status) {
    case "ACTIVE":
      return "Ativo";
    case "BLOCKED":
      return "Bloqueado";
    case "CANCELED":
      return "Cancelado";
    default:
      return status;
  }
}

function getCardStatusBadge(status: CardStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/15 text-emerald-300";
    case "BLOCKED":
      return "bg-amber-500/15 text-amber-300";
    case "CANCELED":
      return "bg-red-500/15 text-red-300";
    default:
      return "bg-white/10 text-white/75";
  }
}

function InfoCard({
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

function ActionButton({
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

export default async function CartaoPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    include: {
      cards: {
        orderBy: { createdAt: "desc" },
        take: 2,
      },
    },
  });

  if (!account) {
    return (
      <DashboardShell
        title="Cartão da conta"
        subtitle="Visualize o cartão KidsCard, status, dados principais e preferências da conta."
      >
        <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
          Conta não encontrada.
        </div>
      </DashboardShell>
    );
  }

  const card = account.cards[0] ?? null;
  const previousCard = account.cards[1] ?? null;

  const holderName = session.user.name || "Responsável KidsCard";
  const agency = session.user.agency || "0001";
  const accountNumber = session.user.accountNumber || "123456";
  const plan = "Standard";

  return (
    <DashboardShell
      title="Cartão da conta"
      subtitle="Visualize o cartão KidsCard, status, dados principais e preferências da conta."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[36px] border border-black/10 bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#1e293b] p-8 text-white soft-shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white/60">KidsCard</div>
              <div className="mt-2 text-3xl font-bold tracking-tight">
                Conta {plan}
              </div>
            </div>

            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              Função débito
            </div>
          </div>

          <div className="mt-14 text-3xl tracking-[0.28em]">
            {card ? `**** **** **** ${card.last4}` : "**** **** **** ----"}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 text-sm text-white/75 md:grid-cols-4">
            <div>
              <div className="text-white/50">Titular</div>
              <div className="mt-1 font-semibold text-white">{holderName}</div>
            </div>

            <div>
              <div className="text-white/50">Agência</div>
              <div className="mt-1 font-semibold text-white">{agency}</div>
            </div>

            <div>
              <div className="text-white/50">Conta</div>
              <div className="mt-1 font-semibold text-white">
                {formatAccountNumber(accountNumber)}
              </div>
            </div>

            <div>
              <div className="text-white/50">Status</div>
              <div className="mt-1 font-semibold text-white">
                {card ? getCardStatusLabel(card.status) : "Não emitido"}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                card ? getCardStatusBadge(card.status) : "bg-white/10 text-white/75"
              }`}
            >
              {card
                ? `Cartão ${getCardStatusLabel(card.status).toLowerCase()}`
                : "Sem cartão emitido"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
              Uso nacional
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
              Compras no débito
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Resumo</div>
            <h2 className="mt-2 text-2xl font-bold">Informações do cartão</h2>

            <div className="mt-5 grid gap-4">
              <InfoCard
                label="Tipo de conta"
                value="Conta simples"
                note="Conta voltada para organização financeira da família."
              />
              <InfoCard
                label="Função disponível"
                value="Débito"
                note="Crédito indisponível nesta fase do produto."
              />
              <InfoCard
                label="Limite disponível"
                value="Saldo em conta"
                note="O cartão utiliza o saldo disponível da conta principal."
              />
              <InfoCard
                label="Bandeira"
                value={card?.brand || "Não definida"}
                note="Estrutura em evolução conforme estratégia do produto."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
            <div className="text-sm font-semibold text-[#5b2cff]">Saldo vinculado</div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
              {formatCurrency(account.balanceCents)}
            </div>
            <p className="mt-3 leading-7 text-black/65">
              Valor disponível atualmente para uso no cartão da conta.
            </p>
          </div>

          {previousCard ? (
            <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
              <div className="text-sm font-semibold text-[#5b2cff]">
                Cartão anterior
              </div>
              <div className="mt-2 text-2xl font-bold text-[#0f172a]">
                **** **** **** {previousCard.last4}
              </div>
              <p className="mt-3 text-sm text-black/60">
                Status: {getCardStatusLabel(previousCard.status)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Controles rápidos</div>
          <h2 className="mt-2 text-2xl font-bold">Ações do cartão</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {card ? (
              <>
                <CardStatusActionForm
                  cardId={card.id}
                  nextStatus="BLOCKED"
                  title="Bloquear cartão"
                  desc="Interrompa temporariamente o uso do cartão."
                  disabled={card.status !== "ACTIVE"}
                />

                <CardStatusActionForm
                  cardId={card.id}
                  nextStatus="ACTIVE"
                  title="Desbloquear cartão"
                  desc="Restabeleça o uso do cartão na conta."
                  disabled={card.status !== "BLOCKED"}
                />

                <ReissueCardForm
                  cardId={card.id}
                  disabled={card.status === "CANCELED"}
                />

                <ActionButton
                  title="Ajustar preferências"
                  desc="Defina comportamento e uso do cartão."
                />
              </>
            ) : (
              <>
                <ActionButton
                  title="Bloquear cartão"
                  desc="Interrompa temporariamente o uso do cartão."
                  disabled
                />
                <ActionButton
                  title="Desbloquear cartão"
                  desc="Restabeleça o uso do cartão na conta."
                  disabled
                />
                <ActionButton
                  title="Solicitar segunda via"
                  desc="Peça uma nova via do cartão da conta."
                  disabled
                />
                <ActionButton
                  title="Ajustar preferências"
                  desc="Defina comportamento e uso do cartão."
                  disabled
                />
              </>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Configurações</div>
          <h2 className="mt-2 text-2xl font-bold">Preferências do cartão</h2>

          <div className="mt-5 space-y-4">
            {card ? (
              <>
                <CardPreferenceToggleForm
                  cardId={card.id}
                  field="allowPhysicalPurchase"
                  label="Compras presenciais"
                  enabled={card.allowPhysicalPurchase}
                />
                <CardPreferenceToggleForm
                  cardId={card.id}
                  field="allowOnlinePurchase"
                  label="Compras online"
                  enabled={card.allowOnlinePurchase}
                />
                <CardPreferenceToggleForm
                  cardId={card.id}
                  field="allowContactless"
                  label="Pagamento por aproximação"
                  enabled={card.allowContactless}
                />
                <CardPreferenceToggleForm
                  cardId={card.id}
                  field="allowNotifications"
                  label="Notificações de uso"
                  enabled={card.allowNotifications}
                />
              </>
            ) : (
              <>
                <ActionButton title="Compras presenciais" desc="Indisponível" disabled />
                <ActionButton title="Compras online" desc="Indisponível" disabled />
                <ActionButton title="Pagamento por aproximação" desc="Indisponível" disabled />
                <ActionButton title="Notificações de uso" desc="Indisponível" disabled />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-black px-8 py-8 text-white soft-shadow">
          <div className="text-sm font-semibold text-white/60">Segurança</div>
          <h2 className="mt-2 text-3xl font-bold">
            Mais controle no uso do cartão
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-white/75">
            A conta KidsCard foi pensada para dar mais visibilidade ao uso dos
            recursos, com acompanhamento das movimentações, histórico de uso e
            acesso rápido às configurações principais do cartão.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 soft-shadow">
          <div className="text-sm font-semibold text-[#5b2cff]">Observações</div>
          <div className="mt-4 space-y-4 text-black/65">
            <p className="leading-7">
              O cartão está vinculado diretamente à conta e utiliza o saldo
              disponível para movimentações no débito.
            </p>
            <p className="leading-7">
              Nesta fase, a plataforma não disponibiliza função crédito.
            </p>
            <p className="leading-7">
              Em caso de dúvida, acompanhe o extrato e revise as configurações
              do cartão pela área da conta.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}