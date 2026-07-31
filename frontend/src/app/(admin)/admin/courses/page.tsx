"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash,
  Search,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const createCourseSchema = z.object({
  name: z.string().min(3),
  summary: z.string().min(10),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  point: z.coerce.number().min(0),
});

type CreateCourseValues = z.infer<typeof createCourseSchema>;

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { name: "", summary: "", difficulty: "beginner", point: 0 },
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onSubmit = async (values: CreateCourseValues) => {
    try {
      const res = await api.post("/admin/courses", values);
      toast.success("Kelas berhasil dibuat!");
      setOpenDialog(false);
      form.reset();
      router.push(`/admin/courses/${res.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat kelas");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kelas ini?")) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Kelas dihapus");
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal hapus");
    }
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Manajemen Kelas
          </h2>
          <p className="text-sm ">
            Buat, edit, dan kelola semua kelas yang tersedia di platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kelas..."
                className="pl-10 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
            </div>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Buat Kelas Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Kelas Baru</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kelas</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Belajar React"
                            {...field}
                          />
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
                          <Input placeholder="Deskripsi pendek..." {...field} />
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
                                <SelectValue placeholder="Pilih tingkat" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Pemula</SelectItem>
                                <SelectItem value="intermediate">
                                  Menengah
                                </SelectItem>
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Menyimpan...
                      </>
                    ) : (
                      "Buat Draft"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Daftar Kelas</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <div className="flex items-center gap-4 py-4">
                          <Skeleton className="h-6 w-44" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Belum ada kelas
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="hover:underline"
                        >
                          {course.name}
                        </Link>
                        <div className="mt-1 text-xs ">
                          {course.summary}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="capitalize">
                        <span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium">
                          {course.difficulty}
                        </span>
                      </TableCell>

                      <TableCell>
                        {course._count?.enrollments || 0} siswa
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/courses/${course.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit Konten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(course.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
