/*
  Warnings:

  - Added the required column `dealPrice` to the `deals` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add the column as nullable first
ALTER TABLE "deals" ADD COLUMN "dealPrice" DECIMAL(10,2);

-- Step 2: Set default dealPrice to 80% of discountPrice (20% discount) for existing records
UPDATE "deals" SET "dealPrice" = ROUND("discountPrice" * 0.8, 2) WHERE "dealPrice" IS NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE "deals" ALTER COLUMN "dealPrice" SET NOT NULL;
