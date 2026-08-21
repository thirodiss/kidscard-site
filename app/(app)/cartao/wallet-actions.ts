"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionState = { success: boolean; message: string };

export async function assignCardWalletAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão inválida." };

  const cardId = String(formData.get("cardId") || "");
  const bucketId = String(formData.get("bucketId") || "");
  const account = await prisma.walletAccount.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!account) return { success: false, message: "Conta não encontrada." };

  const [card, bucket] = await Promise.all([
    prisma.card.findFirst({ where: { id: cardId, accountId: account.id }, select: { id: true } }),
    prisma.walletBucket.findFirst({
      where: {
        id: bucketId,
        accountId: account.id,
        type: { in: ["PRIMARY", "PENSION", "ALLOWANCE"] },
      },
      select: { id: true },
    }),
  ]);

  if (!card || !bucket) return { success: false, message: "Cartão ou carteira inválida." };

  await prisma.card.update({
    where: { id: card.id },
    data: { spendingBucketId: bucket.id },
  });
  revalidatePath("/cartao");
  return { success: true, message: "Carteira de uso do cartão atualizada." };
}
