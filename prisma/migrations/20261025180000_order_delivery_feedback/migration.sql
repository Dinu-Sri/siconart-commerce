-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveredAt" TIMESTAMP(3);

-- CreateEnum
CREATE TYPE "OrderFeedbackStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "OrderFeedbackInvite" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderFeedbackInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFeedback" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "OrderFeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "OrderFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFeedbackImage" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderFeedbackImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFeedbackProduct" (
    "feedbackId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "OrderFeedbackProduct_pkey" PRIMARY KEY ("feedbackId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderFeedbackInvite_orderId_key" ON "OrderFeedbackInvite"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderFeedbackInvite_token_key" ON "OrderFeedbackInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "OrderFeedback_orderId_key" ON "OrderFeedback"("orderId");

-- CreateIndex
CREATE INDEX "OrderFeedback_status_idx" ON "OrderFeedback"("status");

-- CreateIndex
CREATE INDEX "OrderFeedbackImage_feedbackId_idx" ON "OrderFeedbackImage"("feedbackId");

-- CreateIndex
CREATE INDEX "OrderFeedbackProduct_productId_idx" ON "OrderFeedbackProduct"("productId");

-- AddForeignKey
ALTER TABLE "OrderFeedbackInvite" ADD CONSTRAINT "OrderFeedbackInvite_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFeedback" ADD CONSTRAINT "OrderFeedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFeedbackImage" ADD CONSTRAINT "OrderFeedbackImage_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "OrderFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFeedbackProduct" ADD CONSTRAINT "OrderFeedbackProduct_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "OrderFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFeedbackProduct" ADD CONSTRAINT "OrderFeedbackProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
