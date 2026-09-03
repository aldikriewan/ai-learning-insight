# AI Learning Insight — Enhanced Fork by aldikriewan

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Hapi.js-21-orange?style=for-the-badge&logo=hapi" alt="Hapi.js">
  <img src="https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-6-purple?style=for-the-badge&logo=prisma" alt="Prisma">
</p>

<p align="center">
  <strong>Enhanced EdTech platform with AI-powered Learning Insights</strong> — forked from the original DC-08 Capstone project to continue independent development and improvements.
</p>

---

## About This Fork

This repository is an **enhanced fork** of the original <strong>AI Learning Insight</strong> project developed by the <strong>Capstone Project Team DC-08</strong>.

- <strong>Original Project:</strong> <a href="https://github.com/your-username/ai-learning-insight">AI Learning Insight</a> by DC-08
- <strong>Fork Maintainer:</strong> <a href="https://github.com/aldikriewan"><strong>aldikriewan</strong></a>
- <strong>Purpose:</strong> Independent development, bug fixes, feature enhancements, and documentation improvements

### Credits

This project is built upon the foundational work of the <strong>DC-08 Capstone Project Team</strong>. All original credits belong to the original developers. This fork represents additional work and enhancements contributed by <strong>aldikriewan</strong>.

---

## Improvements

> <strong>Note:</strong> Specific improvements and changes introduced in this fork are documented in the <a href="https://github.com/aldikriewan/ai-learning-insight/commits">commit history</a>. Key areas of enhancement include documentation accuracy, code quality, and project structure refinements.

---

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Prasyarat](#prasyarat)
- [Instalasi & Setup](#instalasi--setup)
- [Scripts yang Tersedia](#scripts-yang-tersedia)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Tentang Project

**AI Learning Insight** adalah platform pembelajaran elektronik (EdTech) berbasis web yang mengintegrasikan kecerdasan buatan untuk memberikan wawasan personal tentang pola belajar setiap siswa. Platform ini dibangun sebagai project capstone tim DC-08 dengan tujuan membantu siswa memahami gaya belajar mereka, mengidentifikasi waktu belajar optimal, serta mendapatkan rekomendasi yang dapat ditindaklanjuti untuk meningkatkan hasil belajar.

### Masalah yang Diselesaikan

- Siswa kesulitan memahami gaya belajar mereka sendiri
- Tidak ada umpan balik real-time tentang efektivitas waktu belajar
- Kurangnya rekomendasi personal yang berbasis data
- Admin membutuhkan tools yang efisien untuk mengelola konten kursus dan evaluasi siswa

---

## Fitur Utama

### Untuk Siswa

- **Dashboard Personal** — Pantau progress belajar dengan statistik real-time
- **AI Learning Insights** — Analisis pola belajar menggunakan Machine Learning
  - **Pace Classification** — Fast Learner, Consistent Learner, atau Reflective Learner
  - **Optimal Study Time** — Rekomendasi waktu belajar terbaik (Pagi / Siang / Sore / Malam)
  - **Personalized Advice** — Saran motivasional yang di-generate AI berdasarkan performa
- **Course Management** — Enroll, belajar modul, dan track progress
- **Quiz & Exam System** — Assessment dengan scoring dan retry mechanism
- **Focus Time Analytics** — Visualisasi distribusi waktu belajar menggunakan Recharts

### Untuk Admin

- **Course Builder** — Buat dan kelola courses dengan modul (artikel, video, quiz, submission)
- **User Management** — Kelola data siswa dan instruktur
- **Submission Review** — Review dan berikan feedback untuk tugas siswa

---

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

### Alur Data

1. **Frontend** mengirim request ke **Backend** untuk data insights
2. **Backend** melakukan query ke **PostgreSQL**, menghitung fitur-fitur (misal: `avg_study_hour`, `completion_speed`)
3. **Backend** mengirim fitur yang sudah dihitung ke **ML-API**
4. **ML-API** melakukan prediksi menggunakan model yang sudah dilatih dan mengembalikan hasilnya
5. **Backend** memproses hasil dan mengembalikannya ke **Frontend**

> **Catatan:** ML-API tidak terhubung langsung ke database. Semua perhitungan fitur dilakukan di Backend.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| Next.js | 15.x | React Framework dengan App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui + Mantine | Latest | Component Library |
| Recharts | 2.x | Data Visualization |
| React Hook Form | 7.x | Form Management |
| Zod | 4.x | Schema Validation |
| Axios | 1.x | HTTP Client |

### Backend

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| Node.js | 20.x | Runtime Environment |
| Hapi.js | 21.x | HTTP Server Framework |
| Prisma | 6.x | ORM & Database Client |
| PostgreSQL | 15+ | Relational Database |
| JWT | - | Authentication |
| Bcrypt | 6.x | Password Hashing |
| Joi | 18.x | Request Validation |
| ESLint | 8.x | Linting |

---

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
└── server/                     # Hapi.js Backend
    ├── src/
    │   ├── api/               # API Routes & Handlers
    │   │   ├── auth/          # Authentication
    │   │   ├── admin/         # Admin Endpoints
    │   │   └── students/      # Student Endpoints
    │   ├── services/          # Business Logic
    │   │   ├── admin/         # Admin Services
    │   │   ├── learning/      # Learning Services
    │   │   └── student/       # Student Services (InsightService)
    │   ├── validator/         # Joi Validation Schemas
    │   └── server.js          # Server Entry Point
    ├── prisma/
    │   ├── schema.prisma      # Database Schema
    │   └── seed_*.js          # Database Seeders
    └── package.json
```

---

## Prasyarat

Sebelum memulai, pastikan sistem Anda memenuhi persyaratan berikut:

| Software | Versi Minimal | Deskripsi |
| -------- | ------------- | --------- |
| Node.js | 20.x | Runtime untuk frontend dan backend |
| npm | 10.x | Package manager |
| PostgreSQL | 15+ | Database server |
| Git | 2.x | Version control |

---

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/aldikriewan/ai-learning-insight.git
cd ai-learning-insight
```

### 2. Setup Database

```bash
# Buat database PostgreSQL baru
createdb learning_db
```

### 3. Setup Backend (Server)

```bash
cd server

# Install dependencies
npm install

# Copy file environment
cp .env.example .env

# Edit .env sesuai konfigurasi database Anda
# DATABASE_URL=postgresql://user:password@localhost:5432/learning_db
# JWT_SECRET=<generate dengan openssl rand -hex 64>

# Generate Prisma Client
npm run prisma:generate

# Jalankan database migration
npm run db:migrate

# (Opsional) Seed database dengan data dummy
npm run db:seed:demo

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:4000`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy file environment
cp .env.example .env
# Sesuaikan NEXT_PUBLIC_API_URL jika perlu

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

---

## Scripts yang Tersedia

### Backend

| Script | Deskripsi |
| ------ | --------- |
| `npm run dev` | Menjalankan development server dengan nodemon |
| `npm run build` | Build TypeScript (jika ada source TS) |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run db:migrate` | Menjalankan Prisma migration |
| `npm run db:seed` | Seed data default |
| `npm run db:seed:demo` | Seed data demo untuk presentasi |

### Frontend

| Script | Deskripsi |
| ------ | --------- |
| `npm run dev` | Menjalankan development server dengan Turbopack |
| `npm run build` | Build untuk production |
| `npm run start` | Menjalankan production build |
| `npm run lint` | Menjalankan ESLint |

---

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

# Authentication
# Generate: openssl rand -hex 64
JWT_SECRET=your_super_secret_jwt_key_here_please_change_this

# ML Service
ML_SERVICE_URL=http://localhost:8000
```

> **Penting:** Jangan pernah commit file `.env` ke version control. Gunakan `.env.example` sebagai template.

---

## API Documentation

### Swagger UI

Setelah menjalankan backend, akses dokumentasi interaktif di:

```
http://localhost:4000/documentation
```

### Endpoints Utama

#### Authentication

| Method | Endpoint | Deskripsi |
| ------ | -------- | --------- |
| POST | `/auth/register` | Register user baru |
| POST | `/auth/login` | Login dan dapatkan JWT token |
| GET | `/auth/me` | Get current user info |

#### Student

| Method | Endpoint | Deskripsi |
| ------ | -------- | --------- |
| GET | `/student/dashboard` | Dashboard statistics |
| GET | `/student/my-courses` | List enrolled courses |
| GET | `/student/insights` | Get AI learning insights |
| POST | `/student/insights/generate` | Generate new AI analysis |
| GET | `/student/focus-time` | Get focus time distribution |

#### Learning

| Method | Endpoint | Deskripsi |
| ------ | -------- | --------- |
| GET | `/courses` | List all courses |
| GET | `/courses/{id}` | Course detail with modules |
| POST | `/courses/{id}/enroll` | Enroll to a course |
| GET | `/courses/module/{id}` | Get module content |
| POST | `/courses/module/{id}/complete` | Mark module as complete |
| POST | `/learning/quiz/{id}/start` | Start a quiz |
| POST | `/learning/quiz/{id}/submit` | Submit quiz answers |

#### ML Insights

| Method | Endpoint | Deskripsi |
| ------ | -------- | --------- |
| POST | `/ml/pace/analyze` | Analisis pace belajar (via ML-API) |
| POST | `/ml/advice/generate` | Generate saran belajar AI |

---

## Database Schema

### Entity Relationship Overview

```
users
├── id (PK)
├── name, email (unique), password_hash
├── user_role (student / admin)
├── image_path
└── timestamps

developer_journeys (Courses)
├── id (PK)
├── name, summary, description
├── difficulty, point, status
├── instructor_id (FK → users)
└── reviewer_id (FK → users)

developer_journey_tutorials (Modules)
├── id (PK)
├── developer_journey_id (FK)
├── title, type (article / video / quiz / submission)
├── content, position, status
└── requirements (JSON)

enrollments
├── id (PK)
├── user_id (FK → users)
├── developer_journey_id (FK)
├── status, progress
└── enrolled_at, last_accessed_at

exam_results
├── id (PK)
├── registration_id (FK)
├── score, feedback
└── started_at, finished_at

user_learning_insights
├── id (PK)
├── user_id (FK)
├── insight_key, insight_val (JSON)
└── created_at
```

### Tabel Pendukung

- `exam_registrations` — Registrasi ujian siswa
- `developer_journey_trackings` — Tracking aktivitas belajar harian
- `developer_journey_submissions` — Data pengumpulan tugas
- `developer_journey_completions` — Penyelesaian learning path

---

## Testing

### Backend

```bash
cd server

# Linting
npm run lint

# Seed database dengan data test
npm run db:seed:demo
```

### Frontend

```bash
cd frontend

# Linting
npm run lint
```

### Integrasi ML API

Pastikan ML API berjalan di `http://localhost:8000` sebelum menguji endpoint insights:

```bash
# Cek health ML API
curl http://localhost:8000/health
```

---

## Deployment

### Environment Variables Production

Pastikan semua environment variables telah dikonfigurasi dengan nilai production:

- `DATABASE_URL` — String koneksi PostgreSQL production
- `JWT_SECRET` — Secret key yang kuat dan acak
- `ML_SERVICE_URL` — URL ML API production
- `NEXT_PUBLIC_API_URL` — URL backend production (untuk frontend)

### Backend

```bash
cd server
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

### Docker (Opsional)

Project ini dapat di-containerize menggunakan Docker untuk deployment yang konsisten. Buat `Dockerfile` untuk masing-masing service (frontend dan backend) dan orchestrate menggunakan Docker Compose.

---

## Machine Learning Component

> **Note:** The ML component (`ml-ai-learning-insight`) is maintained in a **separate private repository** due to sensitive training data containing Personally Identifiable Information (PII).

### Model Overview

| Model | Type | Status | Performance |
|-------|------|--------|-------------|
| Pace Classifier | Random Forest Classifier | ✅ Active | **80.92% test accuracy**, 82.91% 5-Fold CV, F1-score 0.81 |
| Advice Generator | LLM via OpenRouter API (Mistral) | ✅ Active | ~1–3s response time |
| Persona Classifier | Random Forest (archived) | 🔒 Archived | — |

### Methodology

- **Leakage-free approach:** Labels generated via K-Means clustering on independent binary scores, training classifier on `X_train` only, evaluated on held-out `X_test` (stratified 80:20 split)
- **API latency:** ~50–100ms per prediction request
- **ML API is decoupled from the database** — all feature engineering is handled by the Backend before sending to ML-API

> The ML repository and model artifacts are available for review upon request.

---

## Kontribusi

Kontribusi sangat diterima! Berikut langkah-langkah untuk berkontribusi:

1. **Fork** repository ini
2. **Buat branch** baru untuk fitur atau bugfix: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan Anda: `git commit -m 'Add: fitur baru'`
4. **Push** ke branch: `git push origin feature/nama-fitur`
5. **Buat Pull Request** dan jelaskan perubahan Anda

### Code Style

- Gunakan ESLint untuk menjaga konsistensi kode
- Ikuti konvensi naming yang ada di project
- Dokumentasikan perubahan pada API dengan mengupdate README jika diperlukan

---

## Troubleshooting

### Port sudah dipakai

Jika port 3000 (frontend) atau 4000 (backend) sudah dipakai, ubah konfigurasi di file `.env`:

```env
# Frontend
PORT=3001

# Backend
PORT=4001
```

### Database connection refused

Pastikan PostgreSQL berjalan dan `DATABASE_URL` di file `.env` backend sudah benar:

```bash
# Cek status PostgreSQL (Windows)
pg_ctl status

# Cek status PostgreSQL (Linux/Mac)
sudo systemctl status postgresql
```

### ML API tidak merespons

Pastikan ML API sudah berjalan dan `ML_SERVICE_URL` di backend `.env` menunjuk ke alamat yang benar:

```bash
# Test koneksi ke ML API
curl http://localhost:8000/health
```

### Prisma migration error

Jika migration gagal, reset database (hati-hati: data akan hilang):

```bash
npx prisma migrate reset
npm run db:seed:demo
```

---

## License

Project ini dilisensikan under MIT License — lihat file [LICENSE](LICENSE) untuk detail.

---

## Original Project

- **Original Repository:** [AI Learning Insight by DC-08](https://github.com/your-username/ai-learning-insight)
- **Original Team:** Capstone Project Team DC-08
- **Original License:** MIT

---

<p align="center">
  Enhanced and maintained by <a href="https://github.com/aldikriewan"><strong>aldikriewan</strong></a><br>
  Built upon the original work of <strong>Capstone Project Team DC-08</strong>
</p>
