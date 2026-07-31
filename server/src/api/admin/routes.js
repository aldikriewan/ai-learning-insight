const AdminHandler = require("./handler");
const Joi = require("joi");

const routes = [
  // 1. Create Course
  {
    method: "POST",
    path: "/admin/courses",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] }, // <--- HANYA ADMIN
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          summary: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          point: Joi.number().integer().min(0).default(0),
          required_point: Joi.number().integer().default(0),
          difficulty: Joi.string()
            .valid("beginner", "intermediate", "advanced")
            .required(),
          image_path: Joi.string().uri().optional(),
          hours_to_study: Joi.number().integer().min(0).default(0),
        }),
      },
      handler: AdminHandler.createCourse,
    },
  },

  // 2. Update Course (Termasuk Publish)
  {
    method: "PUT",
    path: "/admin/courses/{id}",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      validate: {},
      handler: AdminHandler.updateCourse,
    },
  },

  // 3. Delete Course
  {
    method: "DELETE",
    path: "/admin/courses/{id}",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      handler: AdminHandler.deleteCourse,
    },
  },

  // 4. Add Module to Course
  {
    method: "POST",
    path: "/admin/courses/{id}/modules",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      validate: {},
      handler: AdminHandler.addModule,
    },
  },

  // 5. Update Module
  {
    method: "PUT",
    path: "/admin/modules/{moduleId}", // Direct access by ID
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      validate: {
        payload: Joi.object({
          title: Joi.string(),
          type: Joi.string().valid("article", "video", "quiz", "submission"),
          content: Joi.string(),
          position: Joi.number().integer(),
          status: Joi.string().valid("draft", "published"),
        }),
      },
      handler: AdminHandler.updateModule,
    },
  },

  // 6. Delete Module
  {
    method: "DELETE",
    path: "/admin/modules/{moduleId}",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      handler: AdminHandler.deleteModule,
    },
  },

  {
    method: "GET",
    path: "/admin/submissions",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      handler: AdminHandler.getSubmissions,
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
          rating: Joi.number().min(0).max(5).required(), // Rating bintang 0-5
          note: Joi.string().allow("").optional(),
        }),
      },
      handler: AdminHandler.reviewSubmission,
    },
  },
  {
    method: "GET",
    path: "/admin/courses",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      handler: AdminHandler.getAllCourses,
    },
  },
  {
    method: "GET",
    path: "/admin/stats",
    options: {
      auth: { strategy: "jwt", scope: ["admin"] },
      handler: AdminHandler.getDashboardStats,
    },
  },
];

module.exports = routes;
