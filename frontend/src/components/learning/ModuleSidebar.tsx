"use client";

import Link from "next/link";
import {
  CheckCircle,
  Lock,
  PlayCircle,
  Circle,
  ChevronLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ModuleItem = {
  id: number;
  title: string;
  type: string;
  is_locked: boolean;
  is_completed: boolean;
  user_status?: string; // 'viewed' | 'in_progress' | 'finished' | 'submitted' | 'failed'
  position?: number;
};

type Props = {
  courseId: number;
  courseTitle: string;
  modules: ModuleItem[];
  currentModuleId: number | string;
};

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const map: Record<string, { label: string; cls: string }> = {
    finished: { label: "Selesai", cls: "bg-success/10 text-success" },
    in_progress: { label: "Sedang", cls: "bg-info/10 text-info" },
    viewed: { label: "Dilihat", cls: "bg-muted text-muted-foreground" },
    submitted: { label: "Review", cls: "bg-warning/10 text-warning" },
    failed: { label: "Revisi", cls: "bg-destructive/10 text-destructive" },
  };
  const item = map[status] ?? {
    label: status,
    cls: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${item.cls}`}
    >
      {item.label}
    </span>
  );
}

export default function ModuleSidebar({
  courseId,
  courseTitle,
  modules,
  currentModuleId,
}: Props) {
  return (
    <aside className="flex flex-col h-full w-80 shrink-0 bg-background border-r">
      <div className="px-4 py-4 border-b">
        <div className="flex items-center justify-between gap-2">
          <div>
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center text-xs  hover:text-foreground"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Kembali ke Kelas
            </Link>
            <h3 className="mt-2 text-sm font-semibold text-foreground leading-tight line-clamp-2">
              {courseTitle}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Daftar modul & progres
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {modules.map((mod, i) => {
            const isActive = String(mod.id) === String(currentModuleId);
            const isLocked = !!mod.is_locked;
            const baseLink = isLocked ? "#" : `/learning/module/${mod.id}`;
            return (
              <div
                key={mod.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-white to-info/10 ring-1 ring-info/20 shadow-sm"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold",
                      mod.is_completed
                        ? "bg-success/10 text-success"
                        : isLocked
                        ? "bg-muted text-muted-foreground"
                        : "bg-info/10 text-info"
                    )}
                  >
                    {mod.position ?? i + 1}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={baseLink}
                    className={cn(
                      "block text-sm font-medium truncate",
                      isActive ? "text-info" : "text-foreground",
                      isLocked
                        ? "pointer-events-none opacity-60"
                        : "hover:underline"
                    )}
                    aria-disabled={isLocked}
                    title={mod.title}
                  >
                    {mod.title}
                  </Link>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px]  bg-muted px-2 py-0.5 rounded uppercase tracking-wide">
                      {mod.type}
                    </span>

                    {/* status pill based on user_status / completion */}
                    {mod.user_status ? (
                      <StatusPill status={mod.user_status} />
                    ) : mod.is_completed ? (
                      <Badge variant="outline" className="text-xs">
                        Selesai
                      </Badge>
                    ) : isLocked ? (
                      <span className="text-[11px] text-destructive">Terkunci</span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {mod.is_completed ? (
                    <CheckCircle className="w-5 h-5 text-success mt-1" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-muted mt-1" />
                  ) : isActive ? (
                    <PlayCircle className="w-5 h-5 text-info mt-1" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
