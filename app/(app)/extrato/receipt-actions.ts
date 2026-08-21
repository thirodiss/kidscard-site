"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionState = { success: boolean; message: string };

function parseMoney(value: string) {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? Math.round(number * 100) : NaN;
}

function parseItems(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [nameRaw, quantityRaw, unitPriceRaw, eanRaw] = line.split(";");
      const name = nameRaw?.trim();
      const quantity = Number((quantityRaw || "1").trim().replace(",", "."));
      const unitPriceCents = parseMoney(unitPriceRaw || "");
      const totalAmountCents = Math.round(quantity * unitPriceCents);
      return { name, quantity, unitPriceCents, totalAmountCents, ean: eanRaw?.trim() || null };
    });
}

export async function submitReceiptAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão inválida." };

  const transactionId = String(formData.get("transactionId") || "");
  const accessKey = String(formData.get("accessKey") || "").replace(/\D/g, "");
  const merchantTaxId = String(formData.get("merchantTaxId") || "").replace(/\D/g, "");
  const itemsText = String(formData.get("items") || "");
  const items = parseItems(itemsText);

  if (accessKey && accessKey.length !== 44) {
    return { success: false, message: "A chave da NFC-e deve ter 44 dígitos." };
  }
  if (items.length === 0) {
    return { success: false, message: "Informe ao menos um item do comprovante." };
  }
  if (items.some((item) => !item.name || item.quantity <= 0 || !Number.isInteger(item.totalAmountCents) || item.totalAmountCents <= 0)) {
    return { success: false, message: "Use uma linha por item: nome; quantidade; preço unitário; EAN opcional." };
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      type: "PURCHASE",
      account: { userId: session.user.id },
    },
    include: { items: { select: { id: true }, take: 1 } },
  });

  if (!transaction) return { success: false, message: "Compra não encontrada." };
  if (transaction.detailStatus === "AVAILABLE" && transaction.items.length > 0) {
    return { success: false, message: "Esta compra já possui itens confirmados." };
  }

  const itemTotal = items.reduce((sum, item) => sum + item.totalAmountCents, 0);
  const expectedTotal = Math.abs(transaction.amountCents);
  const matched = itemTotal === expectedTotal;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.receipt.create({
        data: {
          transactionId: transaction.id,
          source: "FISCAL_RECEIPT",
          status: matched ? "MATCHED" : "REVIEW_REQUIRED",
          accessKey: accessKey || null,
          merchantTaxId: merchantTaxId || null,
          totalAmountCents: itemTotal,
          rawPayload: { format: "MANUAL_SANDBOX", lines: itemsText.split("\n") },
        },
      });

      if (matched) {
        await tx.transactionItem.createMany({
          data: items.map((item) => ({
            transactionId: transaction.id,
            name: item.name,
            ean: item.ean,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            totalAmountCents: item.totalAmountCents,
            source: "FISCAL_RECEIPT",
          })),
        });
      }

      await tx.transaction.update({
        where: { id: transaction.id },
        data: { detailStatus: matched ? "AVAILABLE" : "REVIEW_REQUIRED" },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Receipt_accessKey_key")) {
      return { success: false, message: "Esta chave de NFC-e já foi enviada." };
    }
    throw error;
  }

  revalidatePath("/extrato");
  return {
    success: true,
    message: matched
      ? "Comprovante conciliado e itens liberados no extrato."
      : "Comprovante recebido. O total diverge da compra e seguirá para conferência.",
  };
}
