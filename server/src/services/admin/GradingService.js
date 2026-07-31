const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class GradingService {
  // 1. Lihat Daftar Tugas Masuk (Pending)
  async getPendingSubmissions() {
    return await prisma.developer_journey_submissions.findMany({
      where: {
        status: { in: ["submitted", "under_review"] }, // Hanya yg belum dinilai final
      },
      include: {
        journey: { select: { name: true } },
        quiz: { select: { title: true } }, // Judul tugas
        submitter: { select: { name: true, email: true, image_path: true } },
      },
      orderBy: { created_at: "asc" }, // Yang submit duluan dilayani duluan (FIFO)
    });
  }

  // 2. Review & Grading
  async reviewSubmission(submissionId, reviewerId, { status, rating, note }) {
    // Gunakan Transaction agar data submission & progress siswa sinkron
    return await prisma.$transaction(async (tx) => {
      // A. Cek Submission
      const submission = await tx.developer_journey_submissions.findUnique({
        where: { id: submissionId },
        include: {
          quiz: true, // Perlu data tutorial_id (quiz_id merujuk ke tutorial)
        },
      });

      if (!submission) throw Boom.notFound("Submission tidak ditemukan");

      // B. Update Status Submission
      const updatedSubmission = await tx.developer_journey_submissions.update({
        where: { id: submissionId },
        data: {
          status, // 'passed' atau 'failed'
          rating, // 1.0 - 5.0
          note, // Komentar reviewer
          reviewer_id: reviewerId,
        },
      });

      // C. LOGIC INTEGRASI PROGRESS (Hanya jika Lulus)
      if (status === "passed") {
        const userId = submission.submitter_id;
        const journeyId = submission.journey_id;
        const tutorialId = submission.quiz_id; // Di schema Anda, quiz_id = tutorial_id

        // 1. Tandai Tracking Modul jadi 'finished'
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
          update: { status: "finished", last_viewed: new Date() },
        });

        // 2. Hitung Ulang Progress Enrollment (Sama seperti logic LearningService)
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

        // 3. Update Enrollment
        const enrollment = await tx.enrollments.findUnique({
          where: {
            user_id_journey_id: { user_id: userId, journey_id: journeyId },
          },
        });

        if (enrollment) {
          let enrollStatus = enrollment.status;
          if (progress === 100 && enrollStatus !== "completed") {
            enrollStatus = "completed";
            // Opsional: Catat completion record (wisuda) di sini juga
            // ... (code completion record)
          }

          await tx.enrollments.update({
            where: { id: enrollment.id },
            data: {
              current_progress: progress,
              status: enrollStatus,
            },
          });
        }
      }

      return updatedSubmission;
    });
  }
}

module.exports = new GradingService();
