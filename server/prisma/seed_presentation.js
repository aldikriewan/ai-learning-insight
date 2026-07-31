const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Helper
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Data kelas
const COURSES = [
  { name: "Mastering Next.js 15", difficulty: "intermediate", hours: 12 },
  { name: "React Fundamentals", difficulty: "beginner", hours: 10 },
  { name: "Vue.js 3 Guide", difficulty: "intermediate", hours: 11 },
  { name: "Angular Enterprise", difficulty: "advanced", hours: 15 },
  { name: "Node.js Backend", difficulty: "intermediate", hours: 14 },
  { name: "Hapi.js API", difficulty: "advanced", hours: 12 },
  { name: "Python Django", difficulty: "intermediate", hours: 13 },
  { name: "Go Microservices", difficulty: "advanced", hours: 16 },
  { name: "Laravel API", difficulty: "intermediate", hours: 11 },
  { name: "PostgreSQL Mastery", difficulty: "advanced", hours: 10 },
  { name: "MongoDB Basics", difficulty: "intermediate", hours: 9 },
  { name: "Redis Caching", difficulty: "intermediate", hours: 7 },
  { name: "Docker & K8s", difficulty: "advanced", hours: 18 },
  { name: "AWS Fundamentals", difficulty: "beginner", hours: 10 },
  { name: "GitHub Actions CI/CD", difficulty: "intermediate", hours: 8 },
  { name: "React Native", difficulty: "intermediate", hours: 14 },
  { name: "Flutter & Dart", difficulty: "intermediate", hours: 13 },
  { name: "Python Data Science", difficulty: "beginner", hours: 12 },
  { name: "Machine Learning", difficulty: "intermediate", hours: 15 },
  { name: "Deep Learning", difficulty: "advanced", hours: 20 },
  { name: "Web Security", difficulty: "intermediate", hours: 9 },
  { name: "Testing with Jest", difficulty: "intermediate", hours: 10 },
  { name: "Git Workflow", difficulty: "beginner", hours: 6 },
  { name: "Agile & Scrum", difficulty: "beginner", hours: 5 },
  { name: "TypeScript Pro", difficulty: "intermediate", hours: 10 },
];

/**
 * PACE LABELS (3 tipe):
 * - fast learner: completion_speed < 0.55
 * - consistent learner: 0.55 <= completion_speed <= 1.5
 * - reflective learner: completion_speed > 1.5
 */
const STUDENTS = [
  // Fast Learners - belajar cepat, interval pendek
  { name: "Andi Pratama", email: "andi@student.com", pace: "fast" },
  { name: "Siti Rahayu", email: "siti@student.com", pace: "fast" },
  { name: "Rizki Fauzan", email: "rizki@student.com", pace: "fast" },
  { name: "Diana Putri", email: "diana@student.com", pace: "fast" },
  { name: "Bagus Wijaya", email: "bagus@student.com", pace: "fast" },
  
  // Consistent Learners - belajar teratur, konsisten
  { name: "Eko Prasetyo", email: "eko@student.com", pace: "consistent" },
  { name: "Nur Hidayah", email: "nur@student.com", pace: "consistent" },
  { name: "Hendra Gunawan", email: "hendra@student.com", pace: "consistent" },
  { name: "Wulan Sari", email: "wulan@student.com", pace: "consistent" },
  { name: "Agus Santoso", email: "agus@student.com", pace: "consistent" },
  { name: "Maya Dewi", email: "maya@student.com", pace: "consistent" },
  { name: "Budi Hartono", email: "budi@student.com", pace: "consistent" },
  
  // Reflective Learners - belajar lambat tapi mendalam
  { name: "Dewi Lestari", email: "dewi@student.com", pace: "reflective" },
  { name: "Fitri Handayani", email: "fitri@student.com", pace: "reflective" },
  { name: "Bayu Prakoso", email: "bayu@student.com", pace: "reflective" },
  { name: "Ratna Sari", email: "ratna@student.com", pace: "reflective" },
  { name: "Joko Widodo", email: "joko@student.com", pace: "reflective" },
];

// Behavior berdasarkan pace
function getBehavior(pace) {
  switch (pace) {
    case "fast":
      return {
        completionSpeed: randFloat(0.25, 0.50), // < 0.55 = fast
        daysPerModule: rand(1, 2),
        avgScore: randFloat(75, 95),
        completionRate: randFloat(0.85, 1.0),
        hourRange: [8, 18], // Siang
      };
    case "reflective":
      return {
        completionSpeed: randFloat(1.6, 2.8), // > 1.5 = reflective
        daysPerModule: rand(4, 8),
        avgScore: randFloat(80, 98),
        completionRate: randFloat(0.7, 0.95),
        hourRange: [10, 22], // Fleksibel
      };
    default: // consistent
      return {
        completionSpeed: randFloat(0.6, 1.4), // 0.55-1.5 = consistent
        daysPerModule: rand(2, 4),
        avgScore: randFloat(70, 88),
        completionRate: randFloat(0.75, 0.95),
        hourRange: [7, 10], // Pagi konsisten
      };
  }
}

// Generate modul per course
function generateModules() {
  const types = [
    { title: "Pengenalan", type: "article" },
    { title: "Video Tutorial", type: "video" },
    { title: "Quiz Dasar", type: "quiz" },
    { title: "Materi Inti", type: "article" },
    { title: "Praktik Video", type: "video" },
    { title: "Mini Project", type: "submission" },
    { title: "Materi Lanjutan", type: "article" },
    { title: "Video Best Practice", type: "video" },
    { title: "Quiz Lanjutan", type: "quiz" },
    { title: "Final Project", type: "submission" },
  ];
  
  const count = rand(6, 10);
  return types.slice(0, count).map((m, i) => ({
    title: m.title,
    type: m.type,
    position: i + 1,
    status: "published",
    content: m.type === "quiz" 
      ? JSON.stringify([
          { question: "Pertanyaan 1?", options: ["Benar", "Salah", "Salah", "Salah"], correctIndex: 0 },
          { question: "Pertanyaan 2?", options: ["Salah", "Benar", "Salah", "Salah"], correctIndex: 1 },
          { question: "Pertanyaan 3?", options: ["Salah", "Salah", "Benar", "Salah"], correctIndex: 2 },
          { question: "Pertanyaan 4?", options: ["Salah", "Salah", "Salah", "Benar"], correctIndex: 3 },
          { question: "Pertanyaan 5?", options: ["Benar", "Salah", "Salah", "Salah"], correctIndex: 0 },
        ])
      : m.type === "video" 
        ? "https://www.youtube.com/embed/dQw4w9WgXcQ" 
        : "<h1>Materi</h1><p>Konten pembelajaran...</p>",
    requirements: JSON.stringify([]),
  }));
}

async function main() {
  console.log("Seeding data presentasi...\n");

  // Bersihkan data
  console.log("Cleaning database...");
  await prisma.user_learning_insights.deleteMany();
  await prisma.exam_results.deleteMany();
  await prisma.exam_registrations.deleteMany();
  await prisma.quiz_results.deleteMany();
  await prisma.developer_journey_submissions.deleteMany();
  await prisma.developer_journey_completions.deleteMany();
  await prisma.developer_journey_trackings.deleteMany();
  await prisma.enrollments.deleteMany();
  await prisma.quiz_options.deleteMany();
  await prisma.quiz_questions.deleteMany();
  await prisma.developer_journey_tutorials.deleteMany();
  await prisma.developer_journeys.deleteMany();
  await prisma.users.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Buat admin
  const admin = await prisma.users.create({
    data: { 
      name: "Admin", 
      email: "admin@lms.com", 
      password_hash: password, 
      user_role: "admin" 
    },
  });

  // Buat students
  console.log("Creating users...");
  const students = [];
  for (const s of STUDENTS) {
    const user = await prisma.users.create({
      data: {
        name: s.name,
        email: s.email,
        password_hash: password,
        user_role: "student",
        image_path: `https://i.pravatar.cc/150?u=${s.email}`,
        created_at: randDate(new Date("2024-01-01"), new Date("2024-05-01")),
      },
    });
    students.push({ ...user, pace: s.pace });
  }

  // Buat courses
  console.log("Creating courses...");
  const courses = [];
  for (const c of COURSES) {
    const course = await prisma.developer_journeys.create({
      data: {
        name: c.name,
        summary: `Kelas ${c.name}`,
        description: `Pelajari ${c.name} secara komprehensif.`,
        point: rand(50, 150),
        required_point: 0,
        difficulty: c.difficulty,
        status: "published",
        listed: true,
        hours_to_study: c.hours,
        instructor_id: admin.id,
        developer_journey_tutorials: { create: generateModules() },
      },
      include: { developer_journey_tutorials: true },
    });
    courses.push(course);
  }

  // Generate learning data
  console.log("Generating learning data...\n");
  let stats = { enrollments: 0, trackings: 0, exams: 0, submissions: 0 };

  for (const student of students) {
    const behavior = getBehavior(student.pace);
    const enrollCount = rand(4, 8);
    const enrolled = [...courses].sort(() => Math.random() - 0.5).slice(0, enrollCount);

    for (const course of enrolled) {
      const enrollDate = randDate(new Date("2024-06-01"), new Date("2024-10-01"));
      const tutorials = course.developer_journey_tutorials;
      const modulesToComplete = Math.floor(tutorials.length * behavior.completionRate);
      const isCompleted = modulesToComplete === tutorials.length;
      
      // Hitung last_accessed berdasarkan completion speed
      const totalDays = Math.floor(modulesToComplete * behavior.daysPerModule);
      const lastAccessDate = new Date(enrollDate.getTime() + totalDays * 24 * 60 * 60 * 1000);

      await prisma.enrollments.create({
        data: {
          user_id: student.id,
          journey_id: course.id,
          status: isCompleted ? "completed" : "active",
          enrolled_at: enrollDate,
          current_progress: (modulesToComplete / tutorials.length) * 100,
          last_accessed_at: lastAccessDate,
        },
      });
      stats.enrollments++;

      let currentDate = new Date(enrollDate);

      for (let i = 0; i < tutorials.length; i++) {
        const tut = tutorials[i];
        const willComplete = i < modulesToComplete;

        currentDate = new Date(currentDate.getTime() + behavior.daysPerModule * 24 * 60 * 60 * 1000);
        if (currentDate > new Date()) continue;

        const hour = rand(behavior.hourRange[0], behavior.hourRange[1]);
        const firstOpened = new Date(currentDate);
        firstOpened.setHours(hour, rand(0, 59), rand(0, 59));

        const lastViewed = willComplete
          ? new Date(firstOpened.getTime() + rand(30, 90) * 60000)
          : firstOpened;

        await prisma.developer_journey_trackings.create({
          data: {
            developer_id: student.id,
            journey_id: course.id,
            tutorial_id: tut.id,
            status: willComplete ? "finished" : "viewed",
            first_opened_at: firstOpened,
            last_viewed: lastViewed,
            completed_at: willComplete ? lastViewed : null,
          },
        });
        stats.trackings++;

        // Quiz
        if (tut.type === "quiz" && willComplete) {
          const score = Math.min(100, Math.max(0, behavior.avgScore + randFloat(-10, 10)));
          const reg = await prisma.exam_registrations.create({
            data: { tutorial_id: tut.id, examinees_id: student.id, status: "finished" },
          });
          await prisma.exam_results.create({
            data: {
              exam_registration_id: reg.id,
              total_questions: 5,
              score,
              is_passed: score >= 70,
            },
          });
          stats.exams++;
        }

        // Submission
        if (tut.type === "submission" && willComplete) {
          const rating = Math.min(5, Math.max(1, behavior.avgScore / 20 + randFloat(-0.5, 0.5)));
          await prisma.developer_journey_submissions.create({
            data: {
              journey_id: course.id,
              quiz_id: tut.id,
              submitter_id: student.id,
              status: "passed",
              app_link: `https://github.com/${student.name.toLowerCase().replace(/ /g, "-")}/project`,
              rating,
              note: rating >= 4 ? "Bagus!" : "Oke",
            },
          });
          stats.submissions++;
        }
      }

      if (isCompleted) {
        await prisma.developer_journey_completions.create({
          data: {
            user_id: student.id,
            journey_id: course.id,
            study_duration: totalDays * 2 * 3600,
            avg_submission_rating: behavior.avgScore / 20,
          },
        });
      }
    }

    console.log(`  ${student.name} (${student.pace})`);
  }

  console.log("\n========================================");
  console.log("SEEDING COMPLETE");
  console.log("========================================");
  console.log(`Users: ${students.length + 1}`);
  console.log(`Courses: ${courses.length}`);
  console.log(`Enrollments: ${stats.enrollments}`);
  console.log(`Trackings: ${stats.trackings}`);
  console.log(`Exams: ${stats.exams}`);
  console.log(`Submissions: ${stats.submissions}`);
  console.log("========================================");
  console.log("\nLogin:");
  console.log("  admin@lms.com / password123");
  console.log("  andi@student.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
