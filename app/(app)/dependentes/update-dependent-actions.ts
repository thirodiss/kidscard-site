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

export async function updateDependentAction(
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
  const name = String(formData.get("name") || "").trim();
  const cpfRaw = String(formData.get("cpf") || "").trim();
  const birthDateRaw = String(formData.get("birthDate") || "").trim();
  const isActiveRaw = String(formData.get("isActive") || "").trim();

  if (!dependentId) {
    return {
      success: false,
      message: "Dependente inválido.",
    };
  }

  if (!name) {
    return {
      success: false,
      message: "Informe o nome do dependente.",
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

  const existingDependent = await prisma.dependent.findFirst({
    where: {
      id: dependentId,
      guardianId: session.user.id,
      accountId: account.id,
    },
    select: { id: true },
  });

  if (!existingDependent) {
    return {
      success: false,
      message: "Dependente não encontrado.",
    };
  }

  const cpf = onlyDigits(cpfRaw);

  if (cpf && cpf.length !== 11) {
    return {
      success: false,
      message: "CPF inválido. Use 11 dígitos.",
    };
  }

  if (cpf) {
    const duplicatedCpf = await prisma.dependent.findFirst({
      where: {
        cpf,
        NOT: { id: dependentId },
      },
      select: { id: true },
    });

    if (duplicatedCpf) {
      return {
        success: false,
        message: "Já existe outro dependente com esse CPF.",
      };
    }
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

  const isActive = isActiveRaw === "true";

  await prisma.dependent.update({
    where: { id: dependentId },
    data: {
      name,
      cpf: cpf || null,
      birthDate,
      isActive,
    },
  });

  revalidatePath("/dependentes");
  revalidatePath("/painel");

  return {
    success: true,
    message: "Dados do dependente atualizados com sucesso.",
  };
}