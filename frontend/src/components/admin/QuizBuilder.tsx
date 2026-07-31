"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash, CheckCircle, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Struktur Data Quiz
interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Props {
  initialContent: string;
  onChange: (jsonString: string) => void;
}

export default function QuizBuilder({ initialContent, onChange }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);

  // 1. Load Data Awal
  useEffect(() => {
    try {
      if (initialContent && initialContent.trim() !== "") {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      } else {
        // Default: 1 Pertanyaan Kosong
        setQuestions([{ question: "", options: ["", ""], correctIndex: 0 }]);
      }
    } catch (e) {
      console.error("Gagal parse quiz JSON", e);
      setQuestions([{ question: "", options: ["", ""], correctIndex: 0 }]);
    }
  }, [initialContent]);

  // 2. Update Parent Component setiap ada perubahan state
  const updateParent = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    onChange(JSON.stringify(newQuestions));
  };

  // --- HANDLERS PERTANYAAN ---
  const addQuestion = () => {
    const newQ = { question: "", options: ["", ""], correctIndex: 0 };
    updateParent([...questions, newQ]);
  };

  const removeQuestion = (idx: number) => {
    const newQ = questions.filter((_, i) => i !== idx);
    updateParent(newQ);
  };

  const updateQuestionText = (idx: number, text: string) => {
    const newQ = [...questions];
    newQ[idx].question = text;
    updateParent(newQ);
  };

  // --- HANDLERS OPSI ---
  const addOption = (qIdx: number) => {
    const newQ = [...questions];
    newQ[qIdx].options.push(""); // Tambah opsi kosong
    updateParent(newQ);
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const newQ = [...questions];
    // Minimal sisa 2 opsi
    if (newQ[qIdx].options.length <= 2) {
      toast.warning("Minimal harus ada 2 pilihan jawaban");
      return;
    }
    newQ[qIdx].options = newQ[qIdx].options.filter((_, i) => i !== oIdx);

    // Jika opsi yg dihapus adalah kunci jawaban, atau kunci jawaban ada di bawahnya
    if (newQ[qIdx].correctIndex >= oIdx && newQ[qIdx].correctIndex > 0) {
      newQ[qIdx].correctIndex -= 1; // Geser index kunci jawaban
    }

    updateParent(newQ);
  };

  const updateOptionText = (qIdx: number, oIdx: number, text: string) => {
    const newQ = [...questions];
    newQ[qIdx].options[oIdx] = text;
    updateParent(newQ);
  };

  const setCorrectAnswer = (qIdx: number, oIdx: number) => {
    const newQ = [...questions];
    newQ[qIdx].correctIndex = oIdx;
    updateParent(newQ);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIdx) => (
        <Card
          key={qIdx}
          className="p-4 border-slate-300 relative bg-slate-50/50"
        >
          <div className="flex items-start gap-3">
            <div className="mt-2 text-slate-400">
              <Badge
                variant="outline"
                className="h-6 w-6 flex items-center justify-center p-0 bg-white"
              >
                {qIdx + 1}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              {/* Input Pertanyaan */}
              <div>
                <Label className="text-xs  mb-1.5 block">
                  Pertanyaan
                </Label>
                <Input
                  value={q.question}
                  onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                  placeholder="Contoh: Apa kepanjangan HTML?"
                  className="bg-white font-medium"
                />
              </div>

              {/* List Opsi */}
              <div className="space-y-2">
                <Label className="text-xs  block">
                  Pilihan Jawaban (Klik lingkaran untuk set Kunci Jawaban)
                </Label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    {/* Radio Button Custom untuk Correct Answer */}
                    <div
                      onClick={() => setCorrectAnswer(qIdx, oIdx)}
                      className={`
                            cursor-pointer w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                            ${
                              q.correctIndex === oIdx
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-slate-300 bg-white hover:border-slate-400"
                            }
                        `}
                      title="Tandai sebagai jawaban benar"
                    >
                      {q.correctIndex === oIdx && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Input Opsi */}
                    <Input
                      value={opt}
                      onChange={(e) =>
                        updateOptionText(qIdx, oIdx, e.target.value)
                      }
                      placeholder={`Pilihan ${oIdx + 1}`}
                      className={`bg-white h-9 ${
                        q.correctIndex === oIdx
                          ? "border-green-500 ring-1 ring-green-100"
                          : ""
                      }`}
                    />

                    {/* Hapus Opsi */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={() => removeOption(qIdx, oIdx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs h-8"
                  onClick={() => addOption(qIdx)}
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Pilihan
                </Button>
              </div>
            </div>

            {/* Hapus Pertanyaan */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => removeQuestion(qIdx)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="default"
        className="w-full border-dashed border-2 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        onClick={addQuestion}
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Pertanyaan Baru
      </Button>
    </div>
  );
}
