"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

export async function updateDependentLimitAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sessão inválida. Faça login novamente.",
    };
  }

  const dependentId = String(formData.get("dependentId") || "").trim();
  const monthlyLimitRaw = String(formData.get("monthlyLimit") || "").trim();

  if (!dependentId) {
    return {
      success: false,
      message: "Dependente inválido.",
    };
  }

  const normalizedLimit = monthlyLimitRaw.replace(",", ".");
  const limitNumber = Number(normalizedLimit);

  if (Number.isNaN(limitNumber) || limitNumber < 0) {
    return {
      success: false,
      message: "Informe um limite mensal válido.",
    };
  }

  const monthlyLimitCents = Math.round(limitNumber * 100);

  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!account) {
    return {
      success: false,
      message: "Conta principal não encontrada.",
    };
  }

  const dependent = await prisma.dependent.findFirst({
    where: {
      id: dependentId,
      guardianId: session.user.id,
      accountId: account.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!dependent) {
    return {
      success: false,
      message: "Dependente não encontrado.",
    };
  }

  await prisma.dependent.update({
    where: { id: dependent.id },
    data: {
      monthlyLimitCents,
    },
  });

  revalidatePath("/dependentes");
  revalidatePath("/painel");

  return {
    success: true,
    message: `Limite mensal de ${dependent.name} atualizado com sucesso.`,
  };
}