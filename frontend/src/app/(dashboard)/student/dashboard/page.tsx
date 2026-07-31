"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Zap,
  RefreshCw,
  Target,
  Calendar,
  BarChart3,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Course, AIInsight } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";

type User = {
  name: string;
};

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  console.log(insight);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const [coursesRes, insightRes] = await Promise.allSettled([
          api.get("/student/my-courses"),
          api.get("/student/insights"),
        ]);

        if (coursesRes.status === "fulfilled") {
          setCourses(coursesRes.value.data.data);
        }

        if (insightRes.status === "fulfilled" && insightRes.value.data.data) {
          setInsight(insightRes.value.data.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
        setInsightLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateInsight = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/student/insights/generate");
      setInsight(res.data.data);
      toast.success("Analisis Selesai!", {
        description: "AI telah memperbarui profil belajar Anda.",
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error("Gagal Menganalisis", {
        description: err.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const stats = {
    total: courses.length,
    completed: courses.filter((c) => (c.progress || 0) === 100).length,
    inProgress: courses.filter(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    ).length,
  };

  const recentCourses = courses
    .filter((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100)
    .slice(0, 3);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/90 via-primary to-primary/80 p-6 md:p-8 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30 border-0 dark:bg-black/30"
              >
                Dashboard
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Selamat datang, {user?.name || "Learner"}! 👋
            </h1>
            <p className="text-primary-foreground/80 max-w-lg">
              Pantau progress belajarmu dan temukan insight personal dari AI
              untuk meningkatkan efektivitas belajar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/student/my-courses">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm dark:bg-black/20"
              >
                Kelas Saya
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 dark:bg-black"
              >
                Jelajah Kelas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group border hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Total Kelas
                </p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Sedang Dipelajari
                </p>
                <p className="text-3xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Kelas Selesai
                </p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border hover:shadow-md transition-all duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          {insightLoading ? (
            <Skeleton className="h-[260px] rounded-xl" />
          ) : insight ? (
            <Card className="h-full border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Profil Belajar</h3>
                      <p className="text-sm text-muted-foreground">
                        Analisis personal dari aktivitas belajarmu
                      </p>
                    </div>
                  </div>
                  <Link href="/student/profile">
                    <Button variant="outline" size="sm">
                      Lihat Detail
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 py-4 mb-4 border-t">
                  <div className="flex-1">
                    <p className="uppercase text-sm text-slate-600 font-light pb-3 dark:text-white">
                      Tipe Belajar Anda
                    </p>
                    <p className="text-xl font-bold capitalize">
                      {insight.pace?.pace_label || "Consistent Learner"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>
                          Waktu optimal:{" "}
                          <strong className="text-foreground">
                            {insight.features?.optimal_study_time || "Pagi"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4" />
                        <span>
                          Rata-rata skor Ujian:{" "}
                          <strong className="text-foreground">
                            {insight.features?.avg_exam_score?.toFixed(0) || 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed border-t pt-3">
                  {insight.pace?.insight ||
                    "Klik detail untuk melihat rekomendasi personal dari AI."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full border-2 border-dashed">
              <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Temukan Profil Belajarmu
                </h3>
                <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto">
                  AI akan menganalisis pola belajar dan memberikan rekomendasi
                  personal.
                </p>
                <Button onClick={handleGenerateInsight} disabled={generating}>
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Mulai Analisis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Continue Learning Card */}
        <div className="lg:col-span-1">
          <Card className="h-full border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Lanjutkan Belajar
                </CardTitle>
                <Link href="/student/my-courses">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCourses.length === 0 ? (
                <div className="text-center py-6">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Belum ada kelas yang sedang dipelajari
                  </p>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      Mulai Belajar
                    </Button>
                  </Link>
                </div>
              ) : (
                recentCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block"
                  >
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="relative h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        {course.image_path ? (
                          <Image
                            src={course.image_path}
                            alt={course.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress
                            value={course.progress || 0}
                            className="h-1.5 flex-1"
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {Math.round(course.progress || 0)}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 self-center" />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/student/profile" className="block group">
          <Card className="border hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Profil Belajar</p>
                <p className="text-xs text-muted-foreground">
                  Lihat insight AI
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/my-courses" className="block group">
          <Card className="border hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Kelas Saya</p>
                <p className="text-xs text-muted-foreground">
                  Lihat semua kelas
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/courses" className="block group">
          <Card className="border hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Katalog</p>
                <p className="text-xs text-muted-foreground">
                  Jelajah kelas baru
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/settings" className="block group">
          <Card className="border hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Pengaturan</p>
                <p className="text-xs text-muted-foreground">Kelola akun</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
