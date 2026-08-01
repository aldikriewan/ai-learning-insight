const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "password123";

const COURSE_BLUEPRINTS = [
  {
    name: "Dasar React untuk Aplikasi Web",
    summary: "Kelas dasar React untuk memahami komponen, state, dan props.",
    description:
      "Materi ini cocok untuk menguji alur belajar frontend dari awal sampai praktik sederhana.",
    difficulty: "beginner",
    point: 60,
    hours_to_study: 8,
  },
  {
    name: "Next.js untuk Projek Nyata",
    summary: "Belajar routing, server component, dan integrasi data di Next.js.",
    description:
      "Kelas ini meniru alur belajar yang umum dipakai di aplikasi produksi.",
    difficulty: "intermediate",
    point: 90,
    hours_to_study: 12,
  },
  {
    name: "Backend Node.js dan Hapi",
    summary: "Membangun API, validasi request, dan struktur service backend.",
    description:
      "Cocok untuk menguji pengguna yang belajar backend dan review tugas.",
    difficulty: "intermediate",
    point: 80,
    hours_to_study: 11,
  },
  {
    name: "Database PostgreSQL dan Prisma",
    summary: "Mendesain tabel, relasi, dan query untuk data belajar.",
    description:
      "Kelas ini membantu membuat histori yang lebih natural untuk data aplikasi.",
    difficulty: "intermediate",
    point: 85,
    hours_to_study: 10,
  },
  {
    name: "Testing dan Debugging Aplikasi",
    summary: "Latihan menulis test, membaca error, dan memperbaiki bug.",
    description:
      "Data kelas ini berguna untuk siswa yang punya ritme belajar lebih lambat tapi teliti.",
    difficulty: "advanced",
    point: 95,
    hours_to_study: 14,
  },
  {
    name: "UI, UX, dan Accessibility",
    summary: "Membuat antarmuka yang rapi, aksesibel, dan mudah dipakai.",
    description:
      "Kelas pendukung untuk memberikan variasi pola belajar pada aplikasi.",
    difficulty: "beginner",
    point: 55,
    hours_to_study: 7,
  },
];

const STUDENTS = [
  {
    name: "Andi Pratama",
    email: "andi.pratama@student.co.id",
    behavior: "fast",
    createdOffsetDays: 180,
  },
  {
    name: "Siti Aisyah",
    email: "siti.aisyah@student.co.id",
    behavior: "consistent",
    createdOffsetDays: 160,
  },
  {
    name: "Rizky Maulana",
    email: "rizky.maulana@student.co.id",
    behavior: "nightowl",
    createdOffsetDays: 150,
  },
  {
    name: "Dewi Lestari",
    email: "dewi.lestari@student.co.id",
    behavior: "reflective",
    createdOffsetDays: 140,
  },
  {
    name: "Bima Saputra",
    email: "bima.saputra@student.co.id",
    behavior: "struggler",
    createdOffsetDays: 130,
  },
  {
    name: "Nabila Putri",
    email: "nabila.putri@student.co.id",
    behavior: "consistent",
    createdOffsetDays: 120,
  },
  {
    name: "Fajar Hidayat",
    email: "fajar.hidayat@student.co.id",
    behavior: "fast",
    createdOffsetDays: 110,
  },
  {
    name: "Intan Permata",
    email: "intan.permata@student.co.id",
    behavior: "struggler",
    createdOffsetDays: 100,
  },
];

const BEHAVIORS = {
  fast: {
    enrollments: [4, 5],
    hourWindows: [
      [7, 9],
      [10, 11],
      [13, 15],
    ],
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
    hourWindows: [
      [7, 10],
      [13, 16],
    ],
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
    hourWindows: [
      [20, 23],
      [0, 2],
    ],
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
    hourWindows: [
      [19, 23],
      [21, 23],
    ],
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
    hourWindows: [
      [20, 23],
      [0, 2],
      [10, 12],
    ],
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
    {
      title: `Pendahuluan ${courseName}`,
      type: "article",
      content: `<h1>Pendahuluan ${courseName}</h1><p>Materi pembuka untuk ${courseName}.</p>`,
      status: "published",
    },
    {
      title: `Setup ${courseName}`,
      type: "video",
      content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      status: "published",
    },
    {
      title: `Quiz Dasar ${courseName}`,
      type: "quiz",
      content: `Quiz dasar untuk ${courseName}`,
      status: "published",
    },
    {
      title: `Latihan Praktik ${courseName}`,
      type: "submission",
      content: `<p>Kerjakan latihan praktik untuk ${courseName} lalu kirim link aplikasi.</p>`,
      status: "published",
    },
    {
      title: `Ringkasan ${courseName}`,
      type: "article",
      content: `<p>Ringkasan dan refleksi belajar untuk ${courseName}.</p>`,
      status: "published",
    },
    {
      title: `Quiz Akhir ${courseName}`,
      type: "quiz",
      content: `Quiz akhir untuk ${courseName}`,
      status: "published",
    },
  ];
}

function buildQuizQuestions(courseName, tutorialTitle) {
  return [
    {
      question_text: `Apa tujuan utama dari ${courseName}?`,
      question_type: "multiple_choice",
      options: [
        ["Memahami konsep inti", true],
        ["Membuat akun baru", false],
        ["Menghapus data lama", false],
        ["Menutup aplikasi", false],
      ],
    },
    {
      question_text: `Bagian mana yang paling relevan dengan ${tutorialTitle}?`,
      question_type: "multiple_choice",
      options: [
        ["Praktik bertahap", true],
        ["Hanya teori tanpa latihan", false],
        ["Menebak jawaban", false],
        ["Skip semua modul", false],
      ],
    },
    {
      question_text: `Apa yang paling penting saat belajar ${courseName}?`,
      question_type: "multiple_choice",
      options: [
        ["Konsistensi belajar", true],
        ["Mempercepat tanpa paham", false],
        ["Mengabaikan progress", false],
        ["Langsung selesai tanpa proses", false],
      ],
    },
  ];
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

    const orderedTutorials = [...course.developer_journey_tutorials].sort(
      (a, b) => a.position - b.position
    );

    for (let index = 1; index < orderedTutorials.length; index += 1) {
      await prisma.developer_journey_tutorials.update({
        where: { id: orderedTutorials[index].id },
        data: { requirements: [orderedTutorials[index - 1].id] },
      });
    }

    for (const tutorial of orderedTutorials) {
      if (tutorial.type !== "quiz") {
        continue;
      }

      const questions = buildQuizQuestions(blueprint.name, tutorial.title);

      for (const question of questions) {
        const createdQuestion = await prisma.quiz_questions.create({
          data: {
            tutorial_id: tutorial.id,
            question_text: question.question_text,
            question_type: question.question_type,
          },
        });

        for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
          const [optionText, isCorrect] = question.options[optionIndex];
          await prisma.quiz_options.create({
            data: {
              question_id: createdQuestion.id,
              option_text: optionText,
              is_correct: isCorrect,
            },
          });
        }
      }
    }

    courses.push({
      ...course,
      developer_journey_tutorials: orderedTutorials,
    });
  }

  return courses;
}

async function seedStudentHistory(student, courses) {
  const behavior = BEHAVIORS[student.behavior];
  const enrollCount = randInt(behavior.enrollments[0], behavior.enrollments[1]);
  const enrolledCourses = [...courses]
    .sort(() => Math.random() - 0.5)
    .slice(0, enrollCount);

  for (let courseIndex = 0; courseIndex < enrolledCourses.length; courseIndex += 1) {
    const course = enrolledCourses[courseIndex];
    const tutorials = [...course.developer_journey_tutorials].sort(
      (a, b) => a.position - b.position
    );
    const completionRatio = randFloat(behavior.completionRate[0], behavior.completionRate[1]);
    const finishedModules = Math.max(
      1,
      Math.min(tutorials.length, Math.floor(tutorials.length * completionRatio))
    );
    const isCompleted = finishedModules >= tutorials.length;
    const enrolledAt = daysAgo(student.createdOffsetDays - courseIndex * 5);
    const dayGap = randInt(behavior.dayGap[0], behavior.dayGap[1]);
    const lastAccessDate = new Date(enrolledAt);
    lastAccessDate.setDate(lastAccessDate.getDate() + finishedModules * dayGap);

    await prisma.enrollments.create({
      data: {
        user_id: student.id,
        journey_id: course.id,
        status: isCompleted ? "completed" : "active",
        enrolled_at: enrolledAt,
        current_progress: parseFloat(((finishedModules / tutorials.length) * 100).toFixed(1)),
        last_accessed_at: lastAccessDate,
      },
    });

    for (let tutorialIndex = 0; tutorialIndex < tutorials.length; tutorialIndex += 1) {
      const tutorial = tutorials[tutorialIndex];

      if (tutorialIndex >= finishedModules) {
        break;
      }

      const studyDate = makeStudyDate(
        new Date(enrolledAt.getTime() + tutorialIndex * dayGap * 24 * 60 * 60 * 1000),
        behavior
      );

      await prisma.developer_journey_trackings.create({
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

      if (tutorial.type === "quiz") {
        const quizScore = randFloat(behavior.quizScore[0], behavior.quizScore[1]);
        await prisma.quiz_results.create({
          data: {
            user_id: student.id,
            quiz_id: tutorial.id,
            score: quizScore,
            time_taken_seconds: randInt(600, 1800),
          },
        });
      }

      if (tutorial.type === "submission") {
        const submissionState = pick(behavior.submissionStates);
        await prisma.developer_journey_submissions.create({
          data: {
            journey_id: course.id,
            quiz_id: tutorial.id,
            submitter_id: student.id,
            status: submissionState,
            app_link: `https://github.com/demo/${student.name.toLowerCase().replace(/\s+/g, "-")}/${course.id}`,
            app_comment: `${student.name} mengerjakan ${course.name} dengan ritme ${student.behavior}.`,
            reviewer_id: null,
            rating: randFloat(behavior.avgSubmissionRating[0], behavior.avgSubmissionRating[1]),
            note: submissionState === "failed"
              ? "Perlu perbaikan pada struktur dan konsistensi implementasi."
              : "Progress terlihat valid dan sesuai pola belajar yang dipilih.",
          },
        });
      }
    }

    if (!isCompleted && finishedModules < tutorials.length) {
      const nextTutorial = tutorials[finishedModules];
      const previewDate = makeStudyDate(
        new Date(enrolledAt.getTime() + finishedModules * dayGap * 24 * 60 * 60 * 1000),
        behavior
      );

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
      await prisma.developer_journey_completions.create({
        data: {
          user_id: student.id,
          journey_id: course.id,
          study_duration: Math.max(
            1,
            Math.round(course.hours_to_study * completionSpeed)
          ),
          avg_submission_rating: randFloat(
            behavior.avgSubmissionRating[0],
            behavior.avgSubmissionRating[1]
          ),
        },
      });
    }

    const quizTutorial = tutorials.find((tutorial) => tutorial.type === "quiz");
    if (quizTutorial) {
      const examRegistration = await prisma.exam_registrations.create({
        data: {
          exam_module_id: quizTutorial.id,
          tutorial_id: quizTutorial.id,
          examinees_id: student.id,
          status: completionRatio >= 0.6 ? "finished" : "registered",
        },
      });

      const examScore = randFloat(behavior.examScore[0], behavior.examScore[1]);
      await prisma.exam_results.create({
        data: {
          exam_registration_id: examRegistration.id,
          total_questions: 10,
          score: examScore,
          is_passed: examScore >= 70,
        },
      });
    }

    await prisma.user_learning_insights.createMany({
      data: [
        {
          user_id: student.id,
          insight_key: "persona_prediction",
          insight_val: {
            behavior: student.behavior,
            avg_study_hour_hint:
              student.behavior === "nightowl" || student.behavior === "reflective"
                ? "malam"
                : "pagi/siang",
            completion_ratio: completionRatio,
          },
        },
        {
          user_id: student.id,
          insight_key: "learning_summary",
          insight_val: {
            enrolled_courses: enrollCount,
            completed_courses: isCompleted ? 1 : 0,
            last_course: course.name,
            note: `Histori dibuat untuk profil ${student.behavior}.`,
          },
        },
      ],
    });
  }
}

async function main() {
  console.log("Starting demo seed...");

  await cleanupDatabase();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const admin = await prisma.users.create({
    data: {
      name: "Admin Demo",
      email: "admin@lms.com",
      password_hash: passwordHash,
      user_role: "admin",
      created_at: daysAgo(365),
      image_path: "https://i.pravatar.cc/150?u=admin-demo",
    },
  });

  const students = [];
  for (const studentBlueprint of STUDENTS) {
    const user = await prisma.users.create({
      data: {
        name: studentBlueprint.name,
        email: studentBlueprint.email,
        password_hash: passwordHash,
        user_role: "student",
        created_at: daysAgo(studentBlueprint.createdOffsetDays),
        image_path: `https://i.pravatar.cc/150?u=${encodeURIComponent(studentBlueprint.email)}`,
      },
    });

    students.push({
      ...user,
      behavior: studentBlueprint.behavior,
      createdOffsetDays: studentBlueprint.createdOffsetDays,
    });
  }

  const courses = await createCourses(admin.id);

  for (const student of students) {
    await seedStudentHistory(student, courses);
  }

  console.log("Demo seed finished successfully.");
  console.log("Created courses:", courses.length);
  console.log("Created students:", students.length);
  console.log(`Default demo password: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });