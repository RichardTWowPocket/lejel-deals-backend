-- CreateTable
CREATE TABLE "qr_code_activities" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "couponId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_code_activities_pkey" PRIMARY KEY ("id")
);
