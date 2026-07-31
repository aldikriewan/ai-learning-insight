"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function QuizPlayer({ module, onComplete }: any) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);

  const questions = module.content ? JSON.parse(module.content) : [];

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    const score = (correct / questions.length) * 100;
    const passed = score >= 70;

    setResult({ score, passed });
    if (passed) {
      toast.success(`Lulus! Skor: ${score}`);
      onComplete(); // Panggil fungsi parent untuk navigasi
    } else {
      toast.error(`Gagal. Skor: ${score}. Coba lagi.`);
    }
  };

  if (result?.passed) {
    return (
      <Card className="p-10 text-center bg-green-50 border-green-200">
        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-green-800">Quiz Lulus!</h3>
        <p className="text-green-700">Skor: {Math.round(result.score)}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-slate-200">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-2">
          Quiz
        </Badge>
        <h3 className="text-xl font-bold">Uji Pemahaman</h3>
        <p className="">KKM: 70</p>
      </div>
      <div className="space-y-8">
        {questions.map((q: any, idx: number) => (
          <div key={idx} className="space-y-3">
            <p className="font-medium text-lg">
              {idx + 1}. {q.question}
            </p>
            <RadioGroup
              onValueChange={(val) =>
                setAnswers((p) => ({ ...p, [idx]: parseInt(val) }))
              }
            >
              {q.options.map((opt: string, oIdx: number) => (
                <div
                  key={oIdx}
                  className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer ${
                    answers[idx] === oIdx ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <RadioGroupItem
                    value={oIdx.toString()}
                    id={`q${idx}-${oIdx}`}
                  />
                  <Label
                    htmlFor={`q${idx}-${oIdx}`}
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
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Cek Jawaban
        </Button>
      </div>
    </Card>
  );
}
