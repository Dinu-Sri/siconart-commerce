-- CreateTable
CREATE TABLE "BrandAgent" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "officialEn" TEXT NOT NULL,
    "officialZh" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAgentCertificate" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "periodKind" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandAgentCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandAgentCertificate_code_key" ON "BrandAgentCertificate"("code");

-- CreateIndex
CREATE INDEX "BrandAgentCertificate_agentId_idx" ON "BrandAgentCertificate"("agentId");

-- CreateIndex
CREATE INDEX "BrandAgentCertificate_endsAt_idx" ON "BrandAgentCertificate"("endsAt");

-- AddForeignKey
ALTER TABLE "BrandAgentCertificate" ADD CONSTRAINT "BrandAgentCertificate_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "BrandAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
