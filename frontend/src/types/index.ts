export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  image_path?: string;
}

export interface Course {
  id: number;
  name: string;
  summary: string;
  description?: string;
  image_path?: string;
  point: number;
  image: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published";
  // Field khusus dashboard siswa
  progress?: number;
  last_activity?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface CourseDetail {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  point: number;
  difficulty: string;
  instructor?: { name: string };

  // State dari Backend
  is_enrolled: boolean;
  progress: number;
  cta_state: "enroll" | "continue";
  last_accessed_tutorial_id: number | null;

  // Silabus
  developer_journey_tutorials: {
    user_status: string;
    id: number;
    title: string;
    type: string;
    is_locked: boolean;
    is_completed: boolean;
  }[];
}

export interface Module {
  id: number;
  developer_journey_id: number;
  title: string;
  type: "article" | "video" | "quiz" | "submission";
  content?: string; // HTML content atau URL Video
  position: number;
  status: "draft" | "published";
  current_status?: "viewed" | "in_progress" | "submitted" | "finished";
  submission_status?: "submitted" | "passed" | "failed" | null;
  submission_note?: string | null;
  next_tutorial_id?: number | null;
}

export interface CompletionResponse {
  tutorial_id: number;
  is_completed: boolean;
  course_progress: number;
  course_status: string;
  next_tutorial_id: number | null;
}

export interface AIInsight {
  generated_at: string;
  persona?: {
    cluster_id: number;
    persona_label: string;
    confidence: number;
    characteristics: string[];
  };
  pace?: {
    pace_label: string;
    confidence?: number;
    insight: string;
  };
  advice?: {
    advice_text: string;
    user_id: number;
  };
  features?: {
    optimal_study_time?: string;
    total_courses_enrolled?: number;
    courses_completed?: number;
    completed_modules?: number;
    total_modules_viewed?: number;
    avg_exam_score?: number;
  };
}

// Dashboard Stats
export interface DashboardStats {
  stats: {
    total_courses: number;
    completed_courses: number;
    in_progress_courses: number;
    total_study_hours: number;
    avg_quiz_score: number;
  };
  active_courses: {
    id: number;
    name: string;
    image_path: string | null;
    difficulty: string;
    progress: number;
    last_activity: string;
  }[];
  recent_activities: {
    id: number;
    type: string;
    title: string;
    course_id: number;
    course_name: string;
    status: string;
    last_viewed: string;
  }[];
}

// My Courses Detailed
export interface MyCoursesDetailed {
  all: CourseEnrollment[];
  in_progress: CourseEnrollment[];
  completed: CourseEnrollment[];
  not_started: CourseEnrollment[];
  summary: {
    total: number;
    in_progress: number;
    completed: number;
    not_started: number;
  };
}

export interface CourseEnrollment {
  id: number;
  name: string;
  summary: string;
  image_path: string | null;
  point: number;
  difficulty: string;
  total_modules: number;
  progress: number;
  status: string;
  enrolled_at: string;
  last_activity: string;
}
