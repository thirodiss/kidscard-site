import type { PaymentProvider } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getPaymentProvider } from "@/lib/payments";
import { processPaymentEvent } from "@/lib/payments/process-event";

const supportedProviders: PaymentProvider[] = ["SANDBOX"];

export async function POST(
  request: Request,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider: providerParam } = await context.params;
  const provider = providerParam.toUpperCase() as PaymentProvider;

  if (!supportedProviders.includes(provider)) {
    return NextResponse.json(
      { error: "Provedor não configurado." },
      { status: 404 }
    );
  }

  if (
    provider === "SANDBOX" &&
    !process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET
  ) {
    return NextResponse.json(
      { error: "Webhook sandbox não habilitado." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-kidscard-signature");
  const gateway = getPaymentProvider(provider);

  if (!gateway.verifyWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  try {
    const event = gateway.parseWebhook(rawBody);
    const result = await processPaymentEvent(provider, event);

    return NextResponse.json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    }

    console.error("Falha ao processar webhook de pagamentos", error);
    return NextResponse.json(
      { error: "Não foi possível processar o evento." },
      { status: 500 }
    );
  }
}
