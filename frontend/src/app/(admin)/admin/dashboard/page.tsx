"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Activity, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Locale Indonesia

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch (error) {
        toast.error("Gagal memuat statistik");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Data untuk Cards
  const cards = [
    {
      title: "Total Siswa",
      value: stats.counts.students,
      icon: Users,
      desc: "Pengguna aktif terdaftar",
      color: "text-blue-600",
    },
    {
      title: "Kelas Published",
      value: stats.counts.courses,
      icon: BookOpen,
      desc: "Materi siap dipelajari",
      color: "text-violet-600",
    },
    {
      title: "Total Enrollment",
      value: stats.counts.enrollments,
      icon: Activity,
      desc: "Partisipasi belajar",
      color: "text-green-600",
    },
    {
      title: "Perlu Review",
      value: stats.counts.pending_review,
      icon: AlertCircle,
      desc: "Tugas menunggu penilaian",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="">Ringkasan aktivitas LMS hari ini.</p>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs ">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. RECENT ACTIVITY */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pendaftaran Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Mendaftar Kelas</TableHead>
                  <TableHead className="text-right">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recent_activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Belum ada aktivitas
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recent_activities.map((act: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="font-medium">{act.user.name}</div>
                        <div className="text-xs ">
                          {act.user.email}
                        </div>
                      </TableCell>
                      <TableCell>{act.journey.name}</TableCell>
                      <TableCell className="text-right text-xs ">
                        {format(
                          new Date(act.enrolled_at),
                          "d MMM yyyy, HH:mm",
                          { locale: id }
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Placeholder untuk Grafik AI nanti */}
        <Card className="col-span-3  border-dashed">
          <CardHeader>
            <CardTitle className="">
              AI Insights (Coming Soon)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] text-sm text-center px-4">
            Area ini akan menampilkan prediksi drop-out siswa dan rekomendasi
            materi berbasis Python ML.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
