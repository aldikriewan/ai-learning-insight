const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

class ProfileService {
  // Ambil Profil User
  async getProfile(userId) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        user_role: true,
        image_path: true,
      },
    });
    if (!user) throw Boom.notFound("User tidak ditemukan");
    return user;
  }

  // Dashboard: Kelas Saya (Menggunakan tabel enrollments)
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
      orderBy: { last_accessed_at: "desc" },
    });

    return enrollments.map((e) => ({
      id: e.journey.id,
      name: e.journey.name,
      image: e.journey.image_path,
      point: e.journey.point,
      difficulty: e.journey.difficulty,
      status: e.status,
      progress: e.current_progress,
      enrolled_at: e.enrolled_at,
      last_activity: e.last_accessed_at,
    }));
  }

  // History Submission Saya
  async getMySubmissions(userId) {
    return await prisma.developer_journey_submissions.findMany({
      where: { submitter_id: userId },
      include: {
        journey: { select: { name: true } },
        quiz: { select: { title: true } },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async updateProfile(userId, { name, city}) {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: name,
        city: city,
      },
    });
    return updatedUser;
  }

   async changePassword(userId, currentPassword, newPassword) {
    // 1. Cari user di database untuk mengambil password_hash saat ini
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw Boom.notFound('User tidak ditemukan');
    }

    // 2. Verifikasi Password Lama
    // Bandingkan password yang dikirim user dengan hash di database
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      // Jika tidak cocok, lempar error 400
      throw Boom.badRequest('Password lama yang Anda masukkan salah');
    }

    // 3. Hash Password Baru
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update Database
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: newPasswordHash,
        updated_at: new Date(), // Opsional: update timestamp
      },
    });
  }

}

module.exports = new ProfileService();
