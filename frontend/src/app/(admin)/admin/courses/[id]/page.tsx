"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import CourseForm from "@/components/admin/CourseForm";
import ModuleList from "@/components/admin/ModuleList";
import ModuleSheet from "@/components/admin/ModuleSheet";

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [course, setCourse] = useState<any | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet state for module editor
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      const data = res.data.data;
      setCourse(data);
      setModules(data.developer_journey_tutorials || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data kelas");
      router.push("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Course save handler (called by CourseForm)
  const handleSaveCourse = async (payload: any) => {
    try {
      await api.put(`/admin/courses/${id}`, payload);
      toast.success("Perubahan kelas disimpan");
      await fetchCourse();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menyimpan");
    }
  };

  const openAddModule = () => {
    setEditingModule(null);
    setIsSheetOpen(true);
  };

  const openEditModule = (mod: any) => {
    setEditingModule(mod);
    setIsSheetOpen(true);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Hapus modul ini permanen?")) return;
    try {
      await api.delete(`/admin/modules/${moduleId}`);
      toast.success("Modul dihapus");
      await fetchCourse();
    } catch (err) {
      toast.error("Gagal menghapus modul");
    }
  };

  const handleModuleSaved = async () => {
    setIsSheetOpen(false);
    setEditingModule(null);
    await fetchCourse();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center ">
        Kelas tidak ditemukan
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/courses")}
            className="inline-flex items-center rounded-md border px-2 py-1 text-sm  hover:bg-muted/40"
            aria-label="Kembali ke daftar"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-muted/30 px-3 py-1 text-xs font-medium">
            {course.status?.toUpperCase() ?? "UNKNOWN"}
          </span>
          <button
            className="text-sm  hover:text-foreground"
            onClick={fetchCourse}
            aria-label="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left: Form */}
        <div>
          <CourseForm course={course} onSave={handleSaveCourse} />
        </div>

        {/* Right: Modules */}
        <aside className="space-y-4">
          <ModuleList
            modules={modules}
            onAdd={openAddModule}
            onEdit={openEditModule}
            onDelete={handleDeleteModule}
          />
        </aside>
      </div>

      <ModuleSheet
        open={isSheetOpen}
        module={editingModule}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingModule(null);
        }}
        onSaved={handleModuleSaved}
        courseId={id}
      />
    </div>
  );
}
