-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('SANDBOX', 'PISMO', 'DOCK', 'FITS', 'OTHER');

-- CreateEnum
CREATE TYPE "ProviderSyncStatus" AS ENUM ('LOCAL_ONLY', 'PENDING', 'SYNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionDetailStatus" AS ENUM ('UNAVAILABLE', 'PENDING', 'AVAILABLE', 'REVIEW_REQUIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionDetailSource" AS ENUM ('MERCHANT_INTEGRATION', 'FISCAL_RECEIPT', 'AI_ASSISTED', 'MANUAL_REVIEW', 'SANDBOX');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'MATCHED', 'REVIEW_REQUIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProviderEventStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'IGNORED', 'FAILED');

-- AlterTable
ALTER TABLE "WalletAccount"
ADD COLUMN "provider" "PaymentProvider" NOT NULL DEFAULT 'SANDBOX',
ADD COLUMN "externalId" TEXT,
ADD COLUMN "syncStatus" "ProviderSyncStatus" NOT NULL DEFAULT 'LOCAL_ONLY';

-- AlterTable
ALTER TABLE "Card"
ADD COLUMN "provider" "PaymentProvider" NOT NULL DEFAULT 'SANDBOX',
ADD COLUMN "externalId" TEXT,
ADD COLUMN "syncStatus" "ProviderSyncStatus" NOT NULL DEFAULT 'LOCAL_ONLY',
ADD COLUMN "providerUpdatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "cardId" TEXT,
ADD COLUMN "provider" "PaymentProvider" NOT NULL DEFAULT 'SANDBOX',
ADD COLUMN "externalId" TEXT,
ADD COLUMN "authorizationCode" TEXT,
ADD COLUMN "detailStatus" "TransactionDetailStatus" NOT NULL DEFAULT 'UNAVAILABLE',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ean" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "source" "TransactionDetailSource" NOT NULL,
    "confidenceBasisPoints" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "source" "TransactionDetailSource" NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'RECEIVED',
    "accessKey" TEXT,
    "merchantTaxId" TEXT,
    "issuedAt" TIMESTAMP(3),
    "totalAmountCents" INTEGER,
    "storageKey" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderEvent" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ProviderEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB NOT NULL,
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletAccount_provider_externalId_key" ON "WalletAccount"("provider", "externalId");
CREATE UNIQUE INDEX "Card_provider_externalId_key" ON "Card"("provider", "externalId");
CREATE UNIQUE INDEX "Transaction_provider_externalId_key" ON "Transaction"("provider", "externalId");
CREATE INDEX "Transaction_cardId_occurredAt_idx" ON "Transaction"("cardId", "occurredAt");
CREATE INDEX "TransactionItem_transactionId_idx" ON "TransactionItem"("transactionId");
CREATE INDEX "TransactionItem_ean_idx" ON "TransactionItem"("ean");
CREATE UNIQUE INDEX "Receipt_accessKey_key" ON "Receipt"("accessKey");
CREATE INDEX "Receipt_transactionId_status_idx" ON "Receipt"("transactionId", "status");
CREATE UNIQUE INDEX "ProviderEvent_provider_externalId_key" ON "ProviderEvent"("provider", "externalId");
CREATE INDEX "ProviderEvent_status_receivedAt_idx" ON "ProviderEvent"("status", "receivedAt");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Existing demo records remain explicitly marked as sandbox data.
UPDATE "WalletAccount"
SET "externalId" = 'sandbox-account-' || "id", "syncStatus" = 'SYNCED'
WHERE "externalId" IS NULL;

UPDATE "Card"
SET "externalId" = 'sandbox-card-' || "id", "syncStatus" = 'SYNCED'
WHERE "externalId" IS NULL;

-- Backfill the itemized statement already shown by the current demo.
INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':arroz'), "id", 'Arroz 5kg', 1, 2490, 2490, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Compra no mercado';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':leite'), "id", 'Leite integral', 2, 750, 1500, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Compra no mercado';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':sabonete'), "id", 'Sabonete', 1, 800, 800, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Compra no mercado';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':frutas'), "id", 'Frutas', 1, 8200, 8200, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Compra no mercado';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':coxinha'), "id", 'Coxinha', 1, 1850, 1850, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Lanche escolar';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':suco'), "id", 'Suco de laranja', 1, 1260, 1260, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Lanche escolar';

INSERT INTO "TransactionItem" ("id", "transactionId", "name", "quantity", "unitPriceCents", "totalAmountCents", "source", "updatedAt")
SELECT 'item_' || md5("id" || ':esfiha'), "id", 'Esfiha', 1, 1000, 1000, 'SANDBOX', CURRENT_TIMESTAMP
FROM "Transaction" WHERE "description" = 'Lanche escolar';

UPDATE "Transaction"
SET "detailStatus" = 'AVAILABLE'
WHERE "id" IN (SELECT DISTINCT "transactionId" FROM "TransactionItem");
