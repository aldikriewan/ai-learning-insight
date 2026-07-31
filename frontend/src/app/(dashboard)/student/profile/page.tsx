"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Zap,
  Sparkles,
  BookOpen,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import api from "@/lib/axios";
import { AIInsight } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FocusTimeChart from "./fokusTime";
import ProfileContentSkeleton from "@/components/skeleton/ProfileContentSkeleton";

type FocusTimeData = {
  distribution: { name: string; value: number; count: number }[];
  optimal_period: string;
  optimal_time_range: string;
  total_activities: number;
};

const paceConfig: Record<
  string,
  { icon: typeof Zap; description: string; tip: string; color: string }
> = {
  "fast learner": {
    icon: Zap,
    description: "Kamu belajar dengan cepat dan efisien",
    tip: "Coba tantang diri dengan materi yang lebih kompleks",
    color: "text-primary",
  },
  "consistent learner": {
    icon: TrendingUp,
    description: "Kamu belajar dengan ritme stabil dan konsisten",
    tip: "Pertahankan rutinitas belajarmu yang sudah baik",
    color: "text-primary",
  },
  "reflective learner": {
    icon: BookOpen,
    description: "Kamu meluangkan waktu untuk memahami secara mendalam",
    tip: "Buat catatan atau mind map untuk memperkuat pemahaman",
    color: "text-primary",
  },
};

export default function StudentProfilePage() {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [focusTime, setFocusTime] = useState<FocusTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightRes, focusTimeRes] = await Promise.allSettled([
          api.get("/student/insights"),
          api.get("/student/focus-time"),
        ]);

        if (insightRes.status === "fulfilled" && insightRes.value.data.data) {
          setInsight(insightRes.value.data.data);
        }

        if (
          focusTimeRes.status === "fulfilled" &&
          focusTimeRes.value.data.data
        ) {
          setFocusTime(focusTimeRes.value.data.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
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
        description: "AI telah memperbarui profil belajarmu.",
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

  const paceLabel =
    insight?.pace?.pace_label?.toLowerCase() || "consistent learner";

  const PaceIcon =
    paceConfig[paceLabel]?.icon || paceConfig["consistent learner"].icon;

  if (loading) {
    return <ProfileContentSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold">Profil Belajar</h2>
            <p className="text-sm text-muted-foreground">
              Analisis berdasarkan aktivitas belajarmu
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateInsight}
          disabled={generating}
        >
          {generating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Perbarui
            </>
          )}
        </Button>
      </div>

      {insight ? (
        <div className="space-y-4">
          {/* Learning Type Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon & Label */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <PaceIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Tipe Belajar
                    </Badge>
                    <h3 className="text-2xl font-bold capitalize">
                      {insight.pace?.pace_label || "Consistent Learner"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paceConfig[paceLabel]?.description ||
                        "Belajar dengan ritme yang sesuai"}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-3 gap-3 md:ml-auto md:max-w-sm">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Waktu Optimal
                    </p>
                    <p className="font-semibold text-sm mt-0.5">
                      {insight.features?.optimal_study_time || "Pagi"}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">Kelas Aktif</p>
                    <p className="font-semibold text-sm mt-0.5">
                      {insight.features?.total_courses_enrolled || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Rata-rata Skor Ujian
                    </p>
                    <p className="font-semibold text-sm mt-0.5">
                      {insight.features?.avg_exam_score?.toFixed(0) || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip */}
              {paceConfig[paceLabel]?.tip && (
                <div className="mt-5 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-sm">
                    <Lightbulb className="h-4 w-4 inline mr-2 text-primary" />
                    <span className="font-medium">Tip:</span>{" "}
                    {paceConfig[paceLabel].tip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          {insight.advice?.advice_text && (
            <Card>
              <div className="flex items-center gap-3 px-6">
                <CardTitle className="text-base font-semibold">
                  Rekomendasi AI
                </CardTitle>
              </div>
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none prose-neutral dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-li:my-0.5 prose-headings:font-semibold">
                  <ReactMarkdown>{insight.advice.advice_text}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Focus Time Chart */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base font-semibold">
                  Distribusi Waktu Belajar
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-56">
                  <FocusTimeChart data={focusTime?.distribution || []} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      Waktu Optimal
                    </h4>
                    {focusTime && focusTime.total_activities > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Berdasarkan{" "}
                        <span className="font-medium text-foreground">
                          {focusTime.total_activities} aktivitas
                        </span>{" "}
                        belajarmu, waktu paling efektif adalah{" "}
                        <span className="font-medium text-foreground">
                          {focusTime.optimal_period} (
                          {focusTime.optimal_time_range})
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Belum ada data aktivitas. Mulai belajar untuk melihat
                        pola waktu optimalmu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Temukan Profil Belajarmu
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              AI akan menganalisis pola belajar dan memberikan rekomendasi
              personal untuk meningkatkan efektivitas belajarmu.
            </p>
            <Button
              onClick={handleGenerateInsight}
              disabled={generating}
              size="lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Mulai Analisis AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground pt-2">
        AI menganalisis waktu belajar, kecepatan, dan konsistensi untuk
        mengidentifikasi profil belajarmu.
      </p>
    </div>
  );
}
