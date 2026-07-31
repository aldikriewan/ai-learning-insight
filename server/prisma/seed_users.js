const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Memulai Seeding Khusus User 7 & 8...");

  await cleanupUserData(7);

  // Enroll User 7 ke Course 1
  const enrollment7 = await prisma.enrollments.create({
    data: {
      user_id: 7,
      journey_id: 2,
      status: "completed", // Sudah tamat
      current_progress: 100,
      enrolled_at: new Date(new Date().setDate(new Date().getDate() - 30)), // Mulai 30 hari lalu
      last_accessed_at: new Date(), // Selesai hari ini
    },
  });

  // Inject Nilai Tinggi (90-100)
  const scores7 = [95, 100, 92, 98, 90];
  for (let i = 0; i < 3; i++) {
    await prisma.quiz_results.create({
      data: {
        user_id: 7,
        quiz_id: 7, // Dummy ID
        score: scores7[i],
        time_taken_seconds: 1200, // Lama pengerjaan (20 menit - teliti)
      },
    });
  }

  // Inject Submission (Langsung Lulus)
  await prisma.developer_journey_submissions.create({
    data: {
      submitter_id: 7,
      journey_id: 2,
      quiz_id: 7, // Anggap ini ID modul submission
      status: "passed",
      app_link: "https://github.com/dina/perfect-code",
      rating: 5.0,
      note: "Sempurna, struktur kode sangat rapi.",
    },
  });

  // Inject Jam Belajar (Konsisten Siang Hari: 10:00 - 14:00)
  // Kita buat 20 log tracking
  for (let i = 1; i < 6; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Mundur hari
    date.setHours(10 + (i % 4), 0, 0); // Jam 10, 11, 12, 13

    await prisma.developer_journey_trackings.create({
      data: {
        developer_id: 7,
        journey_id: 2,
        tutorial_id: i + 1, // Dummy tutorial ID unik
        status: "finished",
        last_viewed: date,
      },
    });
  }

  // ==========================================
  // 2. DATA USER 8: "THE STRUGGLER" (Kesulitan)
  // ==========================================
  await cleanupUserData(8);

  // Enroll User 8 (Masih Active, belum lulus-lulus)
  await prisma.enrollments.create({
    data: {
      user_id: 8,
      journey_id: 2,
      status: "active",
      current_progress: 45.5, // Macet di tengah
      enrolled_at: new Date(new Date().setDate(new Date().getDate() - 60)), // Sudah 2 bulan lalu (Lambat)
      last_accessed_at: new Date(),
    },
  });

  // Inject Nilai Rendah/Average (50-70)
  const scores8 = [50, 65, 40, 70, 55];
  for (let i = 0; i < scores8.length; i++) {
    await prisma.quiz_results.create({
      data: {
        user_id: 8,
        quiz_id: i + 1,
        score: scores8[i],
        time_taken_seconds: 300, // Cepat tapi salah (5 menit)
      },
    });
  }

  // Inject Submission (Sering Gagal)
  // Submission 1: Gagal
  await prisma.developer_journey_submissions.create({
    data: {
      submitter_id: 8,
      journey_id: 2,
      quiz_id: 7,
      status: "failed",
      app_link: "https://github.com/sigit/error-code",
      rating: 2.0,
      note: "Kode tidak bisa dijalankan. Perbaiki bug di baris 40.",
    },
  });
  // Submission 2: Gagal Lagi (Retry)
  await prisma.developer_journey_submissions.create({
    data: {
      submitter_id: 8,
      journey_id: 2,
      quiz_id: 7,
      status: "failed",
      app_link: "https://github.com/sigit/error-code-v2",
      rating: 2.5,
      note: "Masih ada error logic.",
    },
  });

  // Inject Jam Belajar (Acak-acakan / Bolong-bolong)
  // Hanya belajar 5 kali dalam 2 bulan
  const randomHours = [23, 2, 14, 0, 10];
  let numbert = 2;

  for (let i = 13; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 10);

    // gunakan modulo
    const hour = randomHours[i % randomHours.length];
    date.setHours(hour, 0, 0);
    console.log(numbert);
    await prisma.developer_journey_trackings.create({
      data: {
        developer_id: 8,
        journey_id: 2,
        tutorial_id: numbert++,
        status: "finished",
        last_viewed: date,
      },
    });
  }

  console.log("🎉 Seeding Selesai! Data User 7 & 8 siap dianalisis AI.");
}

// Helper untuk membersihkan data tracking/score user tertentu sebelum seed ulang
async function cleanupUserData(userId) {
  await prisma.developer_journey_trackings.deleteMany({
    where: { developer_id: userId },
  });
  await prisma.developer_journey_submissions.deleteMany({
    where: { submitter_id: userId },
  });
  await prisma.quiz_results.deleteMany({ where: { user_id: userId } });
  await prisma.enrollments.deleteMany({ where: { user_id: userId } });
  await prisma.user_learning_insights.deleteMany({
    where: { user_id: userId },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
