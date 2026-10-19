-- AlterTable
ALTER TABLE "DiscountCode" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE "DiscountCode" ADD COLUMN "allowedEmail" TEXT;
ALTER TABLE "DiscountCode" ADD COLUMN "sourceOrderId" TEXT;

-- CreateIndex
CREATE INDEX "DiscountCode_allowedEmail_idx" ON "DiscountCode"("allowedEmail");
CREATE INDEX "DiscountCode_sourceOrderId_idx" ON "DiscountCode"("sourceOrderId");

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "recoveryCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "recoverySentAt" TIMESTAMP(3);
