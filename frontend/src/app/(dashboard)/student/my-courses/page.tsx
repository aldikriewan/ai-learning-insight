"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Target,
  Sparkles,
  ChevronRight,
  Trophy,
} from "lucide-react";

import api from "@/lib/axios";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MyCoursesPageSkeleton from "@/components/skeleton/MyCoursesPageSkeleton";

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Pemula", color: "bg-primary/10 text-primary" },
  intermediate: { label: "Menengah", color: "bg-primary/10 text-primary" },
  advanced: { label: "Lanjutan", color: "bg-primary/10 text-primary" },
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/student/my-courses");
        setCourses(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data kelas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const inProgressCourses = courses.filter(
    (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
  );
  const completedCourses = courses.filter((c) => (c.progress || 0) === 100);
  const notStartedCourses = courses.filter((c) => (c.progress || 0) === 0);

  if (loading) {
    return <MyCoursesPageSkeleton />;
  }

  const renderCourseCard = (course: Course) => {
    const progress = Math.min(Math.max(course.progress || 0, 0), 100);
    const isCompleted = progress === 100;
    const isStarted = progress > 0;
    const difficulty = difficultyConfig[course.difficulty] || {
      label: "Umum",
      color: "bg-muted text-muted-foreground",
    };

    return (
      <Link key={course.id} href={`/courses/${course.id}`} className="group">
        <Card className="h-full overflow-hidden border hover:shadow-md transition-all duration-200">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {course.image_path ? (
              <Image
                src={course.image_path}
                alt={course.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            {/* Status Badge */}
            {isCompleted && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary text-primary-foreground">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Selesai
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            {/* Difficulty & Progress */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md ${difficulty.color}`}
              >
                {difficulty.label}
              </span>
              {isStarted && !isCompleted && (
                <span className="text-xs font-medium text-primary">
                  {Math.round(progress)}%
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
              {course.name}
            </h3>

            {/* Progress Bar */}
            {isStarted && !isCompleted && (
              <div className="mb-4">
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Action */}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {isCompleted
                  ? "Lihat Kelas"
                  : isStarted
                  ? "Lanjut Belajar"
                  : "Mulai Belajar"}
              </span>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const renderEmptyState = (
    message: string,
    icon: React.ReactNode,
    showAction = true
  ) => (
    <div className="col-span-full">
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed bg-muted/20">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <p className="font-semibold mb-1">{message}</p>
        <p className="text-muted-foreground text-sm mb-5">
          Temukan kelas yang sesuai dengan minatmu
        </p>
        {showAction && (
          <Link href="/courses">
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Jelajah Kelas
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold">Kelas Saya</h1>
            <p className="text-sm text-muted-foreground">
              Kelola dan pantau progress belajarmu
            </p>
          </div>
        </div>
        <Link href="/courses">
          <Button>
            Jelajah Kelas Baru
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-muted-foreground">Total Kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCourses.length}</p>
                <p className="text-xs text-muted-foreground">
                  Sedang Dipelajari
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-xs text-muted-foreground">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notStartedCourses.length}</p>
                <p className="text-xs text-muted-foreground">Belum Dimulai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="h-auto p-1 bg-muted/50">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background"
          >
            Semua
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
              {courses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className="data-[state=active]:bg-background"
          >
            Dipelajari
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
              {inProgressCourses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-background"
          >
            Selesai
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
              {completedCourses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className="data-[state=active]:bg-background"
          >
            Belum Mulai
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
              {notStartedCourses.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {courses.length === 0 ? (
            renderEmptyState(
              "Belum ada kelas yang diikuti",
              <BookOpen className="h-6 w-6 text-primary" />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {inProgressCourses.length === 0 ? (
            renderEmptyState(
              "Tidak ada kelas yang sedang dipelajari",
              <Target className="h-6 w-6 text-primary" />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedCourses.length === 0 ? (
            renderEmptyState(
              "Belum ada kelas yang selesai",
              <Trophy className="h-6 w-6 text-primary" />
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="not-started" className="mt-6">
          {notStartedCourses.length === 0 ? (
            renderEmptyState(
              "Semua kelas sudah dimulai!",
              <CheckCircle2 className="h-6 w-6 text-primary" />,
              false
            )
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {notStartedCourses.map(renderCourseCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
