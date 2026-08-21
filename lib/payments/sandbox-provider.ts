import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type {
  CardPreferences,
  CardReference,
  PaymentProviderGateway,
  PaymentWebhookEvent,
  ProviderCardResult,
} from "@/lib/payments/contracts";

const itemSchema = z.object({
  name: z.string().trim().min(1).max(180),
  ean: z.string().trim().min(5).max(32).optional(),
  quantity: z.number().positive().max(10000).default(1),
  unitPriceCents: z.number().int().nonnegative(),
  totalAmountCents: z.number().int().nonnegative(),
  confidenceBasisPoints: z.number().int().min(0).max(10000).optional(),
});

const eventSchema = z.object({
  id: z.string().trim().min(1).max(180),
  type: z.enum(["purchase.created", "refund.created"]),
  accountReference: z.string().trim().min(1).max(180),
  cardReference: z.string().trim().min(1).max(180).optional(),
  amountCents: z.number().int().positive(),
  description: z.string().trim().min(1).max(240),
  merchant: z.string().trim().max(180).optional(),
  category: z.string().trim().max(100).optional(),
  authorizationCode: z.string().trim().max(100).optional(),
  occurredAt: z.string().datetime(),
  items: z.array(itemSchema).max(500).default([]),
});

function currentExternalId(card: CardReference) {
  return card.externalId || `sandbox-card-${card.internalId}`;
}

function result(externalId: string, last4?: string): ProviderCardResult {
  return {
    externalId,
    last4,
    providerUpdatedAt: new Date(),
  };
}

export class SandboxPaymentProvider implements PaymentProviderGateway {
  readonly name = "SANDBOX" as const;

  async setCardStatus(card: CardReference): Promise<ProviderCardResult> {
    return result(currentExternalId(card));
  }

  async setCardPreferences(
    card: CardReference,
    _preferences: CardPreferences
  ): Promise<ProviderCardResult> {
    void _preferences;
    return result(currentExternalId(card));
  }

  async reissueCard(_card: CardReference): Promise<ProviderCardResult> {
    void _card;
    return result(
      `sandbox-card-${randomUUID()}`,
      String(randomInt(1000, 10000))
    );
  }

  verifyWebhook(rawBody: string, signature: string | null): boolean {
    const secret = process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET;

    if (!secret || !signature) return false;

    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const normalized = signature.replace(/^sha256=/i, "").trim().toLowerCase();

    if (expected.length !== normalized.length) return false;

    return timingSafeEqual(Buffer.from(expected), Buffer.from(normalized));
  }

  parseWebhook(rawBody: string): PaymentWebhookEvent {
    const parsed = eventSchema.parse(JSON.parse(rawBody));

    return {
      ...parsed,
      occurredAt: new Date(parsed.occurredAt),
    };
  }
}
