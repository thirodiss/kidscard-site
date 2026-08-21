import type { CardStatus, PaymentProvider } from "@prisma/client";

export type CardPreferences = {
  allowPhysicalPurchase: boolean;
  allowOnlinePurchase: boolean;
  allowContactless: boolean;
  allowNotifications: boolean;
};

export type CardReference = {
  internalId: string;
  externalId: string | null;
};

export type ProviderCardResult = {
  externalId: string;
  last4?: string;
  providerUpdatedAt: Date;
};

export type PurchaseItemInput = {
  name: string;
  ean?: string;
  quantity: number;
  unitPriceCents: number;
  totalAmountCents: number;
  confidenceBasisPoints?: number;
};

export type PaymentWebhookEvent = {
  id: string;
  type: "purchase.created" | "refund.created";
  accountReference: string;
  cardReference?: string;
  amountCents: number;
  description: string;
  merchant?: string;
  category?: string;
  authorizationCode?: string;
  occurredAt: Date;
  items: PurchaseItemInput[];
};

export interface PaymentProviderGateway {
  readonly name: PaymentProvider;

  setCardStatus(
    card: CardReference,
    status: Extract<CardStatus, "ACTIVE" | "BLOCKED">
  ): Promise<ProviderCardResult>;

  setCardPreferences(
    card: CardReference,
    preferences: CardPreferences
  ): Promise<ProviderCardResult>;

  reissueCard(card: CardReference): Promise<ProviderCardResult>;

  verifyWebhook(rawBody: string, signature: string | null): boolean;
  parseWebhook(rawBody: string): PaymentWebhookEvent;
}
