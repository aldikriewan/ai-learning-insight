// components/admin/CourseForm.tsx
"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().optional(),
  image_path: z.string().optional(),
  point: z.coerce.number().min(0),
  hours_to_study: z.coerce.number().min(0),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.boolean().default(false),
});

type CourseFormProps = {
  course: any;
  onSave: (payload: any) => Promise<void>;
};

export default function CourseForm({ course, onSave }: CourseFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: course?.name ?? "",
      summary: course?.summary ?? "",
      description: course?.description ?? "",
      image_path: course?.image_path ?? "",
      point: course?.point ?? 0,
      hours_to_study: course?.hours_to_study ?? 0,
      difficulty: course?.difficulty ?? "beginner",
      status: course?.status === "published",
    },
  });

  // Keep form in sync when course prop changes
  React.useEffect(() => {
    form.reset({
      name: course?.name ?? "",
      summary: course?.summary ?? "",
      description: course?.description ?? "",
      image_path: course?.image_path ?? "",
      point: course?.point ?? 0,
      hours_to_study: course?.hours_to_study ?? 0,
      difficulty: course?.difficulty ?? "beginner",
      status: course?.status === "published",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const payload = {
      ...values,
      status: values.status ? "published" : "draft",
      listed: values.status,
    };
    await onSave(payload);
  };

  return (
    <div className=" rounded-lg border shadow-sm p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Kelas</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Judul kelas..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ringkasan Singkat</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={2}
                    placeholder="Untuk kartu katalog..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Lengkap</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Deskripsi panjang..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Pemula</SelectItem>
                        <SelectItem value="intermediate">Menengah</SelectItem>
                        <SelectItem value="advanced">Mahir</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="point"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XP Points</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hours_to_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimasi Durasi (jam)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar Cover</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 bg-muted/10">
                <div>
                  <FormLabel className="text-base">
                    Tampilkan di katalog
                  </FormLabel>
                  <FormDescription>
                    Jika aktif, kelas akan tampil untuk siswa.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="ml-auto">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 opacity-0" />
                Simpan Perubahan
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
