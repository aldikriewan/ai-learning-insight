"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Code, Loader2 } from "lucide-react";

type Props = {
  module: any;
  onSubmit: (link: string, note: string) => Promise<void>;
  loading: boolean;
};

export default function SubmissionPlayer({ module, onSubmit, loading }: Props) {
  const [link, setLink] = useState(module.submission?.app_link || "");
  const [note, setNote] = useState(module.submission?.app_comment || "");

  const status = module.submission_status; // submitted, passed, failed
  const feedback = module.submission_note;

  // VIEW: UNDER REVIEW
  if (status === "submitted") {
    return (
      <Card className="p-10 text-center bg-yellow-50 border-yellow-200 max-w-2xl mx-auto">
        <Clock className="w-16 h-16 mx-auto text-yellow-600 mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-yellow-800 mb-2">
          Sedang Direview
        </h3>
        <p className="text-yellow-700">
          Tugas sedang diperiksa oleh instruktur.
        </p>
      </Card>
    );
  }

  // VIEW: PASSED
  if (status === "passed") {
    return (
      <Card className="p-10 text-center bg-green-50 border-green-200 max-w-2xl mx-auto">
        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Tugas Lulus!</h3>
        {feedback && (
          <div className="mt-4 bg-white/60 p-4 rounded text-left text-sm text-green-900">
            <strong>Feedback:</strong> {feedback}
          </div>
        )}
      </Card>
    );
  }

  // VIEW: FORM (NEW or FAILED)
  const isFailed = status === "failed";

  return (
    <Card
      className={`p-6 max-w-2xl mx-auto border ${
        isFailed ? "border-red-200 bg-red-50" : "border-blue-100 bg-blue-50/30"
      }`}
    >
      <div className="text-center mb-8">
        {isFailed ? (
          <>
            <XCircle className="w-12 h-12 mx-auto text-red-600 mb-2" />
            <h3 className="text-xl font-bold text-red-800">
              Revisi Diperlukan
            </h3>
            {feedback && (
              <p className="text-red-700 text-sm mt-2 bg-white/50 p-2 rounded">
                "{feedback}"
              </p>
            )}
          </>
        ) : (
          <>
            <Code className="w-12 h-12 mx-auto text-blue-600 mb-2" />
            <h3 className="text-xl font-bold text-blue-900">Upload Tugas</h3>
            <p className="text-blue-700/80 text-sm">
              Kerjakan tugas sesuai instruksi di atas.
            </p>
          </>
        )}
      </div>

      <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <label className="text-sm font-medium mb-1.5 block text-slate-700">
            Link Repository / Project
          </label>
          <Input
            placeholder="https://github.com/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block text-slate-700">
            Catatan (Opsional)
          </label>
          <Textarea
            placeholder="Catatan untuk reviewer..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => onSubmit(link, note)}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {isFailed ? "Kirim Revisi" : "Kirim Tugas"}
        </Button>
      </div>
    </Card>
  );
}
