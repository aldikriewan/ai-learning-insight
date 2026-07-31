"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, BookOpen, ChevronRight, Sparkles } from "lucide-react";

import api from "@/lib/axios";
import { Course } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseCatalogSkeleton from "@/components/skeleton/CourseCatalogSkeleton";

const difficultyConfig: Record<string, { label: string }> = {
  beginner: { label: "Pemula" },
  intermediate: { label: "Menengah" },
  advanced: { label: "Lanjutan" },
};

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses"); // Endpoint public
        setCourses(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <CourseCatalogSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold">Jelajah Kelas</h1>
            <p className="text-sm text-muted-foreground">
              Temukan materi pembelajaran terbaik untuk mengembangkan skill dan
              pengetahuanmu
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full">
            Belajar fleksibel, kapan saja
          </Badge>
        </div>
      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed bg-muted/20">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold mb-1">Katalog kelas masih kosong</p>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Nantikan berbagai kelas seru yang akan segera hadir untuk menemani
            perjalanan belajarmu.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => {
            const diff = difficultyConfig[course.difficulty || ""] ?? {
              label: course.difficulty || "Semua level",
            };

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border hover:shadow-md transition-all duration-200">
                  {/* Cover Image */}
                  <div className="relative aspect-video w-full bg-muted overflow-hidden">
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
                  </div>

                  <CardContent className="p-4">
                    {/* Difficulty & XP */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                        {diff.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Trophy className="h-3.5 w-3.5 text-primary" />
                        <span>{course.point ?? 0} XP</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {course.name}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {course.summary ||
                        "Belum ada deskripsi singkat untuk kelas ini."}
                    </p>

                    {/* Action */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Lihat Detail
                      </span>
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
