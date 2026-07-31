"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Video, FileText, Code, HelpCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import QuizBuilder from "./QuizBuilder";
import dynamic from "next/dynamic";
const BlockEditor = dynamic(() => import("./BlockNoteEditor"), { ssr: false });

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  type: z.enum(["article", "video", "quiz", "submission"]),
  content: z.string().optional(),
});

type Props = {
  open: boolean;
  module: any | null;
  onClose: () => void;
  onSaved: () => void;
  courseId: string;
};

export default function ModuleSheet({
  open,
  module,
  onClose,
  onSaved,
  courseId,
}: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      type: "article",
      content: "",
    },
  });

  // Pantau perubahan tipe modul
  const selectedType = form.watch("type");

  useEffect(() => {
    if (module) {
      form.reset({
        title: module.title,
        type: module.type,
        content: module.content || "",
      });
    } else {
      form.reset({
        title: "",
        type: "article",
        content: "",
      });
    }
  }, [module, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      // Validasi sederhana tambahan
      if (values.type === "video" && !values.content?.includes("http")) {
        toast.error("Untuk tipe video, konten harus berupa URL valid");
        return;
      }

      if (module) {
        await api.put(`/admin/modules/${module.id}`, values);
        toast.success("Modul diperbarui");
      } else {
        await api.post(`/admin/courses/${courseId}/modules`, values);
        toast.success("Modul ditambahkan");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menyimpan modul");
    }
  };

  // Helper untuk render input content yang dinamis
  const renderContentInput = (field: any) => {
    switch (selectedType) {
      case "article":
        return (
          <div className="space-y-2">
            <FormLabel>Isi Artikel (BlockNote)</FormLabel>
            <BlockEditor
              initialContent={field.value}
              onChange={field.onChange}
            />
            <FormDescription>
              Ketik / untuk memanggil menu (Heading, List, Code Block, Image).
            </FormDescription>
          </div>
        );

      case "video":
        return (
          <FormItem>
            <FormLabel>URL Video (YouTube)</FormLabel>
            <FormControl>
              <div className="relative">
                <Video className="absolute left-3 top-2.5 h-4 w-4 " />
                <Input
                  {...field}
                  className="pl-9"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </FormControl>
            <FormDescription>
              Masukkan link YouTube lengkap. Sistem akan otomatis mengubahnya
              menjadi embed.
            </FormDescription>
          </FormItem>
        );

      case "submission":
        return (
          <div className="space-y-2">
            <FormLabel>Instruksi Tugas</FormLabel>
            <BlockEditor
              initialContent={field.value}
              onChange={field.onChange}
            />
          </div>
        );

      case "quiz":
        return (
          <FormItem>
            <FormLabel>Konfigurasi Quiz (JSON)</FormLabel>
            <QuizBuilder
              initialContent={field.value} // Pass string JSON dari form
              onChange={field.onChange} // Update form saat quiz berubah
            />
          </FormItem>
        );

      default:
        return (
          <FormItem>
            <FormLabel>Konten</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        {/* Note: Ukuran diperlebar jadi max-w-2xl agar editor lebih lega */}

        <SheetHeader>
          <SheetTitle>{module ? "Edit Modul" : "Tambah Modul Baru"}</SheetTitle>
          <SheetDescription>
            Sesuaikan tipe konten agar tampilan belajar siswa optimal.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 pb-20 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Modul</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Contoh: Pengenalan React Hooks"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Selector */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Konten</FormLabel>
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
                        <SelectItem value="article">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />{" "}
                            Artikel (Teks & Gambar)
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Video className="w-4 h-4 mr-2 text-red-500" />{" "}
                            Video (YouTube)
                          </div>
                        </SelectItem>
                        <SelectItem value="submission">
                          <div className="flex items-center">
                            <Code className="w-4 h-4 mr-2 text-purple-500" />{" "}
                            Submission (Tugas Coding)
                          </div>
                        </SelectItem>
                        <SelectItem value="quiz">
                          <div className="flex items-center">
                            <HelpCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                            Quiz (Pilihan Ganda)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <div className="mt-2">
                    {renderContentInput(field)}
                    <FormMessage />
                  </div>
                )}
              />

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="ghost" onClick={onClose} type="button">
                  Batal
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : null}
                  Simpan Modul
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
