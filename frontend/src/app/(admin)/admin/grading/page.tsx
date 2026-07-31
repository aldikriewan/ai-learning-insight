"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns"; // npm install date-fns
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import {
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipe Data Submission
interface Submission {
  id: number;
  status: string;
  app_link: string;
  app_comment?: string;
  created_at: string;
  journey: { name: string };
  quiz: { title: string }; // Ingat: quiz_id di submission merujuk ke tutorial
  submitter: { name: string; email: string };
}

// Schema Form Review
const reviewSchema = z.object({
  status: z.enum(["passed", "failed"]),
  rating: z.coerce.number().min(1).max(5),
  note: z.string().optional(),
});

export default function AdminGradingPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // State Dialog Review
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { status: "passed", rating: 5, note: "" },
  });

  // 1. Fetch Data
  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/admin/submissions");
      setSubmissions(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 2. Handle Buka Modal
  const handleOpenReview = (sub: Submission) => {
    setSelectedSub(sub);
    form.reset({ status: "passed", rating: 5, note: "" }); // Reset form
    setIsReviewOpen(true);
  };

  // 3. Handle Submit Review
  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!selectedSub) return;
    try {
      await api.put(`/admin/submissions/${selectedSub.id}/review`, values);

      toast.success(
        `Tugas berhasil dinilai: ${
          values.status === "passed" ? "LULUS" : "GAGAL"
        }`
      );
      setIsReviewOpen(false);
      fetchSubmissions(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan nilai");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Penilaian Tugas</h2>
        <p className="">
          Review project siswa dan berikan feedback.
        </p>
      </div>

      <div className="border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>Kelas & Modul</TableHead>
              <TableHead>Tanggal Submit</TableHead>
              <TableHead>Link Project</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 "
                >
                  Tidak ada tugas yang perlu direview 🎉
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="font-medium">{sub.submitter.name}</div>
                    <div className="text-xs ">
                      {sub.submitter.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {sub.journey.name}
                    </div>
                    <div className="text-xs ">
                      {sub.quiz.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), "dd MMM yyyy, HH:mm", {
                      locale: idLocale,
                    })}
                  </TableCell>
                  <TableCell>
                    <a
                      href={sub.app_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      Buka Link <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                    {sub.app_comment && (
                      <div className="mt-1 text-xs  italic max-w-[200px] truncate">
                        "{sub.app_comment}"
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleOpenReview(sub)}>
                      Nilai Tugas
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG REVIEW */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Tugas</DialogTitle>
            <DialogDescription>
              Berikan nilai dan feedback untuk{" "}
              <b>{selectedSub?.submitter.name}</b>.
            </DialogDescription>
          </DialogHeader>

          {selectedSub && (
            <div className=" p-3 rounded border text-sm mb-4 space-y-1">
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={selectedSub.app_link}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {selectedSub.app_link}
                </a>
              </p>
              <p>
                <strong>Komentar Siswa:</strong>{" "}
                <span className="italic text-slate-600">
                  {selectedSub.app_comment || "-"}
                </span>
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keputusan</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passed">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-2" /> Lulus
                              (Pass)
                            </div>
                          </SelectItem>
                          <SelectItem value="failed">
                            <div className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-2" /> Revisi (Fail)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          max={5}
                          min={1}
                          step={0.1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback / Catatan Revisi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Codingan rapi, tapi perhatikan struktur folder..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : null}
                  Simpan Penilaian
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
