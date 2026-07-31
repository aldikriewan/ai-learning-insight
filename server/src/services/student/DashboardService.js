const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DashboardService {
  async getDashboardStats(userId) {
    // Parallel queries untuk performa
    const [enrollments, completions, recentTrackings, quizResults] =
      await Promise.all([
        // Semua enrollment user
        prisma.enrollments.findMany({
          where: { user_id: userId },
          include: {
            journey: {
              select: {
                id: true,
                name: true,
                image_path: true,
                difficulty: true,
              },
            },
          },
          orderBy: { last_accessed_at: "desc" },
        }),

        // Data completion untuk jam belajar
        prisma.developer_journey_completions.findMany({
          where: { user_id: userId },
          select: { study_duration: true },
        }),

        // Recent activities (tracking terbaru)
        prisma.developer_journey_trackings.findMany({
          where: { developer_id: userId },
          include: {
            tutorial: {
              select: {
                id: true,
                title: true,
                type: true,
                developer_journey_id: true,
                developer_journey: {
                  select: { id: true, name: true },
                },
              },
            },
          },
          orderBy: { last_viewed: "desc" },
          take: 10,
        }),

        // Quiz results untuk average score
        prisma.quiz_results.findMany({
          where: { user_id: userId },
          select: { score: true },
        }),
      ]);

    // Hitung statistik
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.status === "completed"
    ).length;
    const inProgressCourses = enrollments.filter(
      (e) =>
        e.status === "in_progress" ||
        (e.current_progress > 0 && e.current_progress < 100)
    ).length;

    // Total jam belajar (konversi dari detik ke jam)
    const totalStudySeconds = completions.reduce(
      (acc, c) => acc + (c.study_duration || 0),
      0
    );
    const totalStudyHours = Math.round((totalStudySeconds / 3600) * 10) / 10;

    // Average quiz score
    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((acc, q) => acc + parseFloat(q.score), 0) /
              quizResults.length
          )
        : 0;

    // Format recent activities
    const recentActivities = recentTrackings
      .filter((t) => t.tutorial && t.tutorial.journey)
      .map((t) => ({
        id: t.id,
        type: t.tutorial.type,
        title: t.tutorial.title,
        course_id: t.tutorial.journey.id,
        course_name: t.tutorial.journey.name,
        status: t.status,
        last_viewed: t.last_viewed,
      }));

    // Kelas yang sedang dipelajari (untuk card)
    const activeCourses = enrollments
      .filter((e) => e.current_progress > 0 && e.current_progress < 100)
      .slice(0, 3)
      .map((e) => ({
        id: e.journey.id,
        name: e.journey.name,
        image_path: e.journey.image_path,
        difficulty: e.journey.difficulty,
        progress: e.current_progress,
        last_activity: e.last_accessed_at,
      }));

    return {
      stats: {
        total_courses: totalCourses,
        completed_courses: completedCourses,
        in_progress_courses: inProgressCourses,
        total_study_hours: totalStudyHours,
        avg_quiz_score: avgQuizScore,
      },
      active_courses: activeCourses,
      recent_activities: recentActivities,
    };
  }

  async getMyCoursesDetailed(userId) {
    const enrollments = await prisma.enrollments.findMany({
      where: { user_id: userId },
      include: {
        journey: {
          select: {
            id: true,
            name: true,
            summary: true,
            image_path: true,
            point: true,
            difficulty: true,
            _count: {
              select: {
                developer_journey_tutorials: {
                  where: { status: "published" },
                },
              },
            },
          },
        },
      },
      orderBy: { last_accessed_at: "desc" },
    });

    // Kategorikan kelas
    const all = [];
    const inProgress = [];
    const completed = [];
    const notStarted = [];

    enrollments.forEach((e) => {
      const course = {
        id: e.journey.id,
        name: e.journey.name,
        summary: e.journey.summary,
        image_path: e.journey.image_path,
        point: e.journey.point,
        difficulty: e.journey.difficulty,
        total_modules: e.journey._count.developer_journey_tutorials,
        progress: e.current_progress || 0,
        status: e.status,
        enrolled_at: e.enrolled_at,
        last_activity: e.last_accessed_at,
      };

      all.push(course);

      if (e.status === "completed" || e.current_progress === 100) {
        completed.push(course);
      } else if (e.current_progress > 0 && e.current_progress < 100) {
        inProgress.push(course);
      } else {
        notStarted.push(course);
      }
    });

    return {
      all,
      in_progress: inProgress,
      completed,
      not_started: notStarted,
      summary: {
        total: all.length,
        in_progress: inProgress.length,
        completed: completed.length,
        not_started: notStarted.length,
      },
    };
  }
}

module.exports = new DashboardService();
