# AI Learning Insight

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Hapi.js-21-orange?style=for-the-badge&logo=hapi" alt="Hapi.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-6-purple?style=for-the-badge&logo=prisma" alt="Prisma">
</p>

Platform EdTech dengan fitur **AI-powered Learning Insights** yang menganalisis pola belajar siswa dan memberikan rekomendasi personal untuk meningkatkan efektivitas pembelajaran.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Instalasi & Setup](#instalasi--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

## Fitur Utama

### Untuk Siswa

- **Dashboard Personal** - Pantau progress belajar dengan statistik real-time
- **AI Learning Insights** - Analisis pola belajar menggunakan Machine Learning
  - **Pace Classification** - Fast Learner, Consistent Learner, atau Reflective Learner
  - **Optimal Study Time** - Rekomendasi waktu belajar terbaik (Pagi/Siang/Sore/Malam)
  - **Personalized Advice** - Saran yang di-generate AI berdasarkan performa
- **Course Management** - Enroll, belajar modul, dan track progress
- **Quiz & Exam System** - Assessment dengan scoring dan retry mechanism
- **Focus Time Analytics** - Visualisasi distribusi waktu belajar

### Untuk Admin

- **Course Builder** - Buat dan kelola courses dengan modul (artikel, video, quiz, submission)
- **User Management** - Kelola data siswa dan instruktur
- **Submission Review** - Review dan berikan feedback untuk tugas siswa

## Arsitektur Sistem

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │───▶│    Backend      │────▶│    ML-API       │
│   (Next.js)     │     │   (Hapi.js)     │     │   (FastAPI)     │
│   Port: 3000    │     │   Port: 4000    │     │   Port: 8000    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │   PostgreSQL    │     │  OpenRouterAPI  │
                        │    Database     │     │                 │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## Tech Stack

### Frontend

| Technology      | Version | Purpose                           |
| --------------- | ------- | --------------------------------- |
| Next.js         | 15.x    | React Framework dengan App Router |
| React           | 19.x    | UI Library                        |
| TypeScript      | 5.x     | Type Safety                       |
| Tailwind CSS    | 4.x     | Styling                           |
| shadcn/ui       | Latest  | Component Library                 |
| Recharts        | 2.x     | Data Visualization                |
| React Hook Form | 7.x     | Form Management                   |
| Zod             | 4.x     | Schema Validation                 |

### Backend

| Technology | Version | Purpose               |
| ---------- | ------- | --------------------- |
| Node.js    | 20.x    | Runtime Environment   |
| Hapi.js    | 21.x    | HTTP Server Framework |
| Prisma     | 6.x     | ORM & Database Client |
| PostgreSQL | 15.x    | Relational Database   |
| JWT        | -       | Authentication        |
| Bcrypt     | 6.x     | Password Hashing      |
| Joi        | 18.x    | Request Validation    |

## Struktur Project

```
ai-learning-insight/
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router Pages
│   │   │   ├── (auth)/        # Auth Pages (Login, Register)
│   │   │   ├── (dashboard)/   # Dashboard Pages
│   │   │   │   ├── admin/     # Admin Pages
│   │   │   │   └── student/   # Student Pages
│   │   │   └── courses/       # Course Pages
│   │   ├── components/        # React Components
│   │   │   └── ui/            # shadcn/ui Components
│   │   ├── lib/               # Utilities & Axios Config
│   │   └── types/             # TypeScript Types
│   ├── public/                # Static Assets
│   └── package.json
│
├── server/                     # Hapi.js Backend
    ├── src/
    │   ├── api/               # API Routes & Handlers
    │   │   ├── auth/          # Authentication
    │   │   ├── admin/         # Admin Endpoints
    │   │   └── students/      # Student Endpoints
    │   ├── services/          # Business Logic
    │   │   ├── admin/         # Admin Services
    │   │   ├── learning/      # Learning Services
    │   │   └── student/       # Student Services (InsightService)
    │   └── server.js          # Server Entry Point
    ├── prisma/
    │   ├── schema.prisma      # Database Schema
    │   └── seed_*.js          # Database Seeders
    └── package.json

```

## Instalasi & Setup

### Prerequisites

- Node.js 20.x atau lebih baru
- PostgreSQL 15+
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ai-learning-insight.git
cd ai-learning-insight
```

### 2. Setup Backend (Server)

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:4000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Sesuaikan NEXT_PUBLIC_API_URL jika perlu

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Environment Variables

### Frontend (`.env`)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learning_db

# Server
PORT=4000
HOST=localhost

# JWT Secret (generate menggunakan: openssl rand -hex 64)
JWT_SECRET=your_jwt_secret_here

# ML Service URL
ML_SERVICE_URL=http://localhost:8000
```

## API Documentation

### Backend Endpoints

#### Authentication

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/auth/register` | Register user baru           |
| POST   | `/auth/login`    | Login dan dapatkan JWT token |
| GET    | `/auth/me`       | Get current user info        |

#### Student

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| GET    | `/student/dashboard`         | Dashboard statistics        |
| GET    | `/student/my-courses`        | List enrolled courses       |
| GET    | `/student/insights`          | Get AI learning insights    |
| POST   | `/student/insights/generate` | Generate new AI analysis    |
| GET    | `/student/focus-time`        | Get focus time distribution |

#### Learning

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/courses`                      | List all courses           |
| GET    | `/courses/{id}`                 | Course detail with modules |
| POST   | `/courses/{id}/enroll`          | Enroll to a course         |
| GET    | `/courses/module/{id}`          | Get module content         |
| POST   | `/courses/module/{id}/complete` | Mark module as complete    |
| POST   | `/learning/quiz/{id}/start`     | Start a quiz               |
| POST   | `/learning/quiz/{id}/submit`    | Submit quiz answers        |

## Database Schema

### Core Tables

```
users                          # User accounts
├── id, name, email, password_hash
├── user_role (student/admin)
└── image_path, created_at

developer_journeys             # Courses
├── id, name, summary, description
├── difficulty, point, status
└── instructor_id, reviewer_id

developer_journey_tutorials    # Modules
├── id, developer_journey_id
├── title, type (article/video/quiz/submission)
├── content, position, status
└── requirements (JSON)

enrollments                    # Course enrollments
├── id, user_id, developer_journey_id
├── status, progress
└── enrolled_at, last_accessed_at

exam_results                   # Quiz/Exam results
├── id, registration_id
├── score, feedback
└── started_at, finished_at

user_learning_insights         # AI Insights storage
├── id, user_id
├── insight_key, insight_val (JSON)
└── created_at
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made by Capstone Project Team DC-08
</p>
