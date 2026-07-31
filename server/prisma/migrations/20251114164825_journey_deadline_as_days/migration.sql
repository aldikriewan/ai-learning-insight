/*
  Warnings:

  - The `requirements` column on the `developer_journey_tutorials` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `submit_only_requirements` column on the `developer_journey_tutorials` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `discount_ends_at` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "developer_journey_tutorials" DROP COLUMN "requirements",
ADD COLUMN     "requirements" JSONB,
DROP COLUMN "submit_only_requirements",
ADD COLUMN     "submit_only_requirements" BOOLEAN;

-- AlterTable
ALTER TABLE "developer_journeys" DROP COLUMN "discount_ends_at",
ADD COLUMN     "discount_ends_at" TIMESTAMP(3);
