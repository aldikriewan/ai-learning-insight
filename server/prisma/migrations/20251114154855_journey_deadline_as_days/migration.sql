/*
  Warnings:

  - The `deadline` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `trial_deadline` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "developer_journeys" DROP COLUMN "deadline",
ADD COLUMN     "deadline" INTEGER,
DROP COLUMN "trial_deadline",
ADD COLUMN     "trial_deadline" INTEGER;
