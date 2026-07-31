/*
  Warnings:

  - The primary key for the `developer_journey_completions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `enrolling_times` on the `developer_journey_completions` table. All the data in the column will be lost.
  - You are about to drop the column `enrollments_at` on the `developer_journey_completions` table. All the data in the column will be lost.
  - You are about to drop the column `last_enrolled_at` on the `developer_journey_completions` table. All the data in the column will be lost.
  - The `id` column on the `developer_journey_completions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `developer_journey_submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_comment` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `as_trial_subscriber` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `current_reviewer` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `ended_review_at` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `first_opened_at` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `pass_auto_checker` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `started_review_at` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `submission_duration` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `version_id` on the `developer_journey_submissions` table. All the data in the column will be lost.
  - The `id` column on the `developer_journey_submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reviewer_id` column on the `developer_journey_submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `developer_journey_trackings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `developer_journey_status_hash` on the `developer_journey_trackings` table. All the data in the column will be lost.
  - The `id` column on the `developer_journey_trackings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `developer_journey_tutorials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `developer_journey_tutorials` table. All the data in the column will be lost.
  - You are about to drop the column `is_main_module` on the `developer_journey_tutorials` table. All the data in the column will be lost.
  - You are about to drop the column `submit_only_requirements` on the `developer_journey_tutorials` table. All the data in the column will be lost.
  - The `id` column on the `developer_journey_tutorials` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `developer_journeys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `banner_path` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `discount_ends_at` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `graduation` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `installment_plan_id` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `logo_path` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `media_cover` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `partner_logo` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `required_xp` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `reviewer_incentive` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `teaching_methods` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `trial_deadline` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `video_subtitle` on the `developer_journeys` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `developer_journeys` table. All the data in the column will be lost.
  - The `id` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `instructor_id` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reviewer_id` column on the `developer_journeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exam_registrations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deadline_at` on the `exam_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `exam_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `exam_finished_at` on the `exam_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `retake_limit_at` on the `exam_registrations` table. All the data in the column will be lost.
  - The `id` column on the `exam_registrations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `exam_module_id` column on the `exam_registrations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `exam_results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `look_report_at` on the `exam_results` table. All the data in the column will be lost.
  - The `id` column on the `exam_results` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ama` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_verification_status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_verified_with` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribe_link` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verified_certificate_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verified_identity_document` on the `users` table. All the data in the column will be lost.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `city_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[developer_id,tutorial_id]` on the table `developer_journey_trackings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exam_registration_id]` on the table `exam_results` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `user_id` on the `developer_journey_completions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `journey_id` on the `developer_journey_completions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `journey_id` on the `developer_journey_submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quiz_id` on the `developer_journey_submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `submitter_id` on the `developer_journey_submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `journey_id` on the `developer_journey_trackings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tutorial_id` on the `developer_journey_trackings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `developer_id` on the `developer_journey_trackings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `developer_journey_id` on the `developer_journey_tutorials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `trial` on table `developer_journey_tutorials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `point` on table `developer_journeys` required. This step will fail if there are existing NULL values in that column.
  - Made the column `required_point` on table `developer_journeys` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficulty` on table `developer_journeys` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `developer_journeys` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tutorial_id` to the `exam_registrations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `examinees_id` on the `exam_registrations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `status` on table `exam_registrations` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `exam_results` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `exam_registration_id` on the `exam_results` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `user_role` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "developer_journey_submissions" DROP CONSTRAINT "developer_journey_submissions_submitter_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journey_trackings" DROP CONSTRAINT "developer_journey_trackings_developer_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journey_trackings" DROP CONSTRAINT "developer_journey_trackings_journey_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journey_trackings" DROP CONSTRAINT "developer_journey_trackings_tutorial_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journey_tutorials" DROP CONSTRAINT "developer_journey_tutorials_author_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journey_tutorials" DROP CONSTRAINT "developer_journey_tutorials_developer_journey_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journeys" DROP CONSTRAINT "developer_journeys_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "developer_journeys" DROP CONSTRAINT "developer_journeys_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_registrations" DROP CONSTRAINT "exam_registrations_examinees_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_exam_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_city_id_fkey";

-- DropIndex
DROP INDEX "developer_journey_completions_created_at_idx";

-- DropIndex
DROP INDEX "developer_journey_submissions_journey_id_status_idx";

-- DropIndex
DROP INDEX "developer_journey_submissions_reviewer_id_idx";

-- DropIndex
DROP INDEX "developer_journey_submissions_submitter_id_created_at_idx";

-- DropIndex
DROP INDEX "developer_journey_trackings_developer_id_first_opened_at_idx";

-- DropIndex
DROP INDEX "developer_journey_trackings_journey_id_tutorial_id_idx";

-- DropIndex
DROP INDEX "developer_journey_tutorials_author_id_idx";

-- DropIndex
DROP INDEX "developer_journey_tutorials_developer_journey_id_position_key";

-- DropIndex
DROP INDEX "developer_journey_tutorials_developer_journey_id_status_idx";

-- DropIndex
DROP INDEX "developer_journeys_instructor_id_idx";

-- DropIndex
DROP INDEX "developer_journeys_reviewer_id_idx";

-- DropIndex
DROP INDEX "developer_journeys_status_listed_idx";

-- DropIndex
DROP INDEX "exam_registrations_exam_module_id_idx";

-- DropIndex
DROP INDEX "exam_registrations_examinees_id_created_at_idx";

-- DropIndex
DROP INDEX "exam_registrations_tutorial_id_idx";

-- DropIndex
DROP INDEX "exam_results_created_at_idx";

-- DropIndex
DROP INDEX "exam_results_exam_registration_id_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- DropIndex
DROP INDEX "users_user_role_idx";

-- AlterTable
ALTER TABLE "developer_journey_completions" DROP CONSTRAINT "developer_journey_completions_pkey",
DROP COLUMN "enrolling_times",
DROP COLUMN "enrollments_at",
DROP COLUMN "last_enrolled_at",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "journey_id",
ADD COLUMN     "journey_id" INTEGER NOT NULL,
ALTER COLUMN "avg_submission_rating" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "developer_journey_completions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "developer_journey_submissions" DROP CONSTRAINT "developer_journey_submissions_pkey",
DROP COLUMN "admin_comment",
DROP COLUMN "as_trial_subscriber",
DROP COLUMN "current_reviewer",
DROP COLUMN "ended_review_at",
DROP COLUMN "first_opened_at",
DROP COLUMN "pass_auto_checker",
DROP COLUMN "started_review_at",
DROP COLUMN "submission_duration",
DROP COLUMN "version_id",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "journey_id",
ADD COLUMN     "journey_id" INTEGER NOT NULL,
DROP COLUMN "quiz_id",
ADD COLUMN     "quiz_id" INTEGER NOT NULL,
DROP COLUMN "submitter_id",
ADD COLUMN     "submitter_id" INTEGER NOT NULL,
DROP COLUMN "reviewer_id",
ADD COLUMN     "reviewer_id" INTEGER,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "developer_journey_submissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "developer_journey_trackings" DROP CONSTRAINT "developer_journey_trackings_pkey",
DROP COLUMN "developer_journey_status_hash",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "journey_id",
ADD COLUMN     "journey_id" INTEGER NOT NULL,
DROP COLUMN "tutorial_id",
ADD COLUMN     "tutorial_id" INTEGER NOT NULL,
DROP COLUMN "developer_id",
ADD COLUMN     "developer_id" INTEGER NOT NULL,
ALTER COLUMN "last_viewed" DROP NOT NULL,
ALTER COLUMN "first_opened_at" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "developer_journey_trackings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "developer_journey_tutorials" DROP CONSTRAINT "developer_journey_tutorials_pkey",
DROP COLUMN "author_id",
DROP COLUMN "is_main_module",
DROP COLUMN "submit_only_requirements",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "developer_journey_id",
ADD COLUMN     "developer_journey_id" INTEGER NOT NULL,
ALTER COLUMN "trial" SET NOT NULL,
ADD CONSTRAINT "developer_journey_tutorials_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "developer_journeys" DROP CONSTRAINT "developer_journeys_pkey",
DROP COLUMN "banner_path",
DROP COLUMN "deadline",
DROP COLUMN "discount",
DROP COLUMN "discount_ends_at",
DROP COLUMN "graduation",
DROP COLUMN "installment_plan_id",
DROP COLUMN "logo_path",
DROP COLUMN "media_cover",
DROP COLUMN "partner_logo",
DROP COLUMN "platform_id",
DROP COLUMN "position",
DROP COLUMN "required_xp",
DROP COLUMN "reviewer_incentive",
DROP COLUMN "teaching_methods",
DROP COLUMN "trial_deadline",
DROP COLUMN "type",
DROP COLUMN "video_subtitle",
DROP COLUMN "xp",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "point" SET NOT NULL,
ALTER COLUMN "required_point" SET NOT NULL,
ALTER COLUMN "difficulty" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
DROP COLUMN "instructor_id",
ADD COLUMN     "instructor_id" INTEGER,
DROP COLUMN "reviewer_id",
ADD COLUMN     "reviewer_id" INTEGER,
ADD CONSTRAINT "developer_journeys_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_registrations" DROP CONSTRAINT "exam_registrations_pkey",
DROP COLUMN "deadline_at",
DROP COLUMN "deleted_at",
DROP COLUMN "exam_finished_at",
DROP COLUMN "retake_limit_at",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "exam_module_id",
ADD COLUMN     "exam_module_id" INTEGER,
DROP COLUMN "tutorial_id",
ADD COLUMN     "tutorial_id" INTEGER NOT NULL,
DROP COLUMN "examinees_id",
ADD COLUMN     "examinees_id" INTEGER NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ADD CONSTRAINT "exam_registrations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_pkey",
DROP COLUMN "look_report_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "exam_registration_id",
ADD COLUMN     "exam_registration_id" INTEGER NOT NULL,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "ama",
DROP COLUMN "phone_verification_status",
DROP COLUMN "phone_verified_with",
DROP COLUMN "unsubscribe_link",
DROP COLUMN "verified_certificate_name",
DROP COLUMN "verified_identity_document",
ADD COLUMN     "password_hash" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "display_name" DROP NOT NULL,
ALTER COLUMN "user_role" SET NOT NULL,
ALTER COLUMN "user_role" SET DEFAULT 'student',
DROP COLUMN "city_id",
ADD COLUMN     "city_id" INTEGER,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "cities";

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" SERIAL NOT NULL,
    "tutorial_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "time_taken_seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learning_insights" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "insight_key" TEXT NOT NULL,
    "insight_val" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_learning_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_learning_insights_user_id_idx" ON "user_learning_insights"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "developer_journey_completions_user_id_journey_id_key" ON "developer_journey_completions"("user_id", "journey_id");

-- CreateIndex
CREATE INDEX "developer_journey_trackings_developer_id_journey_id_tutoria_idx" ON "developer_journey_trackings"("developer_id", "journey_id", "tutorial_id");

-- CreateIndex
CREATE UNIQUE INDEX "developer_journey_trackings_developer_id_tutorial_id_key" ON "developer_journey_trackings"("developer_id", "tutorial_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_exam_registration_id_key" ON "exam_results"("exam_registration_id");

-- AddForeignKey
ALTER TABLE "developer_journeys" ADD CONSTRAINT "developer_journeys_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journeys" ADD CONSTRAINT "developer_journeys_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_tutorials" ADD CONSTRAINT "developer_journey_tutorials_developer_journey_id_fkey" FOREIGN KEY ("developer_journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "developer_journey_tutorials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_submissions" ADD CONSTRAINT "developer_journey_submissions_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_submissions" ADD CONSTRAINT "developer_journey_submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "developer_journey_tutorials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_submissions" ADD CONSTRAINT "developer_journey_submissions_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_completions" ADD CONSTRAINT "developer_journey_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_completions" ADD CONSTRAINT "developer_journey_completions_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "developer_journey_tutorials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "developer_journey_tutorials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_examinees_id_fkey" FOREIGN KEY ("examinees_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_registration_id_fkey" FOREIGN KEY ("exam_registration_id") REFERENCES "exam_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_insights" ADD CONSTRAINT "user_learning_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
