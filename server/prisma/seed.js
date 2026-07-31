const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai Seeding Data...");

  // 1. Bersihkan Data Lama (Hati-hati, ini menghapus data!)
  // Urutan delete penting karena Foreign Key constraint
  await prisma.developer_journey_trackings.deleteMany();
  await prisma.enrollments.deleteMany();
  await prisma.developer_journey_tutorials.deleteMany();
  await prisma.developer_journeys.deleteMany();
  await prisma.users.deleteMany();

  console.log("🧹 Database dibersihkan.");

  // 2. Buat User (Admin & Siswa)
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.users.create({
    data: {
      name: "Sensei Admin",
      email: "admin@lms.com",
      password_hash: passwordHash,
      user_role: "admin",
    },
  });

  const student = await prisma.users.create({
    data: {
      name: "Budi Belajar",
      email: "budi@siswa.com", // <--- Kita akan pakai akun ini untuk tes
      password_hash: passwordHash,
      user_role: "student",
      image_path: "https://i.pravatar.cc/150?u=budi",
    },
  });

  console.log(
    "👤 User dibuat: admin@lms.com & budi@siswa.com (Pass: password123)"
  );

  // 3. Buat Course 1: Next.js 15 (Published)
  const courseNext = await prisma.developer_journeys.create({
    data: {
      name: "Mastering Next.js 15",
      summary: "Panduan lengkap App Router & Server Actions.",
      description:
        "Kelas ini akan membahas fitur terbaru Next.js 15 secara mendalam.",
      point: 100,
      required_point: 0,
      difficulty: "intermediate",
      status: "published", // Rilis
      listed: true,
      image_path:
        "https://assets.vercel.com/image/upload/v1662130559/nextjs/icon.png",
      instructor_id: admin.id,

      // Isi Materi
      developer_journey_tutorials: {
        create: [
          {
            title: "Apa itu Server Components?",
            type: "article",
            position: 1,
            content:
              "<h1>Server Components</h1><p>Adalah komponen yang dirender di server...</p>",
            status: "published",
            requirements: JSON.stringify([]),
          },
          {
            title: "Setup Project dengan CLI",
            type: "video",
            position: 2,
            content: "https://youtube.com/embed/video-id",
            status: "published",
            requirements: JSON.stringify([]),
          },
          {
            title: "Quiz: Konsep Dasar",
            type: "quiz",
            position: 3,
            status: "published",
            requirements: JSON.stringify([]),
          },
        ],
      },
    },
  });

  // 4. Buat Course 2: Hapi.js Backend (Published)
  const courseHapi = await prisma.developer_journeys.create({
    data: {
      name: "Backend Secure dengan Hapi.js",
      summary: "Bangun API level enterprise yang aman.",
      point: 50,
      required_point: 0,
      difficulty: "advanced",
      status: "published",
      listed: true,
      image_path:
        "https://raw.githubusercontent.com/hapijs/assets/master/images/hapi.png",
      instructor_id: admin.id,
      developer_journey_tutorials: {
        create: [
          {
            title: "Instalasi Hapi",
            type: "article",
            position: 1,
            status: "published",
          },
        ],
      },
    },
  });

  // 5. Buat Course 3: Python for Data Science (Draft - Tidak boleh muncul di public)
  await prisma.developer_journeys.create({
    data: {
      name: "Python Data Science (DRAFT)",
      summary: "Masih dalam pengembangan.",
      point: 200,
      required_point: 0,
      difficulty: "beginner",
      status: "draft", // <--- Draft
      listed: false,
      instructor_id: admin.id,
    },
  });

  // 6. Skenario: Budi Enroll di Kelas Next.js (Sudah berjalan 50%)
  await prisma.enrollments.create({
    data: {
      user_id: student.id,
      journey_id: courseNext.id,
      status: "active",
      current_progress: 33.5, // Ceritanya sudah progress
      last_accessed_at: new Date(),
    },
  });

  // Tracking: Budi sudah baca materi pertama
  // Kita ambil ID tutorial pertama dari courseNext tadi (agak tricky di script, tapi biar gampang kita query ulang)
  const firstTutorial = await prisma.developer_journey_tutorials.findFirst({
    where: { developer_journey_id: courseNext.id, position: 1 },
  });

  if (firstTutorial) {
    await prisma.developer_journey_trackings.create({
      data: {
        developer_id: student.id,
        journey_id: courseNext.id,
        tutorial_id: firstTutorial.id,
        status: "finished",
        last_viewed: new Date(),
      },
    });
  }

  console.log("✅ Seeding Selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
