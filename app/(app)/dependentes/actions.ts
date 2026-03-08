"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

type ActionState = {
  success: boolean;
  message: string;
};

export async function createDependentAction(
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

  const name = String(formData.get("name") || "").trim();
  const cpfRaw = String(formData.get("cpf") || "").trim();
  const birthDateRaw = String(formData.get("birthDate") || "").trim();
  const monthlyLimitRaw = String(formData.get("monthlyLimit") || "").trim();

  if (!name) {
    return {
      success: false,
      message: "Informe o nome do dependente.",
    };
  }

  const cpf = onlyDigits(cpfRaw);
  if (cpf && cpf.length !== 11) {
    return {
      success: false,
      message: "CPF inválido. Use 11 dígitos.",
    };
  }

  let birthDate: Date | null = null;
  if (birthDateRaw) {
    const parsedDate = new Date(`${birthDateRaw}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return {
        success: false,
        message: "Data de nascimento inválida.",
      };
    }
    birthDate = parsedDate;
  }

  const normalizedLimit = monthlyLimitRaw.replace(",", ".");
  const limitNumber = normalizedLimit ? Number(normalizedLimit) : 0;

  if (Number.isNaN(limitNumber) || limitNumber < 0) {
    return {
      success: false,
      message: "Limite mensal inválido.",
    };
  }

  const monthlyLimitCents = Math.round(limitNumber * 100);

  if (cpf) {
    const existingDependent = await prisma.dependent.findUnique({
      where: { cpf },
      select: { id: true },
    });

    if (existingDependent) {
      return {
        success: false,
        message: "Já existe um dependente com esse CPF.",
      };
    }
  }

  await prisma.dependent.create({
    data: {
      guardianId: session.user.id,
      accountId: account.id,
      name,
      cpf: cpf || null,
      birthDate,
      monthlyLimitCents,
      isActive: true,
    },
  });

  revalidatePath("/dependentes");
  revalidatePath("/painel");

  return {
    success: true,
    message: "Dependente cadastrado com sucesso.",
  };
}