"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Loader2,
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  Trophy,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseDetail } from "@/types";

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: {
    label: "Pemula",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  intermediate: {
    label: "Menengah",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  advanced: {
    label: "Lanjutan",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/courses/${params.id}`);
      setCourse(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat detail kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleMainAction = async () => {
    if (!course) return;

    if (course.cta_state === "enroll") {
      setEnrolling(true);
      try {
        await api.post(`/courses/${course.id}/enroll`);
        toast.success("Berhasil mendaftar!", {
          description: "Selamat belajar. Anda akan diarahkan ke materi.",
        });

        await fetchDetail();
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Gagal mendaftar";

        if (error?.response?.status === 401) {
          router.push(`/login?redirect=/courses/${course.id}`);
          return;
        }

        toast.error(msg);
      } finally {
        setEnrolling(false);
      }
    } else if (course.cta_state === "continue") {
      const targetId =
        course.last_accessed_tutorial_id ||
        course.developer_journey_tutorials[0]?.id;

      if (!targetId) return;
      router.push(`/learning/module/${targetId}`);
    }
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm ">
        Kelas tidak ditemukan.
      </div>
    );
  }

  const progress = Math.min(Math.max(course.progress || 0, 0), 100);
  const diff =
    difficultyConfig[course.difficulty || ""] ??
    ({
      label: course.difficulty || "Semua level",
      className: "border-slate-200 bg-slate-50",
    } as const);

  return (
    <div className="mx-auto max-w-5xl pb-20 space-y-10">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative h-64 w-full md:h-72">
          {course.image_path ? (
            <>
              <Image
                src={course.image_path}
                alt={course.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-sm ">
              Tidak ada gambar untuk kelas ini
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={`border text-[11px] font-medium ${diff.className}`}
              >
                {diff.label}
              </Badge>
              <div className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-[11px] ">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>{course.point} XP Points</span>
              </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {course.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs ">
              <div className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{course.instructor?.name || "LMS Team"}</span>
              </div>
              {course.is_enrolled && (
                <div className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Progress {Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-6 border-t bg-background/80 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-2xl text-sm leading-relaxed ">
            {course.description ||
              "Tidak ada deskripsi detail untuk kelas ini."}
          </p>

          <div className="w-full space-y-2 md:w-auto md:min-w-[230px]">
            <Button
              size="lg"
              className="w-full font-semibold"
              onClick={handleMainAction}
              disabled={enrolling}
            >
              {enrolling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : course.cta_state === "continue" ? (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Lanjut Belajar
                </>
              ) : (
                "Daftar Kelas Sekarang"
              )}
            </Button>

            <p className="text-center text-[11px] ">
              {course.is_enrolled
                ? `Kamu sudah terdaftar. Progress saat ini: ${Math.round(
                    progress
                  )}%.`
                : "Akses kelas ini selamanya secara gratis."}
            </p>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        {/* Materi */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">
              Materi Pembelajaran
            </h3>
          </div>
          <p className="text-sm ">
            Ikuti modul secara berurutan untuk mendapatkan hasil belajar yang
            maksimal.
          </p>

          <Card className="border border-border/70">
            <CardContent className="p-0">
              {course.developer_journey_tutorials.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-sm ">
                  Belum ada materi yang diunggah.
                </div>
              ) : (
                <ul className="divide-y">
                  {course.developer_journey_tutorials.map((tutorial, index) => {
                    // Tentukan Icon & Warna berdasarkan user_status
                    let icon = <Lock className="w-4 h-4" />;
                    let circleClass = "bg-slate-100 ";
                    if (tutorial.user_status === "finished") {
                      icon = <CheckCircle className="w-4 h-4" />;
                      circleClass = "bg-emerald-100 text-emerald-700";
                    } else if (tutorial.user_status === "submitted") {
                      icon = <Clock className="w-4 h-4" />;
                      circleClass = "bg-yellow-100 text-yellow-700";
                    } else if (!tutorial.is_locked) {
                      icon = <PlayCircle className="w-4 h-4" />;
                      circleClass = "bg-blue-100 ";
                    }

                    const isLocked = !!tutorial.is_locked;
                    const isClickable = !isLocked;

                    const itemContent = (
                      <div
                        className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          isLocked
                            ? "bg-muted/40  cursor-not-allowed"
                            : "hover:bg-muted/40"
                        }`}
                        aria-disabled={isLocked}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${circleClass}`}
                            aria-hidden
                          >
                            {icon}
                          </div>

                          <div>
                            <p className="line-clamp-1 font-medium text-foreground">
                              {tutorial.title}
                            </p>
                            <p className="text-xs capitalize ">
                              {tutorial.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {tutorial.user_status === "finished" && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              Selesai
                            </span>
                          )}

                          {tutorial.user_status === "submitted" && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-xs text-yellow-700 border-yellow-200"
                            >
                              Review
                            </Badge>
                          )}

                          {isLocked ? (
                            <Lock className="h-4 w-4 " />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <li key={tutorial.id}>
                        {isClickable ? (
                          // clickable only when not locked
                          <Link
                            href={`/learning/module/${tutorial.id}`}
                            className="block"
                            aria-label={`Buka modul ${tutorial.title}`}
                          >
                            {itemContent}
                          </Link>
                        ) : (
                          // not clickable when locked
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={() => {}}
                            className="block"
                            aria-label={`${tutorial.title} terkunci`}
                          >
                            {itemContent}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Sidebar info */}
        <aside className="space-y-4">
          <Card className="border border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Ringkasan Kelas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-5">
                <span className="">Instruktur</span>
                <span className="font-medium">
                  {course.instructor?.name || "LMS Team"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="">Level</span>
                <span className="font-medium">{diff.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="">Total Modul</span>
                <span className="font-medium">
                  {course.developer_journey_tutorials.length} modul
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="">XP yang didapat</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  {course.point} XP
                </span>
              </div>

              {course.is_enrolled && (
                <div className="pt-3 space-y-2">
                  <p className="text-xs ">Progres belajar kamu</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs ">
                    Sudah selesai{" "}
                    <span className="font-medium">{Math.round(progress)}%</span>{" "}
                    dari materi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ============================= */
/* 🔷 Skeleton Loading Component */
/* ============================= */

function CourseDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Hero skeleton */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Skeleton className="h-64 w-full md:h-72" />
        <div className="border-t bg-background/80 px-6 py-5 md:px-8">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-4 w-full md:w-2/3" />
            <Skeleton className="h-10 w-full md:w-56 rounded-md" />
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
          <Card className="border border-border/70">
            <CardContent className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b last:border-b-0 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border border-border/70">
            <CardContent className="space-y-3 pt-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-4 h-2 w-full rounded-full" />
            </CardContent>
          </Card>
          <Card className="border-dashed border-border/70 bg-muted/30">
            <CardContent className="py-6 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
