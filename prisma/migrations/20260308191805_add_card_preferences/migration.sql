-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "allowContactless" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowOnlinePurchase" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowPhysicalPurchase" BOOLEAN NOT NULL DEFAULT true;
