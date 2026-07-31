import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🔄 Reset data progress (trackings, submissions, exam, completions)…"
  );

  // 1) Hapus data dependent terlebih dahulu (urutan penting karena FK)
  await prisma.exam_results.deleteMany({});
  await prisma.exam_registrations.deleteMany({});
  await prisma.developer_journey_submissions.deleteMany({});
  await prisma.developer_journey_trackings.deleteMany({});
  await prisma.developer_journey_completions.deleteMany({});

  // 2) Ambil semua users & journeys
  const [users, journeys] = await Promise.all([
    prisma.users.findMany({ select: { id: true, display_name: true } }),
    prisma.developer_journeys.findMany({
      where: { status: "published", listed: true },
      select: { id: true, name: true },
    }),
  ]);

  const now = new Date().toISOString();

  console.log(`👤 Users: ${users.length} · 📚 Journeys: ${journeys.length}`);
  if (!users.length || !journeys.length) {
    console.log(
      "⚠️ Tidak ada user atau journey yang ditemukan. Pastikan seed sudah dijalankan."
    );
    return;
  }

  // 3) Enroll semua user ke semua journey
  //    Gunakan upsert agar aman jika skrip dijalankan ulang.
  let inserted = 0;

  for (const u of users) {
    for (const j of journeys) {
      await prisma.developer_journey_completions.upsert({
        where: {
          // composite unique @@unique([user_id, journey_id]) → field name = user_id_journey_id
          user_id_journey_id: { user_id: u.id, journey_id: j.id },
        },
        create: {
          user_id: u.id,
          journey_id: j.id,
          enrolling_times: 1,
          enrollments_at: [now], // simpan daftar timestamp enrol (JSON array)
          last_enrolled_at: new Date(),
          study_duration: null,
          avg_submission_rating: null,
        },
        update: {
          enrolling_times: { increment: 1 },
          // tambahkan timestamp enrol terbaru ke array JSON
          // Prisma belum bisa "push" JSON native → simpan sebagai array baru
          enrollments_at: [now], // kalau ingin gabung, ambil dulu nilai lama lalu gabungkan
          last_enrolled_at: new Date(),
        },
      });
      inserted++;
    }
  }

  console.log(`✅ Enrolled ${inserted} baris (user × journey).`);
  console.log(
    "🧹 Semua modul sekarang statusnya 'belum mulai' (tidak ada trackings/submissions/exam)."
  );
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
