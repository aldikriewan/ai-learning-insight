const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class LearningService {
  // Enroll / Daftar Kelas
  async enrollCourse(userId, journeyId) {
    const journey = await prisma.developer_journeys.findFirst({
      where: { id: journeyId, status: "published" },
    });
    if (!journey) throw Boom.notFound("Kelas tidak ditemukan");

    const existing = await prisma.enrollments.findUnique({
      where: { user_id_journey_id: { user_id: userId, journey_id: journeyId } },
    });
    if (existing) throw Boom.conflict("Anda sudah terdaftar");

    return await prisma.enrollments.create({
      data: { user_id: userId, journey_id: journeyId },
    });
  }

  // Akses Materi (Tracking)
  async getModuleContent(tutorialId, userId) {
    const tutorial = await prisma.developer_journey_tutorials.findUnique({
      where: { id: tutorialId },
    });
    if (!tutorial) throw Boom.notFound("Materi tidak ditemukan");

    const journeyId = tutorial.developer_journey_id;

    // 2. Cek Enrollment
    const enrollment = await prisma.enrollments.findUnique({
      where: { user_id_journey_id: { user_id: userId, journey_id: journeyId } },
    });
    if (!enrollment)
      throw Boom.forbidden("Silakan enroll kelas ini terlebih dahulu");

    // 3. === LOGIC REQUIREMENTS (PREREQUISITES) ===
    // Requirements disimpan sebagai JSON Array berisi ID tutorial yang harus selesai
    // Contoh: [10, 11] artinya tutorial ID 10 dan 11 harus status 'finished'
    let reqIds = [];
    try {
      // Parsing aman
      if (tutorial.requirements) {
        reqIds =
          typeof tutorial.requirements === "string"
            ? JSON.parse(tutorial.requirements)
            : tutorial.requirements;
      }
    } catch (e) {
      reqIds = [];
    }

    // Jika ada syarat, cek apakah user sudah menyelesaikannya
    if (Array.isArray(reqIds) && reqIds.length > 0) {
      const finishedTracks = await prisma.developer_journey_trackings.findMany({
        where: {
          developer_id: userId,
          tutorial_id: { in: reqIds },
          status: "finished", // Wajib finished
        },
        select: { tutorial_id: true },
      });

      const finishedIds = finishedTracks.map((t) => t.tutorial_id);
      const missingIds = reqIds.filter((reqId) => !finishedIds.includes(reqId));

      // Jika jumlah yg selesai < jumlah syarat, tolak akses
      if (missingIds.length > 0) {
        const missingModules =
          await prisma.developer_journey_tutorials.findMany({
            where: { id: { in: missingIds } },
            select: { id: true, title: true, type: true, position: true },
            orderBy: { position: "asc" },
          });

        // D. Buat Custom Error dengan Data Tambahan
        const error = Boom.forbidden("Prasyarat belum terpenuhi");

        // Kita lampirkan data modul yang kurang ke dalam payload error
        error.output.payload.data = {
          missing_modules: missingModules,
          message: `Anda harus menyelesaikan modul "${missingModules[0].title}" terlebih dahulu.`,
        };

        throw error;
      }
    }

    // Update Access Time
    await prisma.enrollments.update({
      where: { id: enrollment.id },
      data: { last_accessed_at: new Date() },
    });

    const currentTracking = await prisma.developer_journey_trackings.findUnique(
      {
        where: {
          developer_id_tutorial_id: {
            developer_id: userId,
            tutorial_id: tutorialId,
          },
        },
      }
    );

    let submissionStatus = null;
    let submissionNote = null;

    if (tutorial.type === "submission") {
      const lastSubmission =
        await prisma.developer_journey_submissions.findFirst({
          where: { submitter_id: userId, quiz_id: tutorialId },
          orderBy: { created_at: "desc" },
        });
      if (lastSubmission) {
        submissionStatus = lastSubmission.status; // submitted, passed, failed
        submissionNote = lastSubmission.note;
      }
    }

    const nextModule = await prisma.developer_journey_tutorials.findFirst({
      where: {
        developer_journey_id: journeyId,
        position: { gt: tutorial.position }, // Posisi > posisi sekarang
        status: "published",
      },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    // Tracking Data
    await prisma.developer_journey_trackings.upsert({
      where: {
        developer_id_tutorial_id: {
          developer_id: userId,
          tutorial_id: tutorialId,
        },
      },
      update: { last_viewed: new Date() },
      create: {
        developer_id: userId,
        tutorial_id: tutorialId,
        journey_id: tutorial.developer_journey_id,
        status: "viewed",
        last_viewed: new Date(),
      },
    });

    return {
      ...tutorial,
      current_status: currentTracking ? currentTracking.status : "viewed",
      submission_status: submissionStatus,
      submission_note: submissionNote,
      next_tutorial_id: nextModule ? nextModule.id : null,
    };
  }

  // Submit Tugas
  async submitAssignment(
    userId,
    journeyId,
    tutorialId,
    { app_link, app_comment }
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validasi Enrollment
      const enrollment = await tx.enrollments.findUnique({
        where: {
          user_id_journey_id: { user_id: userId, journey_id: journeyId },
        },
      });
      if (!enrollment) throw Boom.forbidden("Anda belum terdaftar");

      // 2. Cek apakah sudah pernah submit? (Update atau Create)
      // Kita izinkan resubmit jika status belum passed
      const existingSub = await tx.developer_journey_submissions.findFirst({
        where: { submitter_id: userId, quiz_id: tutorialId },
      });

      let submission;
      if (existingSub) {
        submission = await tx.developer_journey_submissions.update({
          where: { id: existingSub.id },
          data: { app_link, app_comment, status: "submitted" }, // Reset jadi submitted
        });
      } else {
        submission = await tx.developer_journey_submissions.create({
          data: {
            journey_id: journeyId,
            quiz_id: tutorialId,
            submitter_id: userId,
            status: "submitted",
            app_link,
            app_comment,
          },
        });
      }

      // 3. Update Tracking jadi 'submitted' (BUKAN finished)
      // Status 'submitted' menandakan sedang direview
      await tx.developer_journey_trackings.upsert({
        where: {
          developer_id_tutorial_id: {
            developer_id: userId,
            tutorial_id: tutorialId,
          },
        },
        create: {
          developer_id: userId,
          tutorial_id: tutorialId,
          journey_id: journeyId,
          status: "submitted",
        },
        update: { status: "submitted", last_viewed: new Date() },
      });

      // 4. === CARI NEXT TUTORIAL ===
      // Agar tombol "Lanjut Belajar" berfungsi
      const nextModule = await tx.$queryRaw`
                SELECT t.id 
                FROM developer_journey_tutorials t
                LEFT JOIN developer_journey_trackings tr 
                    ON t.id = tr.tutorial_id AND tr.developer_id = ${userId} AND tr.status = 'finished'
                WHERE t.developer_journey_id = ${journeyId} 
                  AND t.status = 'published'
                  AND tr.id IS NULL
                  AND t.id != ${tutorialId} -- Pastikan bukan modul ini sendiri
                ORDER BY t.position ASC
                LIMIT 1
            `;

      return {
        ...submission,
        next_tutorial_id: nextModule[0]?.id || null,
      };
    });
  }

  async completeModule(userId, tutorialId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validasi: Ambil Info Modul & Journey
      const tutorial = await tx.developer_journey_tutorials.findUnique({
        where: { id: tutorialId },
        select: { id: true, developer_journey_id: true },
      });

      if (!tutorial) throw Boom.notFound("Modul tidak ditemukan");
      const journeyId = tutorial.developer_journey_id;

      // 2. Validasi: Cek Enrollment (Sekalian ambil enrolled_at)
      const enrollment = await tx.enrollments.findUnique({
        where: {
          user_id_journey_id: { user_id: userId, journey_id: journeyId },
        },
      });

      if (!enrollment)
        throw Boom.forbidden("Anda belum terdaftar di kelas ini");

      // 3. Action: Tandai Modul sebagai 'finished'
      await tx.developer_journey_trackings.upsert({
        where: {
          developer_id_tutorial_id: {
            developer_id: userId,
            tutorial_id: tutorialId,
          },
        },
        create: {
          developer_id: userId,
          tutorial_id: tutorialId,
          journey_id: journeyId,
          status: "finished",
          last_viewed: new Date(),
        },
        update: {
          status: "finished",
          last_viewed: new Date(),
        },
      });

      // 4. Kalkulasi Progress
      const totalModules = await tx.developer_journey_tutorials.count({
        where: { developer_journey_id: journeyId, status: "published" },
      });

      const finishedModules = await tx.developer_journey_trackings.count({
        where: {
          developer_id: userId,
          journey_id: journeyId,
          status: "finished",
        },
      });

      let progress = 0;
      if (totalModules > 0) {
        progress = (finishedModules / totalModules) * 100;
        if (progress > 100) progress = 100;
      }

      // 5. Update Enrollment & Cek Kelulusan
      let newStatus = enrollment.status;
      const now = new Date(); // Waktu saat ini (Selesai)

      // JIKA PROGRESS MENCAPAI 100% DAN BELUM COMPLETED
      if (progress === 100 && newStatus !== "completed") {
        newStatus = "completed";

        const enrolledAt = new Date(enrollment.enrolled_at);

        const studyDurationSeconds = Math.floor((now - enrolledAt) / 1000);

        // Simpan ke tabel completions
        await tx.developer_journey_completions
          .create({
            data: {
              user_id: userId,
              journey_id: journeyId,
              study_duration: studyDurationSeconds,
              // avg_submission_rating bisa dihitung nanti kalau fitur rating submission sudah aktif
            },
          })
          .catch((err) => {
            console.error("Completion record creation failed:", err);
          });
      }

      // Update Enrollment
      await tx.enrollments.update({
        where: { id: enrollment.id },
        data: {
          current_progress: progress,
          status: newStatus,
          last_accessed_at: now,
        },
      });

      // 6. Navigasi Next Module
      const nextModule = await tx.$queryRaw`
                SELECT t.id 
                FROM developer_journey_tutorials t
                LEFT JOIN developer_journey_trackings tr 
                    ON t.id = tr.tutorial_id AND tr.developer_id = ${userId} AND tr.status = 'finished'
                WHERE t.developer_journey_id = ${journeyId} 
                  AND t.status = 'published'
                  AND tr.id IS NULL
                ORDER BY t.position ASC
                LIMIT 1
            `;

      return {
        tutorial_id: tutorialId,
        is_completed: true,
        course_progress: parseFloat(progress.toFixed(2)),
        course_status: newStatus,
        next_tutorial_id: nextModule[0]?.id || null,
      };
    });
  }

  // ===== QUIZ/EXAM METHODS =====

  // Start Quiz - Creates exam_registration
  async startQuiz(userId, tutorialId) {
    // 1. Validate tutorial exists and is quiz type
    const tutorial = await prisma.developer_journey_tutorials.findUnique({
      where: { id: tutorialId },
    });

    if (!tutorial) throw Boom.notFound("Modul tidak ditemukan");
    if (tutorial.type !== "quiz")
      throw Boom.badRequest("Modul ini bukan tipe quiz");

    // 2. Check enrollment
    const enrollment = await prisma.enrollments.findUnique({
      where: {
        user_id_journey_id: {
          user_id: userId,
          journey_id: tutorial.developer_journey_id,
        },
      },
    });

    if (!enrollment)
      throw Boom.forbidden("Anda belum terdaftar di kelas ini");

    // 3. Check if already has active registration
    const existingReg = await prisma.exam_registrations.findFirst({
      where: {
        tutorial_id: tutorialId,
        examinees_id: userId,
      },
      include: {
        exam_results: true,
      },
    });

    // If already has result, return existing data
    if (existingReg?.exam_results) {
      return {
        registration_id: existingReg.id,
        status: existingReg.status,
        already_completed: true,
        result: existingReg.exam_results,
      };
    }

    // If has registration but no result, return existing
    if (existingReg) {
      return {
        registration_id: existingReg.id,
        status: existingReg.status,
        already_completed: false,
      };
    }

    // 4. Create new registration
    const registration = await prisma.exam_registrations.create({
      data: {
        tutorial_id: tutorialId,
        examinees_id: userId,
        status: "registered",
      },
    });

    return {
      registration_id: registration.id,
      status: registration.status,
      already_completed: false,
    };
  }

  // Submit Quiz - Creates exam_result
  async submitQuiz(userId, tutorialId, { answers, score, total_questions, is_passed }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate tutorial
      const tutorial = await tx.developer_journey_tutorials.findUnique({
        where: { id: tutorialId },
      });

      if (!tutorial) throw Boom.notFound("Modul tidak ditemukan");
      if (tutorial.type !== "quiz")
        throw Boom.badRequest("Modul ini bukan tipe quiz");

      const journeyId = tutorial.developer_journey_id;

      // 2. Get or create registration
      let registration = await tx.exam_registrations.findFirst({
        where: {
          tutorial_id: tutorialId,
          examinees_id: userId,
        },
      });

      if (!registration) {
        registration = await tx.exam_registrations.create({
          data: {
            tutorial_id: tutorialId,
            examinees_id: userId,
            status: "registered",
          },
        });
      }

      // 3. Check if already has result
      const existingResult = await tx.exam_results.findUnique({
        where: { exam_registration_id: registration.id },
      });

      let result;
      if (existingResult) {
        // Update existing result if new score is higher
        if (score > existingResult.score) {
          result = await tx.exam_results.update({
            where: { id: existingResult.id },
            data: {
              score,
              total_questions,
              is_passed,
            },
          });
        } else {
          result = existingResult;
        }
      } else {
        // Create new result
        result = await tx.exam_results.create({
          data: {
            exam_registration_id: registration.id,
            score,
            total_questions,
            is_passed,
          },
        });
      }

      // 4. Update registration status
      await tx.exam_registrations.update({
        where: { id: registration.id },
        data: { status: "finished" },
      });

      // 5. If passed, mark module as finished
      if (is_passed) {
        await tx.developer_journey_trackings.upsert({
          where: {
            developer_id_tutorial_id: {
              developer_id: userId,
              tutorial_id: tutorialId,
            },
          },
          create: {
            developer_id: userId,
            tutorial_id: tutorialId,
            journey_id: journeyId,
            status: "finished",
            last_viewed: new Date(),
          },
          update: {
            status: "finished",
            last_viewed: new Date(),
          },
        });

        // Update course progress
        const totalModules = await tx.developer_journey_tutorials.count({
          where: { developer_journey_id: journeyId, status: "published" },
        });

        const finishedModules = await tx.developer_journey_trackings.count({
          where: {
            developer_id: userId,
            journey_id: journeyId,
            status: "finished",
          },
        });

        let progress = totalModules > 0 ? (finishedModules / totalModules) * 100 : 0;
        if (progress > 100) progress = 100;

        const enrollment = await tx.enrollments.findUnique({
          where: {
            user_id_journey_id: { user_id: userId, journey_id: journeyId },
          },
        });

        if (enrollment) {
          let newStatus = enrollment.status;
          if (progress === 100 && newStatus !== "completed") {
            newStatus = "completed";
          }

          await tx.enrollments.update({
            where: { id: enrollment.id },
            data: {
              current_progress: progress,
              status: newStatus,
              last_accessed_at: new Date(),
            },
          });
        }
      }

      // 6. Get next module
      const nextModule = await tx.developer_journey_tutorials.findFirst({
        where: {
          developer_journey_id: journeyId,
          position: { gt: tutorial.position },
          status: "published",
        },
        orderBy: { position: "asc" },
        select: { id: true },
      });

      return {
        result,
        is_passed,
        score,
        next_tutorial_id: nextModule?.id || null,
      };
    });
  }

  // Get quiz status for a user
  async getQuizStatus(userId, tutorialId) {
    const registration = await prisma.exam_registrations.findFirst({
      where: {
        tutorial_id: tutorialId,
        examinees_id: userId,
      },
      include: {
        exam_results: true,
      },
    });

    if (!registration) {
      return { status: "not_started", result: null };
    }

    return {
      status: registration.status,
      result: registration.exam_results || null,
    };
  }
}

module.exports = new LearningService();
