const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class CourseService {
  // Katalog Publik
  async getPublicCourses() {
    return await prisma.developer_journeys.findMany({
      where: { status: "published", listed: true },
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

  // Detail Kelas (Smart View)
  async getCourseDetail(journeyId, userId = null, userRole = "student") {
    // 1. Ambil Data Kelas & Silabus (Optimized Select)
    const journey = await prisma.developer_journeys.findUnique({
      where: { id: journeyId },
      select: {
        id: true,
        name: true,
        summary: true,
        description: true,
        point: true,
        hours_to_study: true,
        difficulty: true,
        image_path: true,
        status: true, // Penting untuk validasi frontend jika draft/published
        developer_journey_tutorials: {
          select: {
            id: true,
            title: true,
            type: true,
            position: true,
            content: true,
            requirements: true,
          },
          orderBy: { position: "asc" },
        },
        instructor: {
          select: { name: true, image_path: true },
        },
      },
    });

    if (!journey) throw Boom.notFound("Kelas tidak ditemukan");

    // 2. Default Response (Guest Template)
    let responseData = {
      ...journey,
      is_enrolled: false,
      progress: 0,
      cta_state: "enroll", // Call To Action Default
      last_accessed_tutorial_id: null,
    };

    if (userRole === "admin") {
      responseData.developer_journey_tutorials =
        journey.developer_journey_tutorials.map((tut) => ({
          ...tut,
          is_completed: false,
          is_locked: false, // Selalu terbuka buat admin
          user_status: "viewed",
        }));
      // Return data mentah
      return responseData;
    }

    // 3. Logic User Login
    if (userId) {
      const enrollment = await prisma.enrollments.findUnique({
        where: {
          user_id_journey_id: { user_id: userId, journey_id: journeyId },
        },
      });

      if (enrollment) {
        // === UPDATE LOGIC ===
        // Update timestamp akses agar dashboard user tetap fresh
        // Kita gunakan Promise.all jika nanti ada query lain yang paralel,
        // tapi await langsung di sini juga aman dan cepat.
        await prisma.enrollments.update({
          where: { id: enrollment.id },
          data: { last_accessed_at: new Date() },
        });

        // Set status enrolled
        responseData.is_enrolled = true;
        responseData.progress = enrollment.current_progress;
        responseData.cta_state = "continue";

        // Fetch materi yang selesai (Hanya ambil ID saja biar ringan)
        const finishedTracks =
          await prisma.developer_journey_trackings.findMany({
            where: {
              developer_id: userId,
              journey_id: journeyId,
              status: "finished", // Asumsi status selesai
            },
            select: { tutorial_id: true },
          });

        // Konversi ke Set untuk pencarian O(1)
        const finishedSet = new Set(finishedTracks.map((t) => t.tutorial_id));

        const allTracks = await prisma.developer_journey_trackings.findMany({
          where: { developer_id: userId, journey_id: journeyId },
          select: { tutorial_id: true, status: true },
        });

        // Buat Map: ID -> Status
        const trackMap = new Map();
        allTracks.forEach((t) => trackMap.set(t.tutorial_id, t.status));

        // Mapping Silabus (Buka gembok karena sudah enroll)
        responseData.developer_journey_tutorials =
          journey.developer_journey_tutorials.map((tut) => ({
            ...tut,
            user_status: trackMap.get(tut.id) || "locked",
            is_completed: trackMap.get(tut.id) === "finished",
            is_locked: false, // Unlock semua materi
          }));

        // Cari materi terakhir dibuka untuk tombol "Lanjut Belajar"
        const lastTrack = await prisma.developer_journey_trackings.findFirst({
          where: { developer_id: userId, journey_id: journeyId },
          orderBy: { last_viewed: "desc" },
          select: { tutorial_id: true }, // Select ID saja
        });

        // Jika pernah belajar, arahkan ke situ. Jika belum, ke materi pertama.
        responseData.last_accessed_tutorial_id = lastTrack
          ? lastTrack.tutorial_id
          : journey.developer_journey_tutorials[0]?.id;
      } else {
        // User Login TAPI Belum Enroll -> Mode Guest tapi User terdeteksi
        responseData.developer_journey_tutorials =
          journey.developer_journey_tutorials.map((tut) => ({
            ...tut,
            is_completed: false,
            is_locked: true, // Kunci materi
          }));
      }
    } else {
      // Guest Murni -> Kunci Materi
      responseData.developer_journey_tutorials =
        journey.developer_journey_tutorials.map((tut) => ({
          ...tut,
          is_completed: false,
          is_locked: true,
        }));
    }

    return responseData;
  }
}

module.exports = new CourseService();
