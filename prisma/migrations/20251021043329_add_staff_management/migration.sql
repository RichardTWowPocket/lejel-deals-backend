/*
  Warnings:

  - The `role` column on the `staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `pin` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('MANAGER', 'CASHIER', 'SUPERVISOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."staff" DROP CONSTRAINT "staff_merchantId_fkey";

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "permissions" JSONB,
ALTER COLUMN "merchantId" DROP NOT NULL,
ALTER COLUMN "pin" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "StaffRole" NOT NULL DEFAULT 'CASHIER';

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
