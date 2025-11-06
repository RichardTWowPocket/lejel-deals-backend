/*
  Warnings:

  - The values [STAFF,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `staffId` on the `redemptions` table. All the data in the column will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MerchantRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'SUPERVISOR', 'CASHIER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CUSTOMER', 'MERCHANT', 'SUPER_ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."redemptions" DROP CONSTRAINT "redemptions_staffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."staff" DROP CONSTRAINT "staff_merchantId_fkey";

-- DropIndex
DROP INDEX "public"."redemptions_staffId_idx";

-- AlterTable
ALTER TABLE "merchant_users" ADD COLUMN     "merchantRole" "MerchantRole" NOT NULL DEFAULT 'CASHIER',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "permissions" JSONB;

-- AlterTable
ALTER TABLE "redemptions" DROP COLUMN "staffId",
ADD COLUMN     "redeemedByUserId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT,
ALTER COLUMN "hashedPassword" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."staff";

-- DropEnum
DROP TYPE "public"."StaffRole";

-- CreateIndex
CREATE INDEX "redemptions_redeemedByUserId_idx" ON "redemptions"("redeemedByUserId");

-- CreateIndex
CREATE INDEX "users_providerId_idx" ON "users"("providerId");

-- AddForeignKey
ALTER TABLE "redemptions" ADD CONSTRAINT "redemptions_redeemedByUserId_fkey" FOREIGN KEY ("redeemedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
