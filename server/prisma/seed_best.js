const DEFAULT_PASSWORD = "password123";

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const SEED_NAME = "best";
const SEED_TAG = `seed_${SEED_NAME}`;

const ADMIN = {
  name: "Admin LMS",
  email: "admin@lms.com",
};

const STUDENTS = [
  { name: "Andi Pratama", email: "andi.pratama@student.co.id", behavior: "fast" },
  { name: "Siti Aisyah", email: "siti.aisyah@student.co.id", behavior: "consistent" },
  { name: "Rizky Maulana", email: "rizky.maulana@student.co.id", behavior: "nightowl" },
  { name: "Dewi Lestari", email: "dewi.lestari@student.co.id", behavior: "reflective" },
  { name: "Bima Saputra", email: "bima.saputra@student.co.id", behavior: "struggler" },
  { name: "Nabila Putri", email: "nabila.putri@student.co.id", behavior: "consistent" },
  { name: "Fajar Hidayat", email: "fajar.hidayat@student.co.id", behavior: "fast" },
  { name: "Intan Permata", email: "intan.permata@student.co.id", behavior: "struggler" },
  { name: "Cindy Wijaya", email: "cindy.wijaya@student.co.id", behavior: "fast" },
  { name: "David Santoso", email: "david.santoso@student.co.id", behavior: "consistent" },
  { name: "Evelyn Kusuma", email: "evelyn.kusuma@student.co.id", behavior: "nightowl" },
  { name: "Felix Pratama", email: "felix.pratama@student.co.id", behavior: "reflective" },
  { name: "Gina Sari", email: "gina.sari@student.co.id", behavior: "struggler" },
  { name: "Hendra Gunawan", email: "hendra.gunawan@student.co.id", behavior: "consistent" },
  { name: "Iris Novita", email: "iris.novita@student.co.id", behavior: "fast" },
  { name: "Joko Widodo", email: "joko.widodo@student.co.id", behavior: "consistent" },
  { name: "Kurniawati", email: "kurniawati@student.co.id", behavior: "fast" },
  { name: "Lukman Hakim", email: "lukman.hakim@student.co.id", behavior: "struggler" },
  { name: "Maya Putri", email: "maya.putri@student.co.id", behavior: "reflective" },
  { name: "Nanda Pratama", email: "nanda.pratama@student.co.id", behavior: "nightowl" },
  { name: "Oktavia Sari", email: "oktavia.sari@student.co.id", behavior: "consistent" },
  { name: "Pasaribu", email: "pasaribu@student.co.id", behavior: "fast" },
  { name: "Qonita Azzahra", email: "qonita.azzahra@student.co.id", behavior: "struggler" },
  { name: "Rahmat Firdaus", email: "rahmat.firdaus@student.co.id", behavior: "consistent" },
  { name: "Salsa Mumtaz", email: "salsa.mumtaz@student.co.id", behavior: "reflective" },
];

const BEHAVIORS = {
  fast: {
    enrollments: [4, 5],
    hourWindows: [[7, 9], [10, 11], [13, 15]],
    dayGap: [1, 2],
    completionRate: [0.8, 1.0],
    completionSpeed: [0.3, 0.55],
    examScore: [85, 98],
    failRate: [0.0, 0.1],
    submissionStates: ["passed", "submitted", "passed"],
    retryCount: [0, 1],
    avgSubmissionRating: [4.4, 5.0],
    quizScore: [82, 97],
  },
  consistent: {
    enrollments: [3, 4],
    hourWindows: [[7, 10], [13, 16]],
    dayGap: [2, 4],
    completionRate: [0.65, 0.9],
    completionSpeed: [0.7, 1.2],
    examScore: [72, 90],
    failRate: [0.1, 0.25],
    submissionStates: ["submitted", "passed", "under_review"],
    retryCount: [0, 1],
    avgSubmissionRating: [3.5, 4.4],
    quizScore: [65, 88],
  },
  nightowl: {
    enrollments: [4, 5],
    hourWindows: [[20, 23], [0, 2]],
    dayGap: [2, 4],
    completionRate: [0.7, 0.95],
    completionSpeed: [0.6, 1.1],
    examScore: [70, 92],
    failRate: [0.08, 0.2],
    submissionStates: ["submitted", "passed", "under_review"],
    retryCount: [0, 2],
    avgSubmissionRating: [3.8, 4.8],
    quizScore: [68, 92],
  },
  reflective: {
    enrollments: [3, 4],
    hourWindows: [[19, 23], [21, 23]],
    dayGap: [4, 7],
    completionRate: [0.55, 0.8],
    completionSpeed: [1.5, 2.5],
    examScore: [78, 96],
    failRate: [0.05, 0.18],
    submissionStates: ["submitted", "passed"],
    retryCount: [1, 2],
    avgSubmissionRating: [4.0, 4.9],
    quizScore: [76, 94],
  },
  struggler: {
    enrollments: [2, 3],
    hourWindows: [[20, 23], [0, 2], [10, 12]],
    dayGap: [4, 8],
    completionRate: [0.25, 0.5],
    completionSpeed: [1.2, 2.2],
    examScore: [35, 65],
    failRate: [0.45, 0.8],
    submissionStates: ["failed", "revision_requested", "failed"],
    retryCount: [2, 4],
    avgSubmissionRating: [1.8, 3.0],
    quizScore: [30, 64],
  },
};

const COURSE_BLUEPRINTS = [
  { name: "Belajar Fundamental Aplikasi Android", summary: "Kelas dasar Android untuk memahami komponen, state, dan props.", description: "Materi ini cocok untuk menguji alur belajar Android dari awal sampai praktik sederhana.", difficulty: "beginner", point: 60, hours_to_study: 140 },
  { name: "Belajar Membuat Aplikasi Android untuk Pemula", summary: "Kelas Android pemula untuk memahami dasar-dasar pengembangan mobile.", description: "Materi ini cocok untuk siswa baru yang ingin mulai belajar Android.", difficulty: "beginner", point: 40, hours_to_study: 60 },
  { name: "Memulai Pemrograman dengan Kotlin", summary: "Pengenalan bahasa pemrograman Kotlin untuk Android development.", description: "Kelas ini meniru alur belajar Kotlin yang umum dipakai di proyek Android.", difficulty: "beginner", point: 40, hours_to_study: 50 },
  { name: "Memulai Pemrograman dengan Python", summary: "Pengenalan Python untuk pemula absolut.", description: "Cocok untuk siswa yang baru pertama kali belajar pemrograman.", difficulty: "beginner", point: 60, hours_to_study: 60 },
  { name: "Belajar Dasar Pemrograman Web", summary: "Kelas dasar web programming untuk memahami HTML, CSS, dan JavaScript.", description: "Materi ini cocok untuk menguji alur belajar frontend dari awal.", difficulty: "beginner", point: 40, hours_to_study: 45 },
  { name: "Menjadi Google Cloud Engineer", summary: "Persiapan sertifikasi Google Cloud Engineer.", description: "Kelas ini meniru alur belajar cloud computing yang umum di industri.", difficulty: "intermediate", point: 110, hours_to_study: 42 },
  { name: "Memulai Pemrograman Dengan Swift", summary: "Pengenalan Swift untuk iOS development.", description: "Cocok untuk siswa yang ingin mulai belajar pengembangan iOS.", difficulty: "beginner", point: 40, hours_to_study: 40 },
  { name: "Belajar Membuat Aplikasi Flutter untuk Pemula", summary: "Kelas Flutter dasar untuk memahami widgets dan state management.", description: "Materi ini cocok untuk menguji alur belajar Flutter dari awal.", difficulty: "beginner", point: 40, hours_to_study: 40 },
  { name: "Belajar Fundamental Front-End Web Development", summary: "Kelas frontend untuk memahami React, Vue, dan CSS modern.", description: "Kelas ini meniru alur belajar frontend yang umum dipakai di perusahaan.", difficulty: "beginner", point: 40, hours_to_study: 80 },
  { name: "Menjadi Android Developer Expert", summary: "Kelas lanjutan Android untuk developer yang sudah mahir.", description: "Materi advanced untuk menjadi Android Developer Expert.", difficulty: "advanced", point: 110, hours_to_study: 90 },
  { name: "Belajar Membuat Aplikasi iOS untuk Pemula", summary: "Kelas iOS dasar untuk memahami SwiftUI dan UIKit.", description: "Cocok untuk siswa yang ingin mulai belajar pengembangan iOS.", difficulty: "beginner", point: 40, hours_to_study: 40 },
  { name: "Belajar Dasar Visualisasi Data", summary: "Pengenalan visualisasi data dengan Python dan JavaScript.", description: "Kelas ini membantu membuat visualisasi yang lebih natural untuk data aplikasi.", difficulty: "beginner", point: 40, hours_to_study: 16 },
  { name: "Belajar Machine Learning untuk Pemula", summary: "Pengenalan Machine Learning untuk pemula.", description: "Materi ini cocok untuk siswa yang baru mulai belajar ML.", difficulty: "beginner", point: 110, hours_to_study: 90 },
  { name: "Belajar Fundamental Deep Learning", summary: "Deep Learning untuk yang sudah menguasai Machine Learning.", description: "Kelas ini meniru alur belajar Deep Learning yang umum di akademik.", difficulty: "advanced", point: 320, hours_to_study: 110 },
  { name: "Memulai Pemrograman dengan Dart", summary: "Pengenalan Dart untuk Flutter development.", description: "Cocok untuk siswa yang ingin mulai belajar Flutter dari nol.", difficulty: "beginner", point: 40, hours_to_study: 30 },
  { name: "Belajar Fundamental Aplikasi Flutter", summary: "Flutter fundamental untuk membangun aplikasi mobile cross-platform.", description: "Kelas ini membantu membuat fondasi Flutter yang solid.", difficulty: "intermediate", point: 220, hours_to_study: 90 },
  { name: "Menjadi Flutter Developer Expert", summary: "Flutter expert level untuk developer yang sudah mahir.", description: "Materi advanced untuk menjadi Flutter Developer Expert.", difficulty: "advanced", point: 110, hours_to_study: 85 },
  { name: "Belajar Fundamental Aplikasi iOS", summary: "iOS fundamental untuk membangun aplikasi Apple.", description: "Kelas ini membantu membuat fondasi iOS yang solid.", difficulty: "intermediate", point: 220, hours_to_study: 70 },
  { name: "Menjadi iOS Developer Expert", summary: "iOS expert level untuk developer yang sudah mahir.", description: "Materi advanced untuk menjadi iOS Developer Expert.", difficulty: "advanced", point: 110, hours_to_study: 70 },
  { name: "Belajar Pengembangan Web Intermediate", summary: "Web development intermediate untuk yang sudah menguasai dasar.", description: "Kelas ini meniru alur belajar web intermediate yang umum di bootcamp.", difficulty: "intermediate", point: 110, hours_to_study: 80 },
  { name: "Belajar Dasar Cloud dan Gen AI di AWS", summary: "Pengenalan cloud computing dan generative AI di AWS.", description: "Kelas ini membantu membuat fondasi cloud dan AI yang solid.", difficulty: "beginner", point: 80, hours_to_study: 18 },
  { name: "Belajar Dasar Pemrograman JavaScript", summary: "JavaScript dasar untuk pemula.", description: "Cocok untuk siswa yang baru mulai belajar JavaScript.", difficulty: "beginner", point: 80, hours_to_study: 46 },
  { name: "Belajar Back-End Pemula dengan JavaScript", summary: "Back-end JavaScript untuk pemula menggunakan Node.js.", description: "Kelas ini meniru alur belajar back-end yang umum di bootcamp.", difficulty: "beginner", point: 80, hours_to_study: 50 },
  { name: "Architecting on AWS", summary: "Arsitektur cloud di AWS untuk profesional.", description: "Kelas ini membantu membuat arsitektur cloud yang lebih natural.", difficulty: "intermediate", point: 110, hours_to_study: 40 },
  { name: "Belajar Fundamental Back-End dengan JavaScript", summary: "Back-end JavaScript fundamental untuk developer.", description: "Kelas ini membantu membuat fondasi back-end yang solid.", difficulty: "intermediate", point: 220, hours_to_study: 90 },
  { name: "Menjadi Back-End Developer Expert dengan JavaScript", summary: "Back-end expert level untuk developer JavaScript yang sudah mahir.", description: "Materi advanced untuk menjadi Back-End Developer Expert.", difficulty: "advanced", point: 320, hours_to_study: 82 },
  { name: "Simulasi Ujian Associate Cloud Engineer", summary: "Simulasi ujian sertifikasi cloud engineer.", description: "Kelas ini berguna untuk persiapan sertifikasi cloud.", difficulty: "beginner", point: 0, hours_to_study: 25 },
  { name: "Meniti Karier sebagai Software Developer", summary: "Panduan karier untuk menjadi software developer.", description: "Kelas ini membantu membuat perencanaan karier yang lebih natural.", difficulty: "beginner", point: 40, hours_to_study: 7 },
  { name: "Pengenalan ke Logika Pemrograman", summary: "Pengenalan logika pemrograman untuk pemula.", description: "Kelas ini cocok untuk siswa yang baru mulai belajar coding.", difficulty: "beginner", point: 40, hours_to_study: 6 },
  { name: "Belajar Membuat Front-End Web untuk Pemula", summary: "Front-end web untuk pemula absolut.", description: "Materi ini cocok untuk menguji alur belajar frontend dari nol.", difficulty: "beginner", point: 40, hours_to_study: 45 },
  { name: "Belajar Dasar Git dengan GitHub", summary: "Git dan GitHub untuk pemula.", description: "Kelas ini membantu membuat fondasi version control yang solid.", difficulty: "beginner", point: 40, hours_to_study: 15 },
  { name: "Machine Learning Terapan", summary: "Machine Learning terapan untuk industri.", description: "Kelas ini meniru alur belajar ML terapan yang umum di perusahaan.", difficulty: "intermediate", point: 320, hours_to_study: 80 },
  { name: "Menjadi Google Cloud Architect", summary: "Arsitektur cloud Google untuk profesional.", description: "Materi advanced untuk menjadi Google Cloud Architect.", difficulty: "advanced", point: 220, hours_to_study: 35 },
  { name: "Belajar Dasar UX Design", summary: "UX Design dasar untuk pemula.", description: "Kelas ini cocok untuk siswa yang ingin belajar desain pengalaman pengguna.", difficulty: "beginner", point: 40, hours_to_study: 36 },
  { name: "Belajar Dasar Google Cloud", summary: "Google Cloud dasar untuk pemula.", description: "Kelas ini membantu membuat fondasi cloud Google yang solid.", difficulty: "beginner", point: 80, hours_to_study: 12 },
  { name: "Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud", summary: "Back-end dengan Google Cloud untuk pemula.", description: "Kelas ini meniru alur belajar back-end cloud yang umum.", difficulty: "intermediate", point: 80, hours_to_study: 45 },
  { name: "Belajar Pengembangan Aplikasi Android Intermediate", summary: "Android intermediate untuk developer yang sudah menguasai dasar.", description: "Materi menengah untuk pengembangan Android yang lebih kompleks.", difficulty: "intermediate", point: 320, hours_to_study: 150 },
  { name: "Belajar Dasar-Dasar DevOps", summary: "DevOps dasar untuk pemula.", description: "Kelas ini cocok untuk siswa yang ingin belajar praktik DevOps.", difficulty: "beginner", point: 60, hours_to_study: 15 },
  { name: "Belajar Jaringan Komputer untuk Pemula", summary: "Jaringan komputer dasar untuk pemula.", description: "Kelas ini membantu membuat pemahaman jaringan yang lebih natural.", difficulty: "beginner", point: 80, hours_to_study: 25 },
  { name: "Belajar Membuat Aplikasi Web dengan React", summary: "React untuk membangun aplikasi web modern.", description: "Kelas ini meniru alur belajar React yang umum di bootcamp.", difficulty: "beginner", point: 80, hours_to_study: 35 },
  { name: "Belajar Fundamental Aplikasi Web dengan React", summary: "React fundamental untuk membangun aplikasi web.", description: "Kelas ini membantu membuat fondasi React yang solid.", difficulty: "intermediate", point: 220, hours_to_study: 55 },
  { name: "Menjadi React Web Developer Expert", summary: "React expert level untuk developer web yang sudah mahir.", description: "Materi advanced untuk menjadi React Web Developer Expert.", difficulty: "advanced", point: 320, hours_to_study: 70 },
  { name: "Menjadi Linux System Administrator", summary: "Linux admin untuk pemula.", description: "Kelas ini cocok untuk siswa yang ingin belajar administrasi Linux.", difficulty: "beginner", point: 220, hours_to_study: 25 },
  { name: "Belajar Implementasi CI/CD", summary: "CI/CD implementation untuk DevOps.", description: "Kelas ini meniru alur belajar CI/CD yang umum di perusahaan.", difficulty: "intermediate", point: 220, hours_to_study: 30 },
  { name: "Belajar Membangun Arsitektur Microservices", summary: "Microservices architecture untuk developer.", description: "Kelas ini membantu membuat pemahaman microservices yang lebih natural.", difficulty: "intermediate", point: 320, hours_to_study: 60 },
  { name: "Machine Learning Operations (MLOps)", summary: "MLOps untuk mengelola pipeline machine learning.", description: "Kelas ini meniru alur belajar MLOps yang umum di industri.", difficulty: "advanced", point: 320, hours_to_study: 80 },
  { name: "Belajar Membuat Aplikasi Android dengan Jetpack Compose", summary: "Android modern dengan Jetpack Compose.", description: "Kelas ini meniru alur belajar Jetpack Compose yang umum di Android development.", difficulty: "intermediate", point: 320, hours_to_study: 50 },
  { name: "Belajar Pengembangan Aplikasi Flutter Intermediate", summary: "Flutter intermediate untuk developer yang sudah menguasai dasar.", description: "Materi menengah untuk pengembangan Flutter yang lebih kompleks.", difficulty: "intermediate", point: 320, hours_to_study: 80 },
  { name: "Belajar Analisis Data dengan Python", summary: "Analisis data menggunakan Python.", description: "Kelas ini cocok untuk siswa yang ingin belajar data analysis.", difficulty: "intermediate", point: 110, hours_to_study: 70 },
  { name: "Belajar Toolset untuk Pengembangan Front-End Web", summary: "Toolset frontend untuk developer web.", description: "Kelas ini membantu membuat pemahaman toolset frontend yang lebih natural.", difficulty: "intermediate", point: 320, hours_to_study: 65 },
  { name: "Belajar Pemrograman Fungsional dengan Haskell", summary: "Pemrograman fungsional dengan Haskell.", description: "Kelas ini cocok untuk siswa yang ingin belajar paradigma fungsional.", difficulty: "intermediate", point: 80, hours_to_study: 20 },
  { name: "Belajar Penerapan Data Science", summary: "Penerapan data science untuk industri.", description: "Kelas ini meniru alur belajar data science yang umum di perusahaan.", difficulty: "advanced", point: 320, hours_to_study: 110 },
  { name: "Belajar Dasar Structured Query Language (SQL)", summary: "SQL dasar untuk pemula.", description: "Kelas ini cocok untuk siswa yang baru mulai belajar database.", difficulty: "beginner", point: 80, hours_to_study: 11 },
  { name: "Menjadi Node.js Application Developer", summary: "Node.js developer untuk membangun aplikasi server.", description: "Kelas ini meniru alur belajar Node.js yang umum di bootcamp.", difficulty: "intermediate", point: 110, hours_to_study: 57 },
  { name: "Belajar Dasar Data Science", summary: "Data Science dasar untuk pemula.", description: "Kelas ini cocok untuk siswa yang ingin belajar data science dari nol.", difficulty: "beginner", point: 60, hours_to_study: 11 },
  { name: "Belajar Pemrograman Prosedural dengan Python", summary: "Pemrograman prosedural dengan Python.", description: "Kelas ini meniru alur belajar Python prosedural yang umum di bootcamp.", difficulty: "beginner", point: 80, hours_to_study: 33 },
  { name: "Belajar Dasar AI", summary: "AI dasar untuk pemula.", description: "Kelas ini cocok untuk siswa yang baru mulai belajar artificial intelligence.", difficulty: "beginner", point: 80, hours_to_study: 10 },
  { name: "Belajar Penerapan Machine Learning dengan Google Cloud", summary: "ML penerapan dengan Google Cloud.", description: "Kelas ini meniru alur belajar ML cloud yang umum di industri.", difficulty: "intermediate", point: 220, hours_to_study: 40 },
  { name: "Belajar Penerapan Machine Learning untuk Android", summary: "ML penerapan untuk Android development.", description: "Kelas ini cocok untuk siswa yang ingin menerapkan ML di Android.", difficulty: "intermediate", point: 320, hours_to_study: 60 },
  { name: "Belajar Strategi Pengembangan Diri", summary: "Strategi pengembangan diri untuk developer.", description: "Kelas ini membantu membuat perencanaan pengembangan diri yang lebih natural.", difficulty: "beginner", point: 80, hours_to_study: 12 },
  { name: "Dev Certification for Machine Learning with Tensorflow", summary: "Sertifikasi ML dengan TensorFlow.", description: "Kelas ini meniru alur belajar sertifikasi ML yang umum di industri.", difficulty: "advanced", point: 0, hours_to_study: 25 },
  { name: "Dev Certification for Android (DCA) Preparation", summary: "Persiapan sertifikasi Android Developer.", description: "Kelas ini cocok untuk siswa yang ingin bersertifikasi Android.", difficulty: "advanced", point: 0, hours_to_study: 40 },
  { name: "Belajar Fundamental Pemrosesan Data", summary: "Pemrosesan data fundamental untuk developer.", description: "Kelas ini membantu membuat pemahaman data processing yang lebih solid.", difficulty: "intermediate", point: 220, hours_to_study: 70 },
  { name: "Membangun Sistem Machine Learning", summary: "Sistem ML untuk deployment dan production.", description: "Kelas ini meniru alur belajar sistem ML yang umum di perusahaan.", difficulty: "advanced", point: 220, hours_to_study: 90 },
  { name: "Belajar Back-End Pemula dengan Python", summary: "Back-end Python untuk pemula.", description: "Kelas ini cocok untuk siswa yang ingin belajar back-end dengan Python.", difficulty: "beginner", point: 80, hours_to_study: 40 },
  { name: "Prompt Engineering untuk Software Developer", summary: "Prompt engineering untuk developer.", description: "Kelas ini meniru alur belajar prompt engineering yang umum di industri.", difficulty: "beginner", point: 60, hours_to_study: 16 },
  { name: "Belajar Penerapan Machine Learning untuk Flutter", summary: "ML penerapan untuk Flutter development.", description: "Kelas ini cocok untuk siswa yang ingin menerapkan ML di Flutter.", difficulty: "intermediate", point: 220, hours_to_study: 60 },
  { name: "Belajar Fundamental Back-End dengan Python", summary: "Back-end Python fundamental untuk developer.", description: "Kelas ini membantu membuat fondasi back-end Python yang solid.", difficulty: "intermediate", point: 220, hours_to_study: 65 },
  { name: "Membangun Proyek Deep Learning Tingkat Mahir", summary: "Proyek Deep Learning tingkat mahir.", description: "Kelas ini meniru alur belajar Deep Learning proyek yang umum di akademik.", difficulty: "advanced", point: 320, hours_to_study: 90 },
  { name: "Belajar Matematika untuk Data Science", summary: "Matematika untuk Data Science.", description: "Kelas ini cocok untuk siswa yang ingin belajar matematika data science.", difficulty: "intermediate", point: 220, hours_to_study: 70 },
  { name: "AI Praktis untuk Produktivitas", summary: "AI praktis untuk produktivitas kerja.", description: "Kelas ini meniru alur belajar AI praktis yang umum di perusahaan.", difficulty: "beginner", point: 60, hours_to_study: 20 },
  { name: "Belajar Penggunaan Generative AI", summary: "Penggunaan Generative AI untuk pemula.", description: "Kelas ini cocok untuk siswa yang baru mulai belajar generative AI.", difficulty: "beginner", point: 60, hours_to_study: 30 },
  { name: "Membangun Aplikasi Gen AI dengan Microsoft Azure", summary: "Gen AI application dengan Azure.", description: "Kelas ini meniru alur belajar Gen AI Azure yang umum di industri.", difficulty: "intermediate", point: 110, hours_to_study: 8 },
  { name: "Belajar Penerapan Data Science dengan Microsoft Fabric", summary: "Data Science dengan Microsoft Fabric.", description: "Kelas ini cocok untuk siswa yang ingin belajar data science dengan Fabric.", difficulty: "intermediate", point: 110, hours_to_study: 6 },
];

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, digits = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(digits));
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function makeStudyDate(baseDate, behavior) {
  const windows = behavior.hourWindows;
  const [startHour, endHour] = pick(windows);
  const date = new Date(baseDate);
  date.setHours(randInt(startHour, endHour), randInt(0, 59), randInt(0, 59), 0);
  return date;
}

function buildModules(courseName) {
  return [
    { title: `Pendahuluan ${courseName}`, type: "article", content: `<h1>Pendahuluan ${courseName}</h1><p>Materi pembuka untuk ${courseName}.</p>`, status: "published" },
    { title: `Setup ${courseName}`, type: "video", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", status: "published" },
    { title: `Quiz Dasar ${courseName}`, type: "quiz", content: `Quiz dasar untuk ${courseName}`, status: "published" },
    { title: `Latihan Praktik ${courseName}`, type: "submission", content: `<p>Kerjakan latihan praktik untuk ${courseName} lalu kirim link aplikasi.</p>`, status: "published" },
    { title: `Ringkasan ${courseName}`, type: "article", content: `<p>Ringkasan dan refleksi belajar untuk ${courseName}.</p>`, status: "published" },
    { title: `Quiz Akhir ${courseName}`, type: "quiz", content: `Quiz akhir untuk ${courseName}`, status: "published" },
  ];
}

function buildQuizQuestions(courseName, tutorialTitle) {
  return [
    { question_text: `Apa tujuan utama dari ${courseName}?`, question_type: "multiple_choice", options: [["Memahami konsep inti", true], ["Membuat akun baru", false], ["Menghapus data lama", false], ["Menutup aplikasi", false]] },
    { question_text: `Bagian mana yang paling relevan dengan ${tutorialTitle}?`, question_type: "multiple_choice", options: [["Praktik bertahap", true], ["Hanya teori tanpa latihan", false], ["Menebak jawaban", false], ["Skip semua modul", false]] },
    { question_text: `Apa yang paling penting saat belajar ${courseName}?`, question_type: "multiple_choice", options: [["Konsistensi belajar", true], ["Mempercepat tanpa paham", false], ["Mengabaikan progress", false], ["Langsung selesai tanpa proses", false]] },
  ];
}

// Convert difficulty string to numeric (matches ML training data)
function difficultyToNum(difficulty) {
  const d = String(difficulty).toLowerCase();
  if (d.includes('beginner') || d === '0') return 0;
  if (d.includes('intermediate') || d === '1') return 1;
  if (d.includes('advanced') || d === '2') return 2;
  if (d.includes('expert') || d === '3') return 3;
  const num = parseInt(d, 10);
  return isNaN(num) ? 0 : num;
}

// Circular mean untuk jam (0-24)
function calcCircularMeanHour(hours) {
  if (!hours.length) return 0;
  const radians = hours.map(h => (h / 24) * 2 * Math.PI);
  const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
  const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
  let meanAngle = Math.atan2(sinSum / hours.length, cosSum / hours.length);
  if (meanAngle < 0) meanAngle += 2 * Math.PI;
  return (meanAngle / (2 * Math.PI)) * 24;
}

// Compute ML features matching exact training formulas (notebook 02)
function computeBehaviorMetrics(student, trackings, submissions, completions, enrollments, examResults, behavior) {
  const studyHours = trackings
    .filter(t => t.last_viewed)
    .map(t => {
      const d = new Date(t.last_viewed);
      return d.getHours() + d.getMinutes() / 60;
    });

  const avgStudyHour = studyHours.length > 0 ? calcCircularMeanHour(studyHours) : 12.0;

  const dates = [...new Set(trackings
    .filter(t => t.last_viewed)
    .map(t => new Date(t.last_viewed).toISOString().split('T')[0])
  )].sort();

  let studyConsistencyStd = 0.0;
  if (dates.length > 1) {
    const gaps = [];
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      gaps.push((d2 - d1) / (1000 * 60 * 60 * 24));
    }
    if (gaps.length > 1) {
      const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const variance = gaps.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (gaps.length - 1);
      studyConsistencyStd = Math.sqrt(variance);
    }
  }

  let studyConsistencyRatio = 0;
  if (dates.length > 0) {
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const dateRange = (lastDate - firstDate) / (1000 * 60 * 60 * 24) + 1;
    studyConsistencyRatio = dates.length / dateRange;
  }

  const completedModules = trackings.filter(t => t.status === 'finished').length;
  const totalModulesViewed = trackings.length;

  const examScores = examResults.map(e => e.score).filter(s => s != null);
  const avgExamScore = examScores.length > 0 ? examScores.reduce((a, b) => a + b, 0) / examScores.length : 75.0;
  const examFailCount = examResults.filter(e => !e.is_passed && e.score != null).length;

  const totalSubmissions = submissions.length;
  const failedSubmissions = submissions.filter(s => ['failed', 'revision_requested', 'rejected'].includes(s.status)).length;
  const submissionFailRate = totalSubmissions > 0 ? failedSubmissions / totalSubmissions : 0.0;

  const retryCount = completions.filter((c) => c.enrolling_times > 1).reduce((a, c) => a + c.enrolling_times, 0);

  const totalCoursesEnrolled = enrollments.length;
  const coursesCompleted = enrollments.filter(e => e.status === 'completed').length;

  const completionSpeeds = completions
    .filter(c => c.study_duration && c.hours_to_study && c.hours_to_study > 0)
    .map(c => Math.min(c.study_duration / c.hours_to_study, 10));
  const completionSpeed = completionSpeeds.length > 0
    ? completionSpeeds.reduce((a, b) => a + b, 0) / completionSpeeds.length
    : 1.0;

  const ratedSubmissions = submissions.filter(s => s.rating && s.rating > 0);
  const avgSubmissionRating = ratedSubmissions.length > 0
    ? ratedSubmissions.reduce((a, s) => a + s.rating, 0) / ratedSubmissions.length
    : 0;

  const performanceScore = (avgExamScore * 0.4) + (avgSubmissionRating * 20 * 0.6);
  const struggleScore = examFailCount + (failedSubmissions * 2);

  const hourCounts = {};
  studyHours.forEach(h => {
    const period = h >= 5 && h < 12 ? "Pagi"
      : h >= 12 && h < 17 ? "Siang"
      : h >= 17 && h < 19 ? "Sore"
      : h >= 19 ? "Malam" : "Dini Hari";
    hourCounts[period] = (hourCounts[period] || 0) + 1;
  });

  let optimalStudyTime = "Pagi";
  let maxCount = 0;
  Object.entries(hourCounts).forEach(([period, count]) => {
    if (count > maxCount) {
      maxCount = count;
      optimalStudyTime = period;
    }
  });

  return {
    avg_study_hour: Math.round(avgStudyHour * 100) / 100,
    study_consistency_std: Math.round(studyConsistencyStd * 100) / 100,
    study_consistency_ratio: Math.round(studyConsistencyRatio * 100) / 100,
    completed_modules: completedModules,
    total_modules_viewed: totalModulesViewed,
    avg_exam_score: Math.round(avgExamScore * 100) / 100,
    submission_fail_rate: Math.round(submissionFailRate * 100) / 100,
    performance_score: Math.round(performanceScore * 100) / 100,
    struggle_score: Math.round(struggleScore * 100) / 100,
    retry_count: retryCount,
    completion_speed: Math.round(completionSpeed * 100) / 100,
    total_courses_enrolled: totalCoursesEnrolled,
    courses_completed: coursesCompleted,
    optimal_study_time: optimalStudyTime,
    difficulty: totalCoursesEnrolled > 0 
      ? enrollments.reduce((sum, e) => sum + (e.difficulty_num || 0), 0) / totalCoursesEnrolled 
      : 0
  };
}

async function cleanupDatabase() {
  await prisma.user_learning_insights.deleteMany();
  await prisma.exam_results.deleteMany();
  await prisma.exam_registrations.deleteMany();
  await prisma.quiz_results.deleteMany();
  await prisma.developer_journey_completions.deleteMany();
  await prisma.developer_journey_submissions.deleteMany();
  await prisma.developer_journey_trackings.deleteMany();
  await prisma.enrollments.deleteMany();
  await prisma.quiz_options.deleteMany();
  await prisma.quiz_questions.deleteMany();
  await prisma.developer_journey_tutorials.deleteMany();
  await prisma.developer_journeys.deleteMany();
  await prisma.users.deleteMany();
}

async function createCourses(adminId) {
  const courses = [];
  for (const blueprint of COURSE_BLUEPRINTS) {
    const course = await prisma.developer_journeys.create({
      data: {
        name: blueprint.name,
        summary: blueprint.summary,
        description: blueprint.description,
        point: blueprint.point,
        required_point: 0,
        difficulty: blueprint.difficulty,
        image_path: `https://picsum.photos/seed/${encodeURIComponent(blueprint.name)}/900/600`,
        status: "published",
        listed: true,
        hours_to_study: blueprint.hours_to_study,
        instructor_id: adminId,
        developer_journey_tutorials: {
          create: buildModules(blueprint.name).map((module, index) => ({
            ...module,
            position: index + 1,
            requirements: [],
          })),
        },
      },
      include: { developer_journey_tutorials: true },
    });
    const orderedTutorials = [...course.developer_journey_tutorials].sort((a, b) => a.position - b.position);
    for (let index = 1; index < orderedTutorials.length; index += 1) {
      await prisma.developer_journey_tutorials.update({
        where: { id: orderedTutorials[index].id },
        data: { requirements: [orderedTutorials[index - 1].id] },
      });
    }
    for (const tutorial of orderedTutorials) {
      if (tutorial.type !== "quiz") continue;
      const questions = buildQuizQuestions(blueprint.name, tutorial.title);
      for (const question of questions) {
        const createdQuestion = await prisma.quiz_questions.create({
          data: { tutorial_id: tutorial.id, question_text: question.question_text, question_type: question.question_type },
        });
        for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
          const [optionText, isCorrect] = question.options[optionIndex];
          await prisma.quiz_options.create({
            data: { question_id: createdQuestion.id, option_text: optionText, is_correct: isCorrect },
          });
        }
      }
    }
    courses.push({ ...course, developer_journey_tutorials: orderedTutorials });
  }
  return courses;
}

async function seedStudentHistory(student, courses) {
  const behavior = BEHAVIORS[student.behavior];
  const enrollCount = randInt(behavior.enrollments[0], behavior.enrollments[1]);
  const enrolledCourses = [...courses].sort(() => Math.random() - 0.5).slice(0, enrollCount);

  const allTrackings = [];
  const allSubmissions = [];
  const allCompletions = [];
  const allEnrollments = [];
  const allExamResults = [];

  for (let courseIndex = 0; courseIndex < enrolledCourses.length; courseIndex += 1) {
    const course = enrolledCourses[courseIndex];
    const tutorials = [...course.developer_journey_tutorials].sort((a, b) => a.position - b.position);
    const completionRatio = randFloat(behavior.completionRate[0], behavior.completionRate[1]);
    const finishedModules = Math.max(1, Math.min(tutorials.length, Math.floor(tutorials.length * completionRatio)));
    const isCompleted = finishedModules >= tutorials.length;
    const enrolledAt = daysAgo(student.createdOffsetDays - courseIndex * 5);
    const dayGap = randInt(behavior.dayGap[0], behavior.dayGap[1]);
    const lastAccessDate = new Date(enrolledAt);
    lastAccessDate.setDate(lastAccessDate.getDate() + finishedModules * dayGap);

    const enrollment = await prisma.enrollments.create({
      data: {
        user_id: student.id,
        journey_id: course.id,
        status: isCompleted ? "completed" : "active",
        enrolled_at: enrolledAt,
        current_progress: parseFloat(((finishedModules / tutorials.length) * 100).toFixed(1)),
        last_accessed_at: lastAccessDate,
      },
    });
    allEnrollments.push({ ...enrollment, difficulty_num: difficultyToNum(course.difficulty) });

    for (let tutorialIndex = 0; tutorialIndex < tutorials.length; tutorialIndex += 1) {
      const tutorial = tutorials[tutorialIndex];
      if (tutorialIndex >= finishedModules) break;

      const studyDate = makeStudyDate(new Date(enrolledAt.getTime() + tutorialIndex * dayGap * 24 * 60 * 60 * 1000), behavior);
      const tracking = await prisma.developer_journey_trackings.create({
        data: {
          developer_id: student.id,
          journey_id: course.id,
          tutorial_id: tutorial.id,
          status: "finished",
          first_opened_at: studyDate,
          last_viewed: new Date(studyDate.getTime() + randInt(20, 120) * 60000),
          completed_at: new Date(studyDate.getTime() + randInt(30, 180) * 60000),
        },
      });
      allTrackings.push(tracking);

      if (tutorial.type === "quiz") {
        const quizScore = randFloat(behavior.quizScore[0], behavior.quizScore[1]);
        const quizResult = await prisma.quiz_results.create({
          data: { user_id: student.id, quiz_id: tutorial.id, score: quizScore, time_taken_seconds: randInt(600, 1800) },
        });
        allExamResults.push(quizResult);
      }

      if (tutorial.type === "submission") {
        const submissionState = pick(behavior.submissionStates);
        const submission = await prisma.developer_journey_submissions.create({
          data: {
            journey_id: course.id,
            quiz_id: tutorial.id,
            submitter_id: student.id,
            status: submissionState,
            app_link: `https://github.com/demo/${student.name.toLowerCase().replace(/\s+/g, "-")}/${course.id}`,
            app_comment: `${student.name} mengerjakan ${course.name} dengan ritme ${student.behavior}.`,
            reviewer_id: null,
            rating: randFloat(behavior.avgSubmissionRating[0], behavior.avgSubmissionRating[1]),
            note: submissionState === "failed" ? "Perlu perbaikan pada struktur dan konsistensi implementasi." : "Progress terlihat valid dan sesuai pola belajar yang dipilih.",
            submission_duration: randInt(600, 7200),
            pass_auto_checker: submissionState === "passed",
          },
        });
        allSubmissions.push(submission);
      }
    }

    if (!isCompleted && finishedModules < tutorials.length) {
      const nextTutorial = tutorials[finishedModules];
      const previewDate = makeStudyDate(new Date(enrolledAt.getTime() + finishedModules * dayGap * 24 * 60 * 60 * 1000), behavior);
      await prisma.developer_journey_trackings.create({
        data: {
          developer_id: student.id,
          journey_id: course.id,
          tutorial_id: nextTutorial.id,
          status: "viewed",
          first_opened_at: previewDate,
          last_viewed: new Date(previewDate.getTime() + randInt(5, 45) * 60000),
        },
      });
    }

    const completionSpeed = randFloat(behavior.completionSpeed[0], behavior.completionSpeed[1]);
    if (isCompleted || completionRatio >= 0.7) {
      const enrollingTimes = randInt(behavior.retryCount[0] + 1, behavior.retryCount[1] + 1);
      const completion = await prisma.developer_journey_completions.create({
        data: {
          user_id: student.id,
          journey_id: course.id,
          study_duration: Math.max(1, Math.round(course.hours_to_study * completionSpeed)),
          avg_submission_rating: randFloat(behavior.avgSubmissionRating[0], behavior.avgSubmissionRating[1]),
          enrolling_times: enrollingTimes,
          last_enrolled_at: new Date(enrolledAt.getTime() + randInt(0, finishedModules * dayGap * 24 * 60 * 60 * 1000)),
        },
      });
      allCompletions.push(completion);
    }

    const quizTutorial = tutorials.find((t) => t.type === "quiz");
    if (quizTutorial) {
      const examRegistration = await prisma.exam_registrations.create({
        data: { exam_module_id: quizTutorial.id, tutorial_id: quizTutorial.id, examinees_id: student.id, status: completionRatio >= 0.6 ? "finished" : "registered" },
      });
      const examScore = randFloat(behavior.examScore[0], behavior.examScore[1]);
      const examResult = await prisma.exam_results.create({
        data: { exam_registration_id: examRegistration.id, total_questions: 10, score: examScore, is_passed: examScore >= 70 },
      });
      allExamResults.push(examResult);
    }
  }

  const metrics = computeBehaviorMetrics(student, allTrackings, allSubmissions, allCompletions, allEnrollments, allExamResults, behavior);

  await prisma.user_learning_insights.createMany({
    data: [
      {
        user_id: student.id,
        insight_key: "persona_prediction",
        insight_val: {
          behavior: student.behavior,
          avg_study_hour_hint: student.behavior === "nightowl" || student.behavior === "reflective" ? "malam" : "pagi/siang",
          completion_ratio: 0.0,
          ...metrics,
        },
      },
      {
        user_id: student.id,
        insight_key: "learning_summary",
        insight_val: {
          enrolled_courses: metrics.total_courses_enrolled,
          completed_courses: metrics.courses_completed,
          last_course: enrolledCourses.length > 0 ? enrolledCourses[enrolledCourses.length - 1].name : "",
          note: `Histori dibuat untuk profil ${student.behavior}.`,
          ...metrics,
        },
      },
      {
        user_id: student.id,
        insight_key: "ml_features",
        insight_val: metrics,
      },
    ],
  });
}

async function main() {
  console.log(`[${SEED_TAG}] Starting seed...`);

  const forceFlag = process.argv.includes("--force");

  const existingUsers = await prisma.users.count();
  const existingJourneys = await prisma.developer_journeys.count();

  if (existingUsers > 0 || existingJourneys > 0) {
    console.warn(`[${SEED_TAG}] ⚠️  Database already contains data:`);
    console.warn(`[${SEED_TAG}]   - ${existingUsers} user(s) existing`);
    console.warn(`[${SEED_TAG}]   - ${existingJourneys} journey(s) existing`);

    if (!forceFlag) {
      console.warn(`[${SEED_TAG}]   Run with --force flag to overwrite existing data.`);
      console.warn(`[${SEED_TAG}]   Aborting. Use: node seed_best.js --force`);
      await prisma.$disconnect();
      process.exit(0);
    }

    console.warn(`[${SEED_TAG}] --force detected. Cleaning existing data before seeding...`);
  }

  await cleanupDatabase();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const admin = await prisma.users.create({
    data: { name: ADMIN.name, email: ADMIN.email, password_hash: passwordHash, user_role: "admin", created_at: daysAgo(365), image_path: "https://i.pravatar.cc/150?u=admin-demo" },
  });

  const students = [];
  for (const studentBlueprint of STUDENTS) {
    const user = await prisma.users.create({
      data: { name: studentBlueprint.name, email: studentBlueprint.email, password_hash: passwordHash, user_role: "student", created_at: daysAgo(randInt(100, 200)), image_path: `https://i.pravatar.cc/150?u=${encodeURIComponent(studentBlueprint.email)}` },
    });
    students.push({ ...user, behavior: studentBlueprint.behavior, createdOffsetDays: randInt(100, 200) });
  }

  const courses = await createCourses(admin.id);

  for (const student of students) {
    await seedStudentHistory(student, courses);
  }

  console.log(`[${SEED_TAG}] Best seed finished successfully.`);
  console.log(`[${SEED_TAG}] Created courses: ${courses.length}`);
  console.log(`[${SEED_TAG}] Created students: ${students.length}`);
  console.log(`[${SEED_TAG}] Default password: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });