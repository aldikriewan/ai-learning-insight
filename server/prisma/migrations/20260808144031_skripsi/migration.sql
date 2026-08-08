-- AlterTable
ALTER TABLE "developer_journey_completions" ADD COLUMN     "enrolling_times" INTEGER DEFAULT 1,
ADD COLUMN     "last_enrolled_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "developer_journey_submissions" ADD COLUMN     "pass_auto_checker" BOOLEAN DEFAULT false,
ADD COLUMN     "submission_duration" INTEGER;
