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

  // Day gap std (as per ML training): std of gaps between consecutive study dates
  calcDayGapStd(dates) {
    if (dates.length <= 1) return 0;
    const sortedDates = [...new Set(dates)].sort();
    if (sortedDates.length <= 1) return 0;
    
    const gaps = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const d1 = new Date(sortedDates[i - 1]);
      const d2 = new Date(sortedDates[i]);
      const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
      gaps.push(diff);
    }
    
    if (gaps.length <= 1) return 0;
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (gaps.length - 1);
    return Math.sqrt(variance);
  }

  // Study consistency ratio (as per ML training): unique dates / date range
  calcStudyConsistencyRatio(dates) {
    const uniqueDates = [...new Set(dates)].sort();
    if (uniqueDates.length <= 1) return 1;
    
    const firstDate = new Date(uniqueDates[0]);
    const lastDate = new Date(uniqueDates[uniqueDates.length - 1]);
    const dateRange = (lastDate - firstDate) / (1000 * 60 * 60 * 24) + 1;
    
    return uniqueDates.length / dateRange;
  }

  // Ambil dan hitung fitur untuk ML
  async prepareFeatures(userId) {
    const [trackings, examResults, allEnrollments, submissions] = await Promise.all([
      prisma.developer_journey_trackings.findMany({
        where: { developer_id: userId },
        select: { 
          last_viewed: true, 
          first_opened_at: true, 
          tutorial_id: true, 
          status: true,
          journey: { select: { id: true, hours_to_study: true, name: true } }
        },
      }),
      prisma.exam_results.findMany({
        where: { exam_registration: { examinees_id: userId } },
        select: { score: true, is_passed: true, exam_registration: { select: { tutorial: { select: { developer_journey_id: true } } } } },
      }),
      prisma.enrollments.findMany({
        where: { user_id: userId },
        select: { enrolled_at: true, last_accessed_at: true, status: true, journey: { select: { hours_to_study: true, name: true, difficulty: true } } },
      }),
      prisma.developer_journey_submissions.findMany({
        where: { submitter_id: userId },
        select: { status: true },
      }),
    ]);

    // Jam belajar dari tracking
    const studyHours = trackings
      .filter(t => t.last_viewed)
      .map(t => new Date(t.last_viewed).getHours());

    const avg_study_hour = this.calcCircularMeanHour(studyHours);

    // Study dates for consistency calculation
    const studyDates = trackings
      .filter(t => t.last_viewed)
      .map(t => new Date(t.last_viewed).toISOString().split('T')[0]);

    const study_consistency_std = this.calcDayGapStd(studyDates);
    const study_consistency_ratio = this.calcStudyConsistencyRatio(studyDates);

    // Skor exam
    const scores = examResults.map(e => parseFloat(e.score));
    const avg_exam_score = this.calcMean(scores);
    
    // Exam fail count
    const exam_fail_count = examResults.filter(e => !e.is_passed).length;

    // Enrollment stats
    const completedEnrollments = allEnrollments.filter(e => e.status === "completed");
    const total_courses_enrolled = allEnrollments.length;
    const courses_completed = completedEnrollments.length;

    // Difficulty (numeric average from enrolled courses)
    const difficultyToNum = (d) => {
      const s = String(d || '').toLowerCase();
      if (s.includes('beginner') || s === '0') return 0;
      if (s.includes('intermediate') || s === '1') return 1;
      if (s.includes('advanced') || s === '2') return 2;
      if (s.includes('expert') || s === '3') return 3;
      const n = parseInt(s, 10);
      return isNaN(n) ? 0 : n;
    };
    const difficulty = allEnrollments.length > 0
      ? allEnrollments.reduce((sum, e) => sum + (e.journey ? difficultyToNum(e.journey.difficulty) : 0), 0) / allEnrollments.length
      : 0;

    // Completion speed: study_duration / hours_to_study (as per ML training)
    const completionSpeeds = [];
    completedEnrollments.forEach(en => {
      if (en.journey && en.journey.hours_to_study && en.journey.hours_to_study > 0 && en.last_accessed_at) {
        const diffMs = new Date(en.last_accessed_at) - new Date(en.enrolled_at);
        const durationHours = diffMs / (1000 * 60 * 60);
        const ratio = durationHours / en.journey.hours_to_study;
        completionSpeeds.push(Math.min(ratio, 10)); // Clip to max 10 as per training
      }
    });

    const completion_speed = completionSpeeds.length > 0 
      ? this.calcMean(completionSpeeds) 
      : 1.0;

    // Modul stats
    const completed_modules = trackings.filter(t => t.status === 'finished').length;
    const total_modules_viewed = trackings.length;

    // Submission fail rate and fail count
    const totalSubmissions = submissions.length;
    const failedSubmissions = submissions.filter(s => ['failed', 'revision_requested', 'rejected'].includes(s.status)).length;
    const submission_fail_rate = totalSubmissions > 0 ? failedSubmissions / totalSubmissions : 0.0;
    const submission_fail_count = failedSubmissions;

    // Retry count: enrolling_times from completions (as per ML training)
    const completions = await prisma.developer_journey_completions.findMany({
      where: { user_id: userId },
      select: { study_duration: true, enrolling_times: true, avg_submission_rating: true },
    });
    
    const retry_count = completions.filter(c => c.enrolling_times && c.enrolling_times > 1)
      .reduce((a, c) => a + c.enrolling_times, 0);

    // Avg submission rating
    const avg_submission_rating = this.calcMean(submissions.map(s => s.rating || 0).filter(r => r > 0));

    // Performance score (as per ML training): avg_exam_score * 0.4 + avg_submission_rating * 20 * 0.6
    const performance_score = (avg_exam_score * 0.4) + (avg_submission_rating * 20 * 0.6);

    // Struggle score (as per ML training): exam_fail_count + submission_fail_count * 2
    const struggle_score = exam_fail_count + (submission_fail_count * 2);

    // Optimal study time
    const hourCounts = {};
    studyHours.forEach(h => {
      const period = h >= 5 && h < 11 ? "Pagi" 
                   : h >= 11 && h < 15 ? "Siang"
                   : h >= 15 && h < 19 ? "Sore"
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
      completion_speed: Math.round(completion_speed * 100) / 100,
      study_consistency_std: Math.round(study_consistency_std * 100) / 100,
      study_consistency_ratio: Math.round(study_consistency_ratio * 100) / 100,
      avg_study_hour: Math.round(avg_study_hour * 100) / 100,
      completed_modules,
      total_modules_viewed,
      avg_exam_score: Math.round(avg_exam_score * 100) / 100,
      submission_fail_rate: Math.round(submission_fail_rate * 100) / 100,
      performance_score: Math.round(performance_score * 100) / 100,
      struggle_score: Math.round(struggle_score * 100) / 100,
      retry_count,
      total_courses_enrolled,
      courses_completed,
      optimal_study_time,
      difficulty,
      avg_submission_rating: Math.round(avg_submission_rating * 100) / 100,
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
          study_consistency_ratio: features.study_consistency_ratio,
          avg_study_hour: features.avg_study_hour,
          completed_modules: features.completed_modules,
          total_modules_viewed: features.total_modules_viewed,
          avg_exam_score: features.avg_exam_score,
          submission_fail_rate: features.submission_fail_rate,
          performance_score: features.performance_score,
          struggle_score: features.struggle_score,
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

    // Get persona prediction
    let personaResult = null;
    try {
      const res = await axios.post(`${mlUrl}/api/v1/persona/predict`, {
        user_id: userId,
        features: {
          study_consistency_std: features.study_consistency_std,
          total_modules_viewed: features.total_modules_viewed,
          submission_fail_rate: features.submission_fail_rate,
          retry_count: features.retry_count,
          avg_submission_rating: features.avg_submission_rating,
          difficulty: features.difficulty,
        },
      });
      personaResult = res.data;
    } catch (e) {
      console.error("ML Persona Error:", e.message);
      if (e.response) {
        console.error("Response data:", JSON.stringify(e.response.data, null, 2));
        console.error("Response status:", e.response.status);
      }
      personaResult = {
        persona_label: "The Consistent",
        cluster_id: 0,
        confidence: 0.5,
        description: "Belajar secara konsisten dan teratur",
        criteria: "study_consistency_std rendah",
        characteristics: ["Belajar secara konsisten"],
      };
    }

    // Update advice with persona context if available
    if (personaResult && adviceResult) {
      adviceResult.persona_context = personaResult.persona_label;
    }

    // Simpan ke database
    const insightData = {
      persona: personaResult,
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
