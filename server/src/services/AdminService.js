const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class AdminService {
  // 1. Menambah Kelas (Journey)
  async createJourney(data) {
    return await prisma.developer_journeys.create({
      data: {
        ...data,
        status: "draft", // Default draft agar aman
      },
    });
  }

  // 2. Menambah Modul/Tutorial ke dalam Kelas
  async addTutorial(journeyId, data) {
    // Pastikan journey ada
    const journey = await prisma.developer_journeys.findUnique({
      where: { id: journeyId },
    });
    if (!journey) throw Boom.notFound("Journey not found");

    return await prisma.developer_journey_tutorials.create({
      data: {
        ...data,
        developer_journey_id: journeyId,
      },
    });
  }

  // 3. List Submission yang butuh Review
  async getPendingSubmissions() {
    return await prisma.developer_journey_submissions.findMany({
      where: { status: "submitted" },
      include: {
        journey: { select: { name: true } },
        submitter: { select: { name: true, email: true } },
        quiz: { select: { title: true } }, // Quiz di sini merujuk ke tutorial tipe submission
      },
    });
  }

  // 4. Review Submission
  async reviewSubmission(submissionId, reviewerId, { status, rating, note }) {
    return await prisma.developer_journey_submissions.update({
      where: { id: submissionId },
      data: {
        status,
        rating,
        note,
        reviewer_id: reviewerId,
      },
    });
  }
}

module.exports = new AdminService();
