const ContentService = require("../../services/admin/ContentService");
const GradingService = require("../../services/admin/GradingService");

const AdminHandler = {
  // === COURSE ===
  async createCourse(request, h) {
    const adminId = request.auth.credentials.id;
    const result = await ContentService.createCourse(adminId, request.payload);
    return h
      .response({
        status: "success",
        message: "Kelas dibuat (Draft)",
        data: result,
      })
      .code(201);
  },

  async updateCourse(request, h) {
    const journeyId = parseInt(request.params.id);
    const result = await ContentService.updateCourse(
      journeyId,
      request.payload
    );
    return h.response({
      status: "success",
      message: "Kelas diperbarui",
      data: result,
    });
  },

  async deleteCourse(request, h) {
    const journeyId = parseInt(request.params.id);
    await ContentService.deleteCourse(journeyId);
    return h.response({ status: "success", message: "Kelas dihapus permanen" });
  },

  // === MODULE ===
  async addModule(request, h) {
    const journeyId = parseInt(request.params.id);
    const result = await ContentService.addModule(journeyId, request.payload);
    return h
      .response({
        status: "success",
        message: "Modul berhasil ditambahkan",
        data: result,
      })
      .code(201);
  },

  async updateModule(request, h) {
    const moduleId = parseInt(request.params.moduleId);
    const result = await ContentService.updateModule(moduleId, request.payload);
    return h.response({
      status: "success",
      message: "Modul diperbarui",
      data: result,
    });
  },

  async deleteModule(request, h) {
    const moduleId = parseInt(request.params.moduleId);
    await ContentService.deleteModule(moduleId);
    return h.response({ status: "success", message: "Modul dihapus" });
  },

  async getSubmissions(request, h) {
    const result = await GradingService.getPendingSubmissions();
    return h.response({ status: "success", data: result });
  },

  async reviewSubmission(request, h) {
    const submissionId = parseInt(request.params.id);
    const reviewerId = request.auth.credentials.id;

    const result = await GradingService.reviewSubmission(
      submissionId,
      reviewerId,
      request.payload
    );

    return h.response({
      status: "success",
      message: "Penilaian berhasil disimpan",
      data: result,
    });
  },

  async getAllCourses(request, h) {
    const result = await ContentService.getAllCourses();
    return h.response({ status: "success", data: result });
  },

  async getDashboardStats(request, h) {
    const stats = await ContentService.getDashboardStats();
    return h.response({ status: "success", data: stats });
  },
};

module.exports = AdminHandler;
