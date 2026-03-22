-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "vehicleYear" TEXT,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "vin" TEXT,
    "engineModel" TEXT,
    "urgency" TEXT NOT NULL,
    "neededBy" TEXT,
    "preferredCondition" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "partsNeeded" TEXT NOT NULL,
    "repairContext" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "quoteTotal" DECIMAL(65,30),
    "quoteNotes" TEXT,
    "quotedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRequest_requestNumber_key" ON "QuoteRequest"("requestNumber");
