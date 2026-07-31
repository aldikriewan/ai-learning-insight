/*
  Warnings:

  - The `discount_ends_at` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "developer_journeys" DROP COLUMN "discount_ends_at",
ADD COLUMN     "discount_ends_at" INTEGER;
