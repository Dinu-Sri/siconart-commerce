-- AlterTable
ALTER TABLE "BrandAgentCertificate" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "BrandAgentCertificate_archivedAt_idx" ON "BrandAgentCertificate"("archivedAt");
