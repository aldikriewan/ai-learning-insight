const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class StudentService {
  // 1. Ambil Profil Siswa (Untuk Header/Sidebar Dashboard)
  async getProfile(userId) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      // Kita pilih field spesifik saja, JANGAN kirim password_hash ke frontend
      select: {
        id: true,
        name: true,
        email: true,
        image_path: true,
        user_role: true,
        created_at: true,
      },
    });

    if (!user) throw Boom.notFound("User tidak ditemukan");
    return user;
  }

  // 2. Katalog Kelas (Untuk halaman "Explore Courses")
  async getPublicCourses() {
    return await prisma.developer_journeys.findMany({
      where: {
        status: "published", // Hanya yang sudah rilis
        listed: true,
      },
      select: {
        id: true,
        name: true,
        summary: true,
        difficulty: true,
        image_path: true,
        point: true,
        hours_to_study: true,
      },
    });
  }

  async enrollCourse(userId, journeyId) {
    // 1. Cek apakah kelas ada dan published
    const journey = await prisma.developer_journeys.findFirst({
      where: { id: journeyId, status: "published" },
    });
    if (!journey) throw Boom.notFound("Kelas tidak ditemukan atau belum rilis");

    // 2. Cek apakah sudah enroll (Prisma akan throw error unique constraint, tapi lebih baik cek dulu untuk pesan error yg jelas)
    const existing = await prisma.enrollments.findUnique({
      where: {
        user_id_journey_id: { user_id: userId, journey_id: journeyId },
      },
    });
    if (existing) throw Boom.conflict("Anda sudah terdaftar di kelas ini");

    // 3. Buat Enrollment
    return await prisma.enrollments.create({
      data: {
        user_id: userId,
        journey_id: journeyId,
      },
    });
  }

  // 3. Kelas Saya (Dashboard Utama Siswa)
  // Mengambil kelas dimana siswa sudah pernah melakukan tracking (viewing/enrolled)
  async getMyCourses(userId) {
    const enrollments = await prisma.enrollments.findMany({
      where: { user_id: userId },
      include: {
        journey: {
          select: {
            id: true,
            name: true,
            image_path: true,
            point: true,
            difficulty: true,
          },
        },
      },
      orderBy: { last_accessed_at: "desc" }, // Urutkan berdasarkan yang terakhir dibuka
    });

    // Format response
    return enrollments.map((enrollment) => ({
      id: enrollment.journey.id,
      name: enrollment.journey.name,
      image: enrollment.journey.image_path,
      point: enrollment.journey.point,
      difficulty: enrollment.journey.difficulty,

      // Data tracking dari enrollment
      enrolled_at: enrollment.enrolled_at,
      last_activity: enrollment.last_accessed_at,
      status: enrollment.status, // active / completed
      progress: enrollment.current_progress,
    }));
  }

  async getModuleContent(tutorialId, userId) {
    const tutorial = await prisma.developer_journey_tutorials.findUnique({
      where: { id: tutorialId },
    });
    if (!tutorial) throw Boom.notFound("Modul tidak ditemukan");

    // 1. Cek apakah user sudah enroll kelas ini? (Security Check)
    const enrollment = await prisma.enrollments.findUnique({
      where: {
        user_id_journey_id: {
          user_id: userId,
          journey_id: tutorial.developer_journey_id,
        },
      },
    });

    if (!enrollment)
      throw Boom.forbidden("Anda harus Enroll kelas ini terlebih dahulu");

    // 2. Update 'last_accessed_at' di tabel enrollment agar muncul paling atas di dashboard
    await prisma.enrollments.update({
      where: { id: enrollment.id },
      data: { last_accessed_at: new Date() },
    });

    // 3. Log Tracking (Logic lama tetap jalan untuk AI data)
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
      },
    });

    return tutorial;
  }

  async getCourseDetail(journeyId, userId = null) {
    try {
      // 1. Ambil Data Kelas & Silabus
      const journey = await prisma.developer_journeys.findUnique({
        where: { id: journeyId },
        include: {
          // Ambil daftar materi urut berdasarkan posisi
          developer_journey_tutorials: {
            select: {
              id: true,
              title: true,
              type: true,
              position: true,
            }, // Jangan ambil content (berat)
            orderBy: { position: "asc" },
          },
          instructor: {
            // Asumsi ada relasi instructor di schema
            select: { name: true, image_path: true },
          },
        },
      });

      if (!journey) throw Boom.notFound("Kelas tidak ditemukan");

      // Default Response (Untuk Guest / Belum Login)
      let responseData = {
        ...journey,
        is_enrolled: false,
        progress: 0,
        cta_state: "enroll", // CTA = Call To Action (Tombol Utama)
        last_accessed_tutorial_id: null,
      };

      // Jika User Login, cek status Enrollment & Tracking
      if (userId) {
        // Cek Enrollment
        const enrollment = await prisma.enrollments.findUnique({
          where: {
            user_id_journey_id: { user_id: userId, journey_id: journeyId },
          },
        });

        if (enrollment) {
          responseData.is_enrolled = true;
          responseData.progress = enrollment.current_progress;
          responseData.cta_state = "continue"; // Ubah tombol jadi "Lanjut Belajar"

          // Ambil daftar materi yang SUDAH selesai (untuk checklist silabus)
          const finishedTracks =
            await prisma.developer_journey_trackings.findMany({
              where: {
                developer_id: userId,
                journey_id: journeyId,
                status: "finished", // Asumsi tracking status 'finished' jika kuis/baca selesai
              },
              select: { tutorial_id: true },
            });

          const finishedSet = new Set(finishedTracks.map((t) => t.tutorial_id));

          // Mapping silabus: Tandai mana yang selesai, mana yang terkunci
          responseData.developer_journey_tutorials =
            responseData.developer_journey_tutorials.map((tut) => ({
              ...tut,
              is_completed: finishedSet.has(tut.id),
              // Logika kunci: Jika belum enroll, semua terkunci kecuali yg 'trial'.
              // Jika sudah enroll, terbuka semua (atau bisa buat logika sequential lock)
              is_locked: false,
            }));

          // Tentukan materi terakhir yang dibuka user untuk tombol "Lanjut Belajar"
          // Jika belum ada history, arahkan ke materi pertama
          const lastTrack = await prisma.developer_journey_trackings.findFirst({
            where: { developer_id: userId, journey_id: journeyId },
            orderBy: { last_viewed: "desc" },
          });

          responseData.last_accessed_tutorial_id = lastTrack
            ? lastTrack.tutorial_id
            : responseData.developer_journey_tutorials[0]?.id;
        } else {
          // User login tapi belum enroll -> Kunci materi
          responseData.developer_journey_tutorials =
            responseData.developer_journey_tutorials.map((tut) => ({
              ...tut,
              is_completed: false,
              is_locked: true, // Bisa set false jika tutorial.trial === true
            }));
        }
      } else {
        // Guest -> Kunci materi
        responseData.developer_journey_tutorials =
          responseData.developer_journey_tutorials.map((tut) => ({
            ...tut,
            is_completed: false,
            is_locked: true,
          }));
      }

      return responseData;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new StudentService();
