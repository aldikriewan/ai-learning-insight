// Mock Data untuk demo frontend tanpa backend
// Data ini akan digunakan ketika backend tidak tersedia

export const MOCK_USER = {
  id: 1,
  name: "Andi Pratama",
  email: "andi.pratama@student.co.id",
  role: "student" as const,
  image_path: "https://i.pravatar.cc/150?u=andi.pratama@student.co.id",
};

export const MOCK_TOKEN = "mock_token_for_demo_123456789";

export const MOCK_COURSES = [
  {
    id: 1,
    name: "Belajar Fundamental Aplikasi Android",
    summary: "Kelas dasar Android untuk memahami komponen, state, dan props.",
    description: "Materi ini cocok untuk menguji alur belajar Android dari awal sampai praktik sederhana.",
    image_path: "https://picsum.photos/seed/android/900/600",
    image: "https://picsum.photos/seed/android/900/600",
    point: 60,
    difficulty: "beginner" as const,
    status: "published" as const,
    progress: 75,
    last_activity: "2026-08-10T10:30:00Z",
  },
  {
    id: 2,
    name: "Belajar Dasar Pemrograman Web",
    summary: "Kelas dasar web programming untuk memahami HTML, CSS, dan JavaScript.",
    description: "Materi ini cocok untuk menguji alur belajar frontend dari awal.",
    image_path: "https://picsum.photos/seed/web/900/600",
    image: "https://picsum.photos/seed/web/900/600",
    point: 40,
    difficulty: "beginner" as const,
    status: "published" as const,
    progress: 100,
    last_activity: "2026-08-09T14:00:00Z",
  },
  {
    id: 3,
    name: "Memulai Pemrograman dengan Python",
    summary: "Pengenalan Python untuk pemula absolut.",
    description: "Cocok untuk siswa yang baru pertama kali belajar pemrograman.",
    image_path: "https://picsum.photos/seed/python/900/600",
    image: "https://picsum.photos/seed/python/900/600",
    point: 60,
    difficulty: "beginner" as const,
    status: "published" as const,
    progress: 30,
    last_activity: "2026-08-08T09:15:00Z",
  },
  {
    id: 4,
    name: "Belajar Machine Learning untuk Pemula",
    summary: "Pengenalan Machine Learning untuk pemula.",
    description: "Materi ini cocok untuk siswa yang baru mulai belajar ML.",
    image_path: "https://picsum.photos/seed/ml/900/600",
    image: "https://picsum.photos/seed/ml/900/600",
    point: 110,
    difficulty: "intermediate" as const,
    status: "published" as const,
    progress: 0,
    last_activity: "2026-08-07T16:45:00Z",
  },
  {
    id: 5,
    name: "Belajar Dasar Git dengan GitHub",
    summary: "Git dan GitHub untuk pemula.",
    description: "Kelas ini membantu membuat fondasi version control yang solid.",
    image_path: "https://picsum.photos/seed/git/900/600",
    image: "https://picsum.photos/seed/git/900/600",
    point: 40,
    difficulty: "beginner" as const,
    status: "published" as const,
    progress: 100,
    last_activity: "2026-08-06T11:20:00Z",
  },
  {
    id: 6,
    name: "Belajar Fundamental Back-End dengan JavaScript",
    summary: "Back-end JavaScript fundamental untuk developer.",
    description: "Kelas ini membantu membuat fondasi back-end yang solid.",
    image_path: "https://picsum.photos/seed/backend/900/600",
    image: "https://picsum.photos/seed/backend/900/600",
    point: 220,
    difficulty: "intermediate" as const,
    status: "published" as const,
    progress: 0,
    last_activity: "2026-08-05T08:00:00Z",
  },
];

export const MOCK_INSIGHT = {
  generated_at: new Date().toISOString(),
  pace: {
    user_id: 1,
    journey_id: 1,
    journey_name: "Belajar Fundamental Aplikasi Android",
    pace_label: "fast learner",
    pace_percentage: 85.5,
    cluster_id: 1,
    confidence: 0.973,
    insight: "Kamu belajar dengan cepat dan efisien. Pertahankan momentum ini! 🚀",
    user_duration_hours: 45.2,
    avg_duration_hours: 68.5,
    expected_duration_hours: 140,
    percentile_rank: 82,
  },
  advice: {
    user_id: 1,
    name: "Andi Pratama",
    advice_text: "Hai Andi! 🚀 Keren banget! Sebagai **fast learner**, kamu cepat menyerap materi dan efisien dalam belajar. Saatnya naik level - explore materi advanced atau bantu teman belajar. Waktu **Pagi** adalah golden hour-mu untuk deep work. Keep pushing, Andi! 💪✨",
    persona_context: "",
    pace_context: "fast learner",
  },
  features: {
    optimal_study_time: "Pagi",
    total_courses_enrolled: 6,
    courses_completed: 2,
    completed_modules: 45,
    total_modules_viewed: 60,
    avg_exam_score: 87.5,
    completion_speed: 0.45,
    study_consistency_std: 2.1,
    study_consistency_ratio: 0.85,
    submission_fail_rate: 0.05,
    performance_score: 88.3,
    struggle_score: 3.0,
    retry_count: 1,
    avg_study_hour: 14.5,
  },
};

export const MOCK_FOCUS_TIME = {
  distribution: [
    { name: "Pagi", value: 35, count: 28 },
    { name: "Siang", value: 25, count: 20 },
    { name: "Sore", value: 20, count: 16 },
    { name: "Malam", value: 20, count: 16 },
  ],
  optimal_period: "Pagi",
  optimal_time_range: "07:00 - 11:00",
  total_activities: 80,
};

export const MOCK_COURSE_DETAIL = {
  id: 1,
  name: "Belajar Fundamental Aplikasi Android",
  description: "Materi ini cocok untuk menguji alur belajar Android dari awal sampai praktik sederhana. Anda akan mempelajari komponen dasar, state management, dan best practices dalam pengembangan aplikasi Android modern.",
  image_path: "https://picsum.photos/seed/android/900/600",
  point: 60,
  difficulty: "beginner",
  instructor: { name: "Admin LMS" },
  is_enrolled: true,
  progress: 75,
  cta_state: "continue" as const,
  last_accessed_tutorial_id: 4,
  developer_journey_tutorials: [
    { user_status: "finished", id: 1, title: "Pendahuluan Android", type: "article", is_locked: false, is_completed: true },
    { user_status: "finished", id: 2, title: "Setup Environment Android", type: "video", is_locked: false, is_completed: true },
    { user_status: "finished", id: 3, title: "Quiz Dasar Android", type: "quiz", is_locked: false, is_completed: true },
    { user_status: "finished", id: 4, title: "Latihan Praktik Android", type: "submission", is_locked: false, is_completed: true },
    { user_status: "viewed", id: 5, title: "Komponen UI Dasar", type: "article", is_locked: false, is_completed: false },
    { user_status: "in_progress", id: 6, title: "Quiz Komponen UI", type: "quiz", is_locked: false, is_completed: false },
    { user_status: "locked", id: 7, title: "Proyek Akhir Android", type: "submission", is_locked: true, is_completed: false },
  ],
};

export const MOCK_MODULE = {
  id: 4,
  developer_journey_id: 1,
  title: "Latihan Praktik Android",
  type: "submission" as const,
  content: "<h1>Latihan Praktik Android</h1><p>Buatlah aplikasi Android sederhana yang menampilkan daftar item menggunakan RecyclerView. Pastikan aplikasi Anda memiliki:</p><ul><li>Activity utama dengan RecyclerView</li><li>Adapter untuk menampilkan data</li><li>Data class untuk model item</li></ul><p>Upload link repository GitHub Anda pada form submission di bawah.</p>",
  position: 4,
  status: "published" as const,
  current_status: "finished" as const,
  submission_status: "passed" as const,
  submission_note: "Bagus! Struktur kode sudah rapi dan mengikuti best practices.",
  next_tutorial_id: 5,
};

export const MOCK_COMPLETION = {
  tutorial_id: 4,
  is_completed: true,
  course_progress: 75,
  course_status: "active",
  next_tutorial_id: 5,
};

// Fungsi untuk mendapatkan response mock berdasarkan URL
export function getMockResponse(url: string, method: string, data?: any): any {
  // Login
  if (url === "/auth/login" && method === "post") {
    return {
      status: "success",
      message: "Login berhasil",
      data: {
        token: MOCK_TOKEN,
        user: MOCK_USER,
      },
    };
  }

  // Register
  if (url === "/auth/register" && method === "post") {
    return {
      status: "success",
      message: "Registrasi berhasil",
      data: {
        token: MOCK_TOKEN,
        user: {
          ...MOCK_USER,
          name: data?.name || "User Baru",
          email: data?.email || "user@example.com",
        },
      },
    };
  }

  // Get current user
  if (url === "/auth/me" && method === "get") {
    return {
      status: "success",
      data: MOCK_USER,
    };
  }

  // Student dashboard
  if (url === "/student/my-courses" && method === "get") {
    return {
      status: "success",
      data: MOCK_COURSES,
    };
  }

  // Student insights
  if (url === "/student/insights" && method === "get") {
    return {
      status: "success",
      data: MOCK_INSIGHT,
    };
  }

  // Generate insight
  if (url === "/student/insights/generate" && method === "post") {
    return {
      status: "success",
      data: MOCK_INSIGHT,
    };
  }

  // Focus time
  if (url === "/student/focus-time" && method === "get") {
    return {
      status: "success",
      data: MOCK_FOCUS_TIME,
    };
  }

  // Course detail
  if (url.match(/^\/courses\/\d+$/) && method === "get") {
    return {
      status: "success",
      data: MOCK_COURSE_DETAIL,
    };
  }

  // All courses (catalog)
  if (url === "/courses" && method === "get") {
    return {
      status: "success",
      data: MOCK_COURSES,
    };
  }

  // Module detail
  if (url.match(/^\/courses\/module\/\d+$/) && method === "get") {
    return {
      status: "success",
      data: MOCK_MODULE,
    };
  }

  // Complete module
  if (url.match(/^\/courses\/module\/\d+\/complete$/) && method === "post") {
    return {
      status: "success",
      data: MOCK_COMPLETION,
    };
  }

  // Enroll course
  if (url.match(/^\/courses\/\d+\/enroll$/) && method === "post") {
    return {
      status: "success",
      message: "Berhasil mendaftar kelas",
      data: { enrollment_id: 123, status: "active" },
    };
  }

  // ML pace analyze
  if (url === "/ml/pace/analyze" && method === "post") {
    return {
      status: "success",
      data: {
        user_id: data?.user_id || 1,
        pace_label: "fast learner",
        confidence: 0.973,
        insight: "Kamu belajar dengan cepat dan efisien. Pertahankan momentum ini! 🚀",
      },
    };
  }

  // ML advice generate
  if (url === "/ml/advice/generate" && method === "post") {
    return {
      status: "success",
      data: {
        user_id: data?.user_id || 1,
        name: data?.name || "Andi",
        advice_text: "Hai Andi! 🚀 Keren banget! Sebagai fast learner, kamu cepat menyerap materi. Saatnya naik level - explore materi advanced atau bantu teman belajar. Keep pushing! 💪✨",
        persona_context: "",
        pace_context: "fast learner",
      },
    };
  }

  // Health check
  if (url === "/health" && method === "get") {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      models_loaded: {
        pace_model: true,
        advice_generator: true,
      },
    };
  }

  // Default fallback
  return null;
}