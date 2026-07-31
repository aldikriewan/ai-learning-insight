const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class ContentService {
  // ================= COURSE / JOURNEY =================

  // 1. Buat Kelas Baru
  async createCourse(adminId, payload) {
    // Payload: name, summary, description, point, difficulty, image_path
    return await prisma.developer_journeys.create({
      data: {
        ...payload,
        instructor_id: adminId, // Admin sebagai instruktur
        status: "draft", // Default draft, jangan langsung publish
        listed: false,
      },
    });
  }

  // 2. Update Kelas (Termasuk Publish/Unpublish)
  async updateCourse(journeyId, payload) {
    // Cek keberadaan
    try {
      const journey = await prisma.developer_journeys.findUnique({
        where: { id: journeyId },
      });
      if (!journey) throw Boom.notFound("Kelas tidak ditemukan");

      return await prisma.developer_journeys.update({
        where: { id: journeyId },
        data: payload,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // 3. Delete Kelas (Hati-hati!)
  async deleteCourse(journeyId) {
    // Cek apakah sudah ada yang enroll?
    const enrollCount = await prisma.enrollments.count({
      where: { journey_id: journeyId },
    });

    if (enrollCount > 0) {
      // Best Practice: Jangan hapus fisik jika sudah ada siswa.
      // Lakukan "Soft Delete" atau Archive (Unlist)
      throw Boom.forbidden(
        "Tidak dapat menghapus kelas yang memiliki siswa aktif. Silakan unlist/arsip saja."
      );
    }

    // Jika masih kosong, boleh hapus fisik (termasuk modul-modulnya)
    // Gunakan transaction untuk hapus child dulu baru parent
    return await prisma.$transaction([
      prisma.developer_journey_tutorials.deleteMany({
        where: { developer_journey_id: journeyId },
      }),
      prisma.developer_journeys.delete({ where: { id: journeyId } }),
    ]);
  }

  // ================= MODULE / TUTORIAL =================

  // 4. Tambah Modul ke Kelas
  async addModule(journeyId, payload) {
    const journey = await prisma.developer_journeys.findUnique({
      where: { id: journeyId },
    });
    if (!journey) throw Boom.notFound("Kelas induk tidak ditemukan");

    // Logic Auto-Position: Cari posisi terakhir + 1
    const lastModule = await prisma.developer_journey_tutorials.findFirst({
      where: { developer_journey_id: journeyId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastModule ? lastModule.position + 1 : 1;

    let smartRequirements = [];

    if (lastModule) {
      smartRequirements = [lastModule.id];
    }

    return await prisma.developer_journey_tutorials.create({
      data: {
        developer_journey_id: journeyId,
        title: payload.title,
        type: payload.type, // article, video, quiz, submission
        content: payload.content, // HTML atau URL Video
        requirements: smartRequirements,
        position: newPosition,
        status: "published", // Default published agar muncul di silabus
      },
    });
  }

  // 5. Update Modul
  async updateModule(moduleId, payload) {
    const moduleExists = await prisma.developer_journey_tutorials.findUnique({
      where: { id: moduleId },
    });
    if (!moduleExists) throw Boom.notFound("Modul tidak ditemukan");

    return await prisma.developer_journey_tutorials.update({
      where: { id: moduleId },
      data: payload,
    });
  }

  // 6. Delete Modul
  async deleteModule(moduleId) {
    try {
      const moduleToDelete =
        await prisma.developer_journey_tutorials.findUnique({
          where: { id: moduleId },
        });
      if (!moduleToDelete) throw Boom.notFound("Modul tidak ditemukan");

      const childModule = await prisma.developer_journey_tutorials.findFirst({
        where: {
          developer_journey_id: moduleToDelete.developer_journey_id,
          requirements: { array_contains: moduleToDelete.id },
        },
      });

      await prisma.developer_journey_tutorials.delete({
        where: { id: moduleId },
      });

      if (childModule) {
        // Syarat adik sebelumnya: [ID_YG_DIHAPUS]
        // Kita ubah jadi syarat si modul yg dihapus
        // Jadi: Adik -> (skip) -> Kakak
        await prisma.developer_journey_tutorials.update({
          where: { id: childModule.id },
          data: {
            requirements: moduleToDelete.requirements, // Wariskan requirements
          },
        });
      }

      return { message: "Modul dihapus" };
    } catch (error) {
      console.error(error);
    }
  }

  async getAllCourses() {
    return await prisma.developer_journeys.findMany({
      orderBy: { created_at: "desc" }, // Yang baru dibuat di atas
      select: {
        id: true,
        name: true,
        status: true,
        difficulty: true,
        point: true,
        _count: { select: { enrollments: true } }, // Hitung jumlah siswa
      },
    });
  }

  async getDashboardStats() {
    // Kita gunakan Promise.all agar query jalan paralel (lebih cepat)
    const [totalStudents, totalCourses, totalEnrollments, pendingSubmissions] =
      await Promise.all([
        // 1. Hitung Siswa
        prisma.users.count({ where: { user_role: "student" } }),

        // 2. Hitung Kelas (Published)
        prisma.developer_journeys.count({ where: { status: "published" } }),

        // 3. Hitung Total Pendaftaran
        prisma.enrollments.count(),

        // 4. Hitung Tugas Menumpuk (Pending Review)
        prisma.developer_journey_submissions.count({
          where: { status: { in: ["submitted", "under_review"] } },
        }),
      ]);

    // Ambil 5 Aktivitas Terakhir (Enrollment terbaru)
    const recentActivities = await prisma.enrollments.findMany({
      take: 5,
      orderBy: { enrolled_at: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        journey: { select: { name: true } },
      },
    });

    return {
      counts: {
        students: totalStudents,
        courses: totalCourses,
        enrollments: totalEnrollments,
        pending_review: pendingSubmissions,
      },
      recent_activities: recentActivities,
    };
  }
}

module.exports = new ContentService();
