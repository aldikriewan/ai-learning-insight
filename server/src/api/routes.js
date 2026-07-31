const AdminService = require("../services/AdminService");
const StudentService = require("../services/StudentService");
const Joi = require("joi");

module.exports = [
  // ================= ADMIN ROUTES =================
  {
    method: "POST",
    path: "/admin/courses",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] }, // HANYA ADMIN
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          summary: Joi.string(),
          point: Joi.number().integer(),
          required_point: Joi.number().integer(),
          difficulty: Joi.string().valid(
            "beginner",
            "intermediate",
            "advanced"
          ),
        }),
      },
    },
    handler: async (request, h) => {
      const result = await AdminService.createJourney(request.payload);
      return h.response(result).code(201);
    },
  },
  {
    method: "PUT",
    path: "/admin/submissions/{id}/review",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      validate: {
        payload: Joi.object({
          status: Joi.string().valid("passed", "failed").required(),
          rating: Joi.number().min(0).max(5).required(),
          note: Joi.string().allow(""),
        }),
      },
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { id: reviewerId } = request.auth.credentials; // ID Admin dari token
      const result = await AdminService.reviewSubmission(
        parseInt(id),
        reviewerId,
        request.payload
      );
      return h.response(result);
    },
  },

  // ================= STUDENT ROUTES =================
  {
    method: "GET",
    path: "/courses",
    options: { auth: false }, // Public boleh akses katalog
    handler: async (request, h) => {
      return await StudentService.getPublicCourses();
    },
  },
  {
    method: "GET",
    path: "/courses/{id}",
    options: { auth: { mode: "optional" } }, // Bisa login, bisa tidak
    handler: async (request, h) => {
      // Jika login, userId ada. Jika tidak, null.
      const userId = request.auth.isAuthenticated
        ? request.auth.credentials.id
        : null;
      return await StudentService.getCourseDetail(
        parseInt(request.params.id),
        userId
      );
    },
  },
  {
    method: "GET",
    path: "/my-courses",
    options: { auth: { strategy: "jwt", scope: ["student", "admin"] } },
    handler: async (request, h) => {
      const userId = request.auth.credentials.id;
      return await StudentService.getMyCourses(userId);
    },
  },
  {
    method: "GET",
    path: "/learning/module/{id}",
    options: { auth: { strategy: "jwt", scope: ["student"] } },
    handler: async (request, h) => {
      const userId = request.auth.credentials.id;
      // Logic di service sudah handle tracking otomatis
      return await StudentService.getModuleContent(
        parseInt(request.params.id),
        userId
      );
    },
  },
];
