const StudentHandler = require("./handler");
const Joi = require("joi");

const routes = [
  // === DASHBOARD ROUTES ===
  {
    method: "GET",
    path: "/student/dashboard-stats",
    options: {
      auth: "jwt",
      description: "Get dashboard statistics for student",
      handler: StudentHandler.getDashboardStats,
    },
  },
  {
    method: "GET",
    path: "/student/my-courses-detailed",
    options: {
      auth: "jwt",
      description: "Get detailed courses list with categories",
      handler: StudentHandler.getMyCoursesDetailed,
    },
  },

  // === PROFILE ROUTES ===
  {
    method: "GET",
    path: "/student/profile",
    options: {
      auth: "jwt",
      cors: true, // GEMBOK: Hanya user login yang bisa akses
      description: "Get logged in user profile",
      handler: StudentHandler.getProfile,
    },
  },
  {
    method: "GET",
    path: "/courses",
    options: {
      auth: false, // PUBLIK: Orang belum login boleh lihat katalog
      description: "List all public courses",
      handler: StudentHandler.getPublicCourses,
    },
  },
  {
    method: "GET",
    path: "/student/my-courses",
    options: {
      auth: "jwt", // GEMBOK: Harus login
      description: "Get courses enrolled by student",
      handler: StudentHandler.getMyCourses,
    },
  },
  {
    method: "POST",
    path: "/courses/{id}/enroll",
    options: {
      auth: "jwt",
      description: "Enroll user ke kelas",
      handler: StudentHandler.enroll,
    },
  },
  {
    method: "GET",
    path: "/learning/module/{id}",
    options: {
      auth: "jwt",
      description: "Baca materi (auto check enrollment)",
      handler: StudentHandler.getModule,
    },
  },
  {
    method: "GET",
    path: "/courses/{id}",
    options: {
      // PENTING: mode 'optional' & strategy 'jwt'
      // Artinya: Jika bawa token -> dilayani sebagai user.
      // Jika tidak bawa token -> dilayani sebagai guest (tidak error 401).
      auth: {
        strategy: "jwt",
        mode: "optional",
      },
      description: "Get Course Detail (Smart View)",
      handler: StudentHandler.getCourseDetail,
    },
  },
  {
    method: "POST",
    path: "/learning/module/{id}/complete",
    options: {
      auth: "jwt",
      description: "Tandai modul sebagai selesai & update progress",
      handler: StudentHandler.completeModule,
    },
  },

  // Quiz/Exam Routes
  {
    method: "POST",
    path: "/learning/quiz/{id}/start",
    options: {
      auth: "jwt",
      description: "Mulai quiz dan buat exam registration",
      handler: StudentHandler.startQuiz,
    },
  },
  {
    method: "POST",
    path: "/learning/quiz/{id}/submit",
    options: {
      auth: "jwt",
      description: "Submit jawaban quiz dan simpan ke exam result",
      validate: {
        payload: Joi.object({
          answers: Joi.object().optional(),
          score: Joi.number().required(),
          total_questions: Joi.number().integer().required(),
          is_passed: Joi.boolean().required(),
        }),
      },
      handler: StudentHandler.submitQuiz,
    },
  },
  {
    method: "POST",
    // Struktur URL yang jelas hierarkinya
    path: "/courses/{journeyId}/modules/{tutorialId}/submit",
    options: {
      auth: "jwt", // Wajib Login
      description: "Siswa mengirim tugas (Submission)",
      validate: {
        // 1. Validasi Parameter URL (ID harus angka)
        params: Joi.object({
          journeyId: Joi.number().integer().required(),
          tutorialId: Joi.number().integer().required(),
        }),
        // 2. Validasi Body (Link Project Wajib)
        payload: Joi.object({
          app_link: Joi.string().uri().required().messages({
            "string.uri": "Link harus berupa URL yang valid (http/https)",
          }),
          app_comment: Joi.string().allow("").optional(),
        }),
      },
      handler: StudentHandler.submitAssignment,
    },
  },
  {
    method: "PUT",
    path: "/users/profile",
    options: {
      auth: "jwt",
      payload: {
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 2 * 1024 * 1024, // 2MB Limit
        output: "stream", // Penting agar file image terbaca sebagai stream
      },
      validate: {
        // Tambahkan opsi ini agar Joi memberi tahu field mana yang salah
        options: { abortEarly: false },
        failAction: async (request, h, err) => {
          // Log error ke console server untuk debugging
          console.error("Validation Error:", err.message);

          // Kirim detail error ke frontend (bukan hanya "Invalid payload")
          throw err;
        },
        payload: Joi.object({
          name: Joi.string().min(3).max(50).required(),
          city: Joi.string().min(2).max(100).optional().allow(null, ""),
          image: Joi.any().optional(), // Handle file stream
        }),
      },
    },
    handler: StudentHandler.updateProfile,
  },
  {
    method: "PUT",
    path: "/users/change-password",
    options: {
      auth: "jwt", // Pastikan user login menggunakan strategi JWT
      description: "Mengubah password user",
      tags: ["api", "users"],
      validate: {
        payload: Joi.object({
          currentPassword: Joi.string().required().label("Password Lama"),
          newPassword: Joi.string().min(8).required().label("Password Baru"),
        }),
        // failAction penting agar frontend menerima pesan error validasi spesifik
        // (misal: "Password baru minimal 6 karakter")
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === "production") {
            // Di production, bisa disembunyikan jika perlu, tapi untuk dev biarkan throw
            throw err;
          }
          console.error("Validation error:", err.message);
          throw err;
        },
      },
    },
    handler: StudentHandler.changePassword, // Memanggil fungsi di StudentHandler
  },

  {
    method: "GET",
    path: "/student/insights",
    options: {
      auth: "jwt",
    },
    handler: StudentHandler.getInsight,
  },

  // [BARU] Trigger Generate Insight
  {
    method: "POST",
    path: "/student/insights/generate",
    options: {
      auth: "jwt",
    },
    handler: StudentHandler.generateInsight,
  },

  // Focus Time Distribution
  {
    method: "GET",
    path: "/student/focus-time",
    options: {
      auth: "jwt",
      description: "Get focus time distribution for student",
    },
    handler: StudentHandler.getFocusTime,
  },
];

module.exports = routes;
