"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  ChevronRight,
  PlayCircle,
  Code,
  Lock,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import HtmlContent from "@/components/shared/HtmlContent";

const BlockNoteViewer = dynamic(
  () => import("@/components/shared/BlockNoteViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-40  animate-pulse rounded-lg" />
    ),
  }
);

type AnyModule = any;

export default function LearningPlayerPage() {
  const params = useParams();
  const router = useRouter();

  const [module, setModule] = useState<AnyModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  // Submission form
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/learning/module/${params.id}`);
        setModule(res.data.data);
        // prefill existing submission info if present
        if (res.data.data?.submission) {
          setSubmissionLink(res.data.data.submission.app_link || "");
          setSubmissionNote(res.data.data.submission.app_comment || "");
        }
      } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.message || "Gagal memuat materi";
        toast.error("Akses Ditolak", { description: msg });

        if (err.response?.status === 403) {
          const errorData = err.response.data;
          if (
            errorData?.data?.missing_modules &&
            errorData.data.missing_modules.length > 0
          ) {
            const firstMissing = errorData.data.missing_modules[0];
            toast.error("Materi Terkunci!", {
              description: `Selesaikan dulu: ${firstMissing.title}`,
              action: {
                label: "Ke Materi Tersebut",
                onClick: () =>
                  router.push(`/learning/module/${firstMissing.id}`),
              },
            });
            // optional redirect
            setTimeout(
              () => router.push(`/learning/module/${firstMissing.id}`),
              1200
            );
            return;
          } else {
            router.push("/courses");
            return;
          }
        }

        toast.error("Gagal memuat materi");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // ===== START QUIZ =====
  const handleStartQuiz = async () => {
    if (!module) return;
    setQuizLoading(true);
    try {
      const res = await api.post(`/learning/quiz/${module.id}/start`);
      const data = res.data.data;

      if (data.already_completed && data.result?.is_passed) {
        setQuizResult({ score: data.result.score, passed: true });
        setQuizStarted(true);
      } else {
        setQuizStarted(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memulai quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  // ===== QUIZ SUBMIT =====
  const handleQuizSubmit = async () => {
    if (!module?.content) return;
    let questions: any[] = [];
    try {
      questions = JSON.parse(module.content);
    } catch {
      toast.error("Format soal tidak valid");
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correctCount++;
    });

    const score = (correctCount / questions.length) * 100;
    const passed = score >= 70;

    setQuizLoading(true);
    try {
      const res = await api.post(`/learning/quiz/${module.id}/submit`, {
        answers: quizAnswers,
        score,
        total_questions: questions.length,
        is_passed: passed,
      });

      setQuizResult({ score, passed });

      if (passed) {
        toast.success(`Lulus! Skor: ${Math.round(score)}`);
        // Update module status
        setModule({ ...module, current_status: "finished" });
      } else {
        toast.error(`Belum lulus. Skor: ${Math.round(score)} — Coba lagi.`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal submit quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  // ===== HANDLE ACTION (submit / complete / navigate) =====
  const handleAction = async () => {
    if (!module) return;

    // If already finished, just navigate (don't call API)
    if (module.current_status === "finished") {
      if (module.next_tutorial_id) {
        router.push(`/learning/module/${module.next_tutorial_id}`);
      } else {
        router.push(`/courses/${module.developer_journey_id}`);
      }
      return;
    }

    // Submission flow
    if (module.type === "submission") {
      if (!submissionLink) {
        toast.error("Link project wajib diisi!");
        return;
      }

      setActionLoading(true);
      try {
        const res = await api.post(
          `/courses/${module.developer_journey_id}/modules/${module.id}/submit`,
          { app_link: submissionLink, app_comment: submissionNote }
        );

        toast.success("Tugas Terkirim!");
        // Update local module state
        setModule({
          ...module,
          current_status: "submitted",
          submission_status: "submitted",
          submission_note:
            res.data.data?.submission_note ?? module.submission_note,
        });

        // Optionally navigate to next if backend gives it
        if (res.data.data?.next_tutorial_id) {
          router.push(`/learning/module/${res.data.data.next_tutorial_id}`);
        } else {
          // stay on page but maybe redirect to course detail for clarity
          router.push(`/courses/${module.developer_journey_id}`);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal submit");
      } finally {
        setActionLoading(false);
      }
      return;
    }

    // Article/Video/Quiz: mark complete
    setActionLoading(true);
    try {
      const res = await api.post(`/learning/module/${module.id}/complete`);
      const result = res.data.data as { next_tutorial_id?: number };

      // Update local state to finished
      setModule({ ...module, current_status: "finished" });

      if (result?.next_tutorial_id) {
        toast.success("Selesai!", { description: "Lanjut materi berikutnya" });
        router.push(`/learning/module/${result.next_tutorial_id}`);
      } else {
        toast.success("Kelas Selesai 🎉", {
          description: "Selamat! Semua modul selesai.",
        });
        router.push(`/courses/${module.developer_journey_id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal update progress");
    } finally {
      setActionLoading(false);
    }
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    if (!module) return null;

    // QUIZ
    if (module.type === "quiz") {
      let questions: any[] = [];
      try {
        questions = module.content ? JSON.parse(module.content) : [];
      } catch {
        return <div className="text-red-500">Error parsing quiz data</div>;
      }

      // Already passed
      if (quizResult?.passed || module.current_status === "finished") {
        return (
          <Card className="p-10 text-center  border-green-200">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-green-800">Quiz Lulus!</h3>
            <p className="text-green-700">
              Skor Anda: {Math.round(quizResult?.score || 100)}
            </p>
            <p className="text-sm  mt-4">
              Modul telah ditandai selesai.
            </p>
            <div className="mt-6">
              {module.next_tutorial_id ? (
                <Button
                  size="lg"
                  onClick={() =>
                    router.push(`/learning/module/${module.next_tutorial_id}`)
                  }
                >
                  Materi Selanjutnya <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    router.push(`/courses/${module.developer_journey_id}`)
                  }
                >
                  Kembali ke Kelas
                </Button>
              )}
            </div>
          </Card>
        );
      }

      // Not started yet - Show start button
      if (!quizStarted) {
        return (
          <Card className="p-10 max-w-2xl mx-auto mt-4 text-center ">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full  flex items-center justify-center">
              <PlayCircle className="w-10 h-10 text-blue-600" />
            </div>
            <Badge variant="outline" className="mb-3">
              Quiz
            </Badge>
            <h3 className="text-2xl font-bold  mb-2">
              {module.title}
            </h3>
            <p className=" mb-2">
              Uji pemahaman Anda dengan menjawab {questions.length} pertanyaan
            </p>
            <div className="flex justify-center gap-4 text-sm  mb-6">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {questions.length * 2} menit
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                KKM: 70
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleStartQuiz}
              disabled={quizLoading}
              className="px-8"
            >
              {quizLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <PlayCircle className="mr-2 w-5 h-5" />
              )}
              Mulai Quiz
            </Button>
          </Card>
        );
      }

      // Quiz in progress
      return (
        <Card className="p-6 max-w-3xl mx-auto mt-4 ">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-2">
              Quiz Mode
            </Badge>
            <h3 className="text-xl font-bold">Uji Pemahaman Anda</h3>
            <p className="">KKM: 70. Jawab dengan teliti.</p>
          </div>

          <div className="space-y-8">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-3">
                <p className="font-medium text-lg">
                  {qIdx + 1}. {q.question}
                </p>
                <RadioGroup
                  value={quizAnswers[qIdx]?.toString()}
                  onValueChange={(val) =>
                    setQuizAnswers((prev) => ({
                      ...prev,
                      [qIdx]: parseInt(val),
                    }))
                  }
                >
                  {q.options.map((opt: string, oIdx: number) => (
                    <div
                      key={oIdx}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                        quizAnswers[qIdx] === oIdx
                          ? "border-blue-500 "
                          : ""
                      }`}
                    >
                      <RadioGroupItem
                        value={oIdx.toString()}
                        id={`q${qIdx}-opt${oIdx}`}
                      />
                      <Label
                        htmlFor={`q${qIdx}-opt${oIdx}`}
                        className="flex-1 cursor-pointer"
                      >
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Show retry message if failed */}
          {quizResult && !quizResult.passed && (
            <div className="mt-6 p-4  border border-red-200 rounded-lg text-center">
              <p className="text-red-700 font-medium">
                Skor: {Math.round(quizResult.score)} - Belum mencapai KKM
              </p>
              <p className="text-red-600 text-sm mt-1">
                Silakan coba lagi dengan menjawab ulang
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleQuizSubmit}
              size="lg"
              disabled={
                quizLoading ||
                Object.keys(quizAnswers).length < questions.length
              }
            >
              {quizLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              Cek Jawaban
            </Button>
          </div>
        </Card>
      );
    }

    // SUBMISSION
    if (module.type === "submission") {
      const status = module.submission_status || null;
      const note = module.submission_note || module.feedback || null;

      // Submitted / Under Review
      if (status === "submitted") {
        return (
          <Card className="p-8 max-w-2xl mx-auto mt-8 border border-yellow-200 bg-yellow-50 text-center">
            <Clock className="w-16 h-16 mx-auto text-yellow-600 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">
              Sedang Direview
            </h3>
            <p className="text-yellow-700">
              Tugas Anda sedang diperiksa oleh instruktur.
            </p>
            <div className="mt-4 text-sm ">
              <p>
                Jika ingin, Anda dapat menunggu atau kembali ke halaman kelas.
              </p>
            </div>
          </Card>
        );
      }

      // Passed / Finished
      if (status === "finished" || module.submission_status === "passed") {
        return (
          <Card className="p-8 max-w-2xl mx-auto mt-8 border border-green-200 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Tugas Lulus!
            </h3>
            <p className="text-green-700 mb-4">
              Selamat, Anda telah menyelesaikan modul ini.
            </p>
            {note && (
              <div className=" p-4 rounded-lg text-sm text-left border border-green-200">
                <strong>Feedback Instruktur:</strong>
                <div className="mt-2">{note}</div>
              </div>
            )}
          </Card>
        );
      }

      // Failed (need revision) or default form
      const isFailed = status === "failed";

      return (
        <Card
          className={`p-6 max-w-2xl mx-auto mt-8 border ${
            isFailed
              ? "border-red-200 bg-red-50"
              : "border-blue-100 bg-blue-50/50"
          }`}
        >
          <div className="text-center mb-6">
            {isFailed ? (
              <>
                <XCircle className="w-12 h-12 mx-auto text-red-600 mb-2" />
                <h3 className="text-xl font-bold text-red-900">
                  Revisi Diperlukan
                </h3>
                <p className="text-red-700 mb-4">
                  Silakan perbaiki dan kirim ulang.
                </p>
                {note && (
                  <div className=" p-3 rounded text-sm text-red-800 mb-4 text-left">
                    <strong>Catatan Revisi:</strong>
                    <div className="mt-1">{note}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Code className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <h3 className="text-xl font-bold ">
                  Submission Project
                </h3>
                <p className="">
                  Upload tugas Anda untuk direview.
                </p>
              </>
            )}
          </div>

          <div className="space-y-4  p-4 rounded-lg border shadow-sm">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Link Repository
              </label>
              <Input
                placeholder="https://github.com/username/project"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catatan</label>
              <Textarea
                placeholder="Catatan untuk reviewer..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
              />
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleAction}
            disabled={actionLoading}
            className="bg-blue-600 "
          >
            {actionLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Code className="mr-2 w-4 h-4" />
            )}
            {module.submission_status === "failed"
              ? "Kirim Revisi"
              : "Kirim Tugas"}
          </Button>
        </Card>
      );
    }

    // VIDEO
    if (module.type === "video") {
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-6">
          {module.content?.includes("http") ? (
            <iframe
              src={module.content.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
              title={module.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full ">
              Video URL Invalid
            </div>
          )}
        </div>
      );
    }

    // ARTICLE (or default)
    return (
      <div className=" p-6 rounded-xl border shadow-sm min-h-[300px] ">
        {/* prefer BlockNoteViewer if content is blocknote JSON, else fall back to HtmlContent */}
        {module.content &&
        typeof module.content === "string" &&
        module.content.trim().startsWith("[") ? (
          <BlockNoteViewer content={module.content || "[]"} />
        ) : (
          <HtmlContent html={module.content || ""} />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!module) return null;

  // ===== FOOTER BUTTON RENDERER (kept for compatibility) =====
  const renderFooterButton = () => {
    // Finished
    if (module.current_status === "finished") {
      if (module.next_tutorial_id) {
        return (
          <Button
            size="lg"
            onClick={() =>
              router.push(`/learning/module/${module.next_tutorial_id}`)
            }
          >
            Materi Selanjutnya <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        );
      }
      return (
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push(`/courses/${module.developer_journey_id}`)}
        >
          Kembali ke Kelas <CheckCircle className="ml-2 w-4 h-4" />
        </Button>
      );
    }

    // Submission
    if (module.type === "submission") {
      if (module.current_status === "submitted") {
        return module.next_tutorial_id ? (
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/learning/module/${module.next_tutorial_id}`)
            }
          >
            Lanjut Materi Lain <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/courses/${module.developer_journey_id}`)
            }
          >
            Kembali ke Detail
          </Button>
        );
      }
    }

    // Quiz - Don't show footer button, quiz handles its own completion
    if (module.type === "quiz") {
      return null;
    }

    // Standard material (article/video only)
    return (
      <Button size="lg" onClick={handleAction} disabled={actionLoading}>
        {actionLoading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <CheckCircle className="mr-2 w-4 h-4" />
        )}
        Selesai & Lanjut
      </Button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/courses/${module.developer_journey_id}`)}
        >
          &larr; Kembali
        </Button>
        <Badge variant="outline" className="uppercase">
          {module.type}
        </Badge>
      </div>

      <h1 className="text-3xl font-bold  mb-6">{module.title}</h1>

      {/* Content */}
      <div className="min-h-[300px]">{renderContent()}</div>

      {/* Footer */}
      <div className="mt-10 flex justify-end border-t pt-6 space-x-3">
        {renderFooterButton()}
      </div>
    </div>
  );
}
