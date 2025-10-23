-- CreateIndex
CREATE INDEX "coupons_orderId_idx" ON "coupons"("orderId");

-- CreateIndex
CREATE INDEX "coupons_dealId_idx" ON "coupons"("dealId");

-- CreateIndex
CREATE INDEX "coupons_status_idx" ON "coupons"("status");

-- CreateIndex
CREATE INDEX "coupons_expiresAt_idx" ON "coupons"("expiresAt");

-- CreateIndex
CREATE INDEX "coupons_status_expiresAt_idx" ON "coupons"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "deals_status_idx" ON "deals"("status");

-- CreateIndex
CREATE INDEX "deals_merchantId_idx" ON "deals"("merchantId");

-- CreateIndex
CREATE INDEX "deals_categoryId_idx" ON "deals"("categoryId");

-- CreateIndex
CREATE INDEX "deals_dealPrice_idx" ON "deals"("dealPrice");

-- CreateIndex
CREATE INDEX "deals_soldQuantity_idx" ON "deals"("soldQuantity");

-- CreateIndex
CREATE INDEX "deals_createdAt_idx" ON "deals"("createdAt");

-- CreateIndex
CREATE INDEX "deals_validFrom_idx" ON "deals"("validFrom");

-- CreateIndex
CREATE INDEX "deals_validUntil_idx" ON "deals"("validUntil");

-- CreateIndex
CREATE INDEX "deals_status_validFrom_validUntil_idx" ON "deals"("status", "validFrom", "validUntil");

-- CreateIndex
CREATE INDEX "deals_status_merchantId_idx" ON "deals"("status", "merchantId");

-- CreateIndex
CREATE INDEX "deals_status_categoryId_idx" ON "deals"("status", "categoryId");

-- CreateIndex
CREATE INDEX "deals_status_dealPrice_idx" ON "deals"("status", "dealPrice");

-- CreateIndex
CREATE INDEX "deals_status_soldQuantity_idx" ON "deals"("status", "soldQuantity");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_dealId_idx" ON "orders"("dealId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "orders_customerId_status_idx" ON "orders"("customerId", "status");

-- CreateIndex
CREATE INDEX "orders_dealId_status_idx" ON "orders"("dealId", "status");

-- CreateIndex
CREATE INDEX "redemptions_couponId_idx" ON "redemptions"("couponId");

-- CreateIndex
CREATE INDEX "redemptions_staffId_idx" ON "redemptions"("staffId");

-- CreateIndex
CREATE INDEX "redemptions_status_idx" ON "redemptions"("status");

-- CreateIndex
CREATE INDEX "redemptions_redeemedAt_idx" ON "redemptions"("redeemedAt");
