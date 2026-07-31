const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");
const axios = require("axios");

class InsightService {
  
  // Hitung rata-rata
  calcMean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // Hitung standar deviasi
  calcStdDev(arr) {
    if (arr.length <= 1) return 0;
    const mean = this.calcMean(arr);
    const variance = arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }

  // Circular mean untuk jam (0-23)
  calcCircularMeanHour(hours) {
    if (!hours.length) return 0;
    const radians = hours.map(h => (h / 24) * 2 * Math.PI);
    const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
    const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
    let meanAngle = Math.atan2(sinSum / hours.length, cosSum / hours.length);
    if (meanAngle < 0) meanAngle += 2 * Math.PI;
    return (meanAngle / (2 * Math.PI)) * 24;
  }

  // Circular std untuk jam
  calcCircularStdHour(hours) {
    if (hours.length <= 1) return 0;
    const radians = hours.map(h => (h / 24) * 2 * Math.PI);
    const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
    const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
    const R = Math.sqrt(sinSum ** 2 + cosSum ** 2) / hours.length;
    const circularVariance = Math.max(0, Math.min(1 - R, 0.9999));
    return Math.sqrt(-2 * Math.log(1 - circularVariance)) * (24 / (2 * Math.PI));
  }

  // Ambil dan hitung fitur untuk ML
  async prepareFeatures(userId) {
    const [trackings, examResults, allEnrollments] = await Promise.all([
      prisma.developer_journey_trackings.findMany({
        where: { developer_id: userId },
        select: { last_viewed: true, first_opened_at: true },
      }),
      prisma.exam_results.findMany({
        where: { exam_registration: { examinees_id: userId } },
        select: { score: true },
      }),
      prisma.enrollments.findMany({
        where: { user_id: userId },
        select: { enrolled_at: true, last_accessed_at: true, status: true },
      }),
    ]);

    // Jam belajar dari tracking
    const studyHours = trackings
      .filter(t => t.last_viewed)
      .map(t => new Date(t.last_viewed).getHours());

    const avg_study_hour = this.calcCircularMeanHour(studyHours);
    const study_consistency_std = this.calcCircularStdHour(studyHours);

    // Skor exam
    const scores = examResults.map(e => parseFloat(e.score));
    const avg_exam_score = this.calcMean(scores);

    // Enrollment stats
    const completedEnrollments = allEnrollments.filter(e => e.status === "completed");
    const total_courses_enrolled = allEnrollments.length;
    const courses_completed = completedEnrollments.length;

    // Completion speed dari enrollment yang selesai
    const durations = [];
    completedEnrollments.forEach(en => {
      if (en.last_accessed_at) {
        const diffMs = new Date(en.last_accessed_at) - new Date(en.enrolled_at);
        durations.push(diffMs / (1000 * 60 * 60));
      }
    });

    const avgDuration = this.calcMean(durations);
    const completion_speed = avgDuration > 0 ? avgDuration / 20.0 : 1.0;

    // Modul stats
    const completed_modules = trackings.filter(t => t.last_viewed).length;
    const total_modules_viewed = trackings.length;

    // Hitung waktu belajar optimal
    const hourCounts = {};
    studyHours.forEach(h => {
      const period = h >= 5 && h < 12 ? "Pagi" 
                   : h >= 12 && h < 17 ? "Siang"
                   : h >= 17 && h < 19 ? "Sore"
                   : h >= 19 && h < 24 ? "Malam" : "Dini Hari";
      hourCounts[period] = (hourCounts[period] || 0) + 1;
    });

    let optimal_study_time = "Pagi";
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([period, count]) => {
      if (count > maxCount) {
        maxCount = count;
        optimal_study_time = period;
      }
    });

    return {
      completion_speed,
      study_consistency_std,
      avg_study_hour,
      completed_modules,
      total_modules_viewed,
      avg_exam_score,
      total_courses_enrolled,
      courses_completed,
      optimal_study_time,
    };
  }

  // Generate insight lengkap
  async generateFullInsight(userId) {
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw Boom.notFound("User tidak ditemukan");

    const features = await this.prepareFeatures(userId);
    console.log("Features:", features);

    // Panggil ML Pace
    let paceResult = null;
    try {
      const res = await axios.post(`${mlUrl}/api/v1/pace/analyze`, {
        user_id: userId,
        features: {
          completion_speed: features.completion_speed,
          study_consistency_std: features.study_consistency_std,
          avg_study_hour: features.avg_study_hour,
          completed_modules: features.completed_modules,
          total_modules_viewed: features.total_modules_viewed,
        },
      });
      paceResult = res.data;
    } catch (e) {
      console.error("ML Pace Error:", e.message);
      paceResult = {
        pace_label: "consistent learner",
        confidence: 0.5,
        insight: "Data belum cukup untuk analisis"
      };
    }

    // Generate Advice dengan data lengkap (untuk keseluruhan kelas)
    let adviceResult = null;
    try {
      const res = await axios.post(`${mlUrl}/api/v1/advice/generate`, {
        user_id: userId,
        name: user.name || "Siswa",
        pace_label: paceResult.pace_label,
        avg_exam_score: features.avg_exam_score,
        completed_modules: features.completed_modules,
        total_modules_viewed: features.total_modules_viewed,
        completion_speed: features.completion_speed,
        study_consistency_std: features.study_consistency_std,
        total_courses_enrolled: features.total_courses_enrolled,
        courses_completed: features.courses_completed,
        optimal_study_time: features.optimal_study_time,
        avg_study_hour: features.avg_study_hour,
      });
      adviceResult = res.data;
    } catch (e) {
      console.error("ML Advice Error:", e.message);
      // Fallback advice yang membangun
      const score = features.avg_exam_score;
      const progress = features.total_modules_viewed > 0 
        ? (features.completed_modules / features.total_modules_viewed) * 100 
        : 0;
      const pace = paceResult.pace_label;
      const optTime = features.optimal_study_time;
      
      let advice = `Halo ${user.name}, sebagai ${pace} `;
      if (score < 60) {
        advice += `nilai quiz kamu (${score.toFixed(0)}) perlu ditingkatkan. Manfaatkan waktu ${optTime} untuk review materi lebih intensif.`;
      } else if (progress < 30) {
        advice += `progress (${progress.toFixed(0)}%) masih bisa ditingkatkan. Coba konsisten belajar di waktu ${optTime} yang merupakan waktu terbaikmu.`;
      } else {
        advice += `kamu sudah di jalur yang benar! Pertahankan ritme belajarmu di waktu ${optTime}.`;
      }
      
      adviceResult = { advice_text: advice };
    }

    // Simpan ke database
    const insightData = {
      pace: paceResult,
      advice: adviceResult,
      features: features,
      generated_at: new Date(),
    };

    await prisma.user_learning_insights.create({
      data: {
        user_id: userId,
        insight_key: "latest_analysis",
        insight_val: insightData,
      },
    });

    return insightData;
  }

  // Ambil insight terakhir
  async getLatestInsight(userId) {
    const insight = await prisma.user_learning_insights.findFirst({
      where: { user_id: userId, insight_key: "latest_analysis" },
      orderBy: { created_at: "desc" },
    });
    return insight ? insight.insight_val : null;
  }

  // Distribusi waktu fokus untuk chart
  async getFocusTimeDistribution(userId) {
    const trackings = await prisma.developer_journey_trackings.findMany({
      where: { developer_id: userId, last_viewed: { not: null } },
      select: { last_viewed: true },
    });

    const periods = {
      Pagi: { start: 5, end: 11, count: 0 },
      Siang: { start: 11, end: 15, count: 0 },
      Sore: { start: 15, end: 19, count: 0 },
      Malam: { start: 19, end: 24, count: 0 },
      "Dini Hari": { start: 0, end: 5, count: 0 },
    };

    trackings.forEach(t => {
      const hour = new Date(t.last_viewed).getHours();
      if (hour >= 5 && hour < 11) periods.Pagi.count++;
      else if (hour >= 11 && hour < 15) periods.Siang.count++;
      else if (hour >= 15 && hour < 19) periods.Sore.count++;
      else if (hour >= 19 && hour < 24) periods.Malam.count++;
      else periods["Dini Hari"].count++;
    });

    const total = trackings.length || 1;

    const distribution = Object.entries(periods)
      .map(([name, data]) => ({
        name,
        value: Math.round((data.count / total) * 100),
        count: data.count,
      }))
      .filter(d => d.value > 0);

    const optimal = distribution.reduce(
      (max, item) => (item.count > max.count ? item : max),
      { name: "Pagi", count: 0, value: 0 }
    );

    const timeRanges = {
      Pagi: "05:00 - 11:00",
      Siang: "11:00 - 15:00",
      Sore: "15:00 - 19:00",
      Malam: "19:00 - 24:00",
      "Dini Hari": "00:00 - 05:00",
    };

    return {
      distribution: distribution.length > 0 ? distribution : [
        { name: "Pagi", value: 25, count: 0 },
        { name: "Siang", value: 25, count: 0 },
        { name: "Sore", value: 25, count: 0 },
        { name: "Malam", value: 25, count: 0 },
      ],
      optimal_period: optimal.name,
      optimal_time_range: timeRanges[optimal.name] || "07:00 - 11:00",
      total_activities: trackings.length,
    };
  }
}

module.exports = new InsightService();
