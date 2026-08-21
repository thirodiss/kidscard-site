CREATE TYPE "WalletBucketType" AS ENUM ('PRIMARY', 'PENSION', 'ALLOWANCE', 'CLEARING');
CREATE TYPE "LedgerEntryDirection" AS ENUM ('DEBIT', 'CREDIT');
CREATE TYPE "OnboardingStatus" AS ENUM ('SUBMITTED', 'KYC_PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "WalletBucket" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "dependentId" TEXT,
  "type" "WalletBucketType" NOT NULL,
  "name" TEXT NOT NULL,
  "balanceCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WalletBucket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LedgerJournal" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "referenceType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LedgerJournal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LedgerEntry" (
  "id" TEXT NOT NULL,
  "journalId" TEXT NOT NULL,
  "bucketId" TEXT NOT NULL,
  "direction" "LedgerEntryDirection" NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OnboardingApplication" (
  "id" TEXT NOT NULL,
  "guardianName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "intendedUse" TEXT NOT NULL,
  "dependentCount" INTEGER NOT NULL,
  "status" "OnboardingStatus" NOT NULL DEFAULT 'SUBMITTED',
  "consentVersion" TEXT NOT NULL,
  "privacyConsentAt" TIMESTAMP(3) NOT NULL,
  "termsConsentAt" TIMESTAMP(3) NOT NULL,
  "guardianDeclarationAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OnboardingApplication_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Transfer"
  ADD COLUMN "sourceBucketId" TEXT,
  ADD COLUMN "destinationBucketId" TEXT,
  ADD COLUMN "journalId" TEXT;

ALTER TABLE "Card" ADD COLUMN "spendingBucketId" TEXT;

CREATE UNIQUE INDEX "WalletBucket_dependentId_type_key" ON "WalletBucket"("dependentId", "type");
CREATE UNIQUE INDEX "WalletBucket_system_type_key" ON "WalletBucket"("accountId", "type") WHERE "dependentId" IS NULL;
CREATE INDEX "WalletBucket_accountId_type_idx" ON "WalletBucket"("accountId", "type");
CREATE UNIQUE INDEX "LedgerJournal_idempotencyKey_key" ON "LedgerJournal"("idempotencyKey");
CREATE INDEX "LedgerJournal_accountId_createdAt_idx" ON "LedgerJournal"("accountId", "createdAt");
CREATE INDEX "LedgerEntry_journalId_idx" ON "LedgerEntry"("journalId");
CREATE INDEX "LedgerEntry_bucketId_createdAt_idx" ON "LedgerEntry"("bucketId", "createdAt");
CREATE INDEX "OnboardingApplication_email_createdAt_idx" ON "OnboardingApplication"("email", "createdAt");
CREATE INDEX "OnboardingApplication_status_createdAt_idx" ON "OnboardingApplication"("status", "createdAt");
CREATE UNIQUE INDEX "Transfer_journalId_key" ON "Transfer"("journalId");

ALTER TABLE "WalletBucket" ADD CONSTRAINT "WalletBucket_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WalletBucket" ADD CONSTRAINT "WalletBucket_dependentId_fkey"
  FOREIGN KEY ("dependentId") REFERENCES "Dependent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LedgerJournal" ADD CONSTRAINT "LedgerJournal_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_journalId_fkey"
  FOREIGN KEY ("journalId") REFERENCES "LedgerJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_bucketId_fkey"
  FOREIGN KEY ("bucketId") REFERENCES "WalletBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sourceBucketId_fkey"
  FOREIGN KEY ("sourceBucketId") REFERENCES "WalletBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_destinationBucketId_fkey"
  FOREIGN KEY ("destinationBucketId") REFERENCES "WalletBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_journalId_fkey"
  FOREIGN KEY ("journalId") REFERENCES "LedgerJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Card" ADD CONSTRAINT "Card_spendingBucketId_fkey"
  FOREIGN KEY ("spendingBucketId") REFERENCES "WalletBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "WalletBucket" ("id", "accountId", "dependentId", "type", "name", "balanceCents", "updatedAt")
SELECT 'primary-' || "id", "id", NULL, 'PRIMARY', 'Saldo principal', "balanceCents", CURRENT_TIMESTAMP
FROM "WalletAccount";

INSERT INTO "WalletBucket" ("id", "accountId", "dependentId", "type", "name", "balanceCents", "updatedAt")
SELECT 'clearing-' || "id", "id", NULL, 'CLEARING', 'Liquidação externa', 0, CURRENT_TIMESTAMP
FROM "WalletAccount";

UPDATE "Card" c
SET "spendingBucketId" = 'primary-' || c."accountId";

INSERT INTO "WalletBucket" ("id", "accountId", "dependentId", "type", "name", "balanceCents", "updatedAt")
SELECT 'pension-' || d."id", d."accountId", d."id", 'PENSION', 'Pensão', 0, CURRENT_TIMESTAMP
FROM "Dependent" d;

INSERT INTO "WalletBucket" ("id", "accountId", "dependentId", "type", "name", "balanceCents", "updatedAt")
SELECT 'allowance-' || d."id", d."accountId", d."id", 'ALLOWANCE', 'Mesada', COALESCE(SUM(t."amountCents"), 0), CURRENT_TIMESTAMP
FROM "Dependent" d
LEFT JOIN "Transfer" t ON t."dependentId" = d."id"
GROUP BY d."id", d."accountId";

INSERT INTO "LedgerJournal" ("id", "accountId", "idempotencyKey", "referenceType", "description", "createdAt")
SELECT 'journal-' || t."id", t."fromAccountId", 'legacy-transfer-' || t."id", 'DEPENDENT_TRANSFER',
       'Migração de transferência para dependente', t."createdAt"
FROM "Transfer" t;

INSERT INTO "LedgerEntry" ("id", "journalId", "bucketId", "direction", "amountCents", "createdAt")
SELECT 'entry-debit-' || t."id", 'journal-' || t."id", 'primary-' || t."fromAccountId", 'DEBIT', t."amountCents", t."createdAt"
FROM "Transfer" t;

INSERT INTO "LedgerEntry" ("id", "journalId", "bucketId", "direction", "amountCents", "createdAt")
SELECT 'entry-credit-' || t."id", 'journal-' || t."id", 'allowance-' || t."dependentId", 'CREDIT', t."amountCents", t."createdAt"
FROM "Transfer" t;

UPDATE "Transfer" t SET
  "sourceBucketId" = 'primary-' || t."fromAccountId",
  "destinationBucketId" = 'allowance-' || t."dependentId",
  "journalId" = 'journal-' || t."id";

UPDATE "WalletAccount" a
SET "balanceCents" = a."balanceCents" + totals."sent"
FROM (
  SELECT "fromAccountId", COALESCE(SUM("amountCents"), 0)::INTEGER AS "sent"
  FROM "Transfer"
  GROUP BY "fromAccountId"
) totals
WHERE a."id" = totals."fromAccountId";
