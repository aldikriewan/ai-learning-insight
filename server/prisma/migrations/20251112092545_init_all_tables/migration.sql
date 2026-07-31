-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "user_role" TEXT,
    "user_verification_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "remember_token" TEXT,
    "image_path" TEXT,
    "city" TEXT,
    "city_id" TEXT,
    "custom_city" TEXT,
    "unsubscribe_link" TEXT,
    "tz" TEXT,
    "verified_at" TIMESTAMP(3),
    "ama" TEXT,
    "phone_verification_status" TEXT,
    "phone_verified_with" TEXT,
    "verified_certificate_name" TEXT,
    "verified_identity_document" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_journeys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "point" INTEGER,
    "required_point" INTEGER,
    "xp" INTEGER,
    "required_xp" INTEGER,
    "difficulty" TEXT,
    "image_path" TEXT,
    "status" TEXT,
    "listed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "logo_path" TEXT,
    "banner_path" TEXT,
    "platform_id" TEXT,
    "instructor_id" TEXT,
    "reviewer_id" TEXT,
    "deadline" TIMESTAMP(3),
    "trial_deadline" TIMESTAMP(3),
    "reviewer_incentive" DECIMAL(18,2),
    "type" TEXT,
    "discount" INTEGER,
    "discount_ends_at" TIMESTAMP(3),
    "media_cover" TEXT,
    "installment_plan_id" TEXT,
    "graduation" TEXT,
    "position" INTEGER,
    "hours_to_study" INTEGER,
    "video_subtitle" TEXT,
    "partner_logo" TEXT,
    "teaching_methods" TEXT,

    CONSTRAINT "developer_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_journey_tutorials" (
    "id" TEXT NOT NULL,
    "developer_journey_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "requirements" JSONB,
    "submit_only_requirements" BOOLEAN,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "trial" BOOLEAN DEFAULT false,
    "author_id" TEXT,
    "is_main_module" BOOLEAN DEFAULT false,

    CONSTRAINT "developer_journey_tutorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_journey_trackings" (
    "id" TEXT NOT NULL,
    "journey_id" TEXT NOT NULL,
    "tutorial_id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "status" TEXT,
    "last_viewed" TIMESTAMP(3) NOT NULL,
    "first_opened_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "developer_journey_status_hash" TEXT,

    CONSTRAINT "developer_journey_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_journey_submissions" (
    "id" TEXT NOT NULL,
    "journey_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "submitter_id" TEXT NOT NULL,
    "version_id" TEXT,
    "app_link" TEXT,
    "app_comment" TEXT,
    "status" TEXT NOT NULL,
    "as_trial_subscriber" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "admin_comment" TEXT,
    "reviewer_id" TEXT,
    "current_reviewer" TEXT,
    "started_review_at" TIMESTAMP(3),
    "ended_review_at" TIMESTAMP(3),
    "rating" INTEGER,
    "note" TEXT,
    "first_opened_at" TIMESTAMP(3),
    "submission_duration" INTEGER,
    "pass_auto_checker" BOOLEAN,

    CONSTRAINT "developer_journey_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_journey_completions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "journey_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "enrolling_times" INTEGER,
    "enrollments_at" JSONB,
    "last_enrolled_at" TIMESTAMP(3),
    "study_duration" INTEGER,
    "avg_submission_rating" INTEGER,

    CONSTRAINT "developer_journey_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_registrations" (
    "id" TEXT NOT NULL,
    "exam_module_id" TEXT,
    "tutorial_id" TEXT,
    "examinees_id" TEXT NOT NULL,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deadline_at" TIMESTAMP(3),
    "retake_limit_at" TIMESTAMP(3),
    "exam_finished_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exam_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" TEXT NOT NULL,
    "exam_registration_id" TEXT NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "is_passed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "look_report_at" TIMESTAMP(3),

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_user_role_idx" ON "users"("user_role");

-- CreateIndex
CREATE INDEX "developer_journeys_status_listed_idx" ON "developer_journeys"("status", "listed");

-- CreateIndex
CREATE INDEX "developer_journeys_instructor_id_idx" ON "developer_journeys"("instructor_id");

-- CreateIndex
CREATE INDEX "developer_journeys_reviewer_id_idx" ON "developer_journeys"("reviewer_id");

-- CreateIndex
CREATE INDEX "developer_journey_tutorials_developer_journey_id_status_idx" ON "developer_journey_tutorials"("developer_journey_id", "status");

-- CreateIndex
CREATE INDEX "developer_journey_tutorials_author_id_idx" ON "developer_journey_tutorials"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "developer_journey_tutorials_developer_journey_id_position_key" ON "developer_journey_tutorials"("developer_journey_id", "position");

-- CreateIndex
CREATE INDEX "developer_journey_trackings_developer_id_first_opened_at_idx" ON "developer_journey_trackings"("developer_id", "first_opened_at");

-- CreateIndex
CREATE INDEX "developer_journey_trackings_journey_id_tutorial_id_idx" ON "developer_journey_trackings"("journey_id", "tutorial_id");

-- CreateIndex
CREATE INDEX "developer_journey_submissions_journey_id_status_idx" ON "developer_journey_submissions"("journey_id", "status");

-- CreateIndex
CREATE INDEX "developer_journey_submissions_submitter_id_created_at_idx" ON "developer_journey_submissions"("submitter_id", "created_at");

-- CreateIndex
CREATE INDEX "developer_journey_submissions_reviewer_id_idx" ON "developer_journey_submissions"("reviewer_id");

-- CreateIndex
CREATE INDEX "developer_journey_completions_created_at_idx" ON "developer_journey_completions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "developer_journey_completions_user_id_journey_id_key" ON "developer_journey_completions"("user_id", "journey_id");

-- CreateIndex
CREATE INDEX "exam_registrations_examinees_id_created_at_idx" ON "exam_registrations"("examinees_id", "created_at");

-- CreateIndex
CREATE INDEX "exam_registrations_exam_module_id_idx" ON "exam_registrations"("exam_module_id");

-- CreateIndex
CREATE INDEX "exam_registrations_tutorial_id_idx" ON "exam_registrations"("tutorial_id");

-- CreateIndex
CREATE INDEX "exam_results_exam_registration_id_idx" ON "exam_results"("exam_registration_id");

-- CreateIndex
CREATE INDEX "exam_results_created_at_idx" ON "exam_results"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journeys" ADD CONSTRAINT "developer_journeys_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journeys" ADD CONSTRAINT "developer_journeys_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_tutorials" ADD CONSTRAINT "developer_journey_tutorials_developer_journey_id_fkey" FOREIGN KEY ("developer_journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_tutorials" ADD CONSTRAINT "developer_journey_tutorials_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "developer_journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "developer_journey_tutorials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_trackings" ADD CONSTRAINT "developer_journey_trackings_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_journey_submissions" ADD CONSTRAINT "developer_journey_submissions_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_registrations" ADD CONSTRAINT "exam_registrations_examinees_id_fkey" FOREIGN KEY ("examinees_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_registration_id_fkey" FOREIGN KEY ("exam_registration_id") REFERENCES "exam_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
