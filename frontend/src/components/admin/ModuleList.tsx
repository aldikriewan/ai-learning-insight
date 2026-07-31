// components/admin/ModuleList.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash,
  GripVertical,
  FileText,
  Video,
  Code,
  CheckCircle,
} from "lucide-react";

type ModuleListProps = {
  modules: any[];
  onAdd: () => void;
  onEdit: (mod: any) => void;
  onDelete: (id: number) => void;
};

const getIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="w-4 h-4 text-blue-600" />;
    case "submission":
      return <Code className="w-4 h-4 text-purple-600" />;
    case "quiz":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    default:
      return <FileText className="w-4 h-4 text-slate-600" />;
  }
};

export default function ModuleList({
  modules,
  onAdd,
  onEdit,
  onDelete,
}: ModuleListProps) {
  return (
    <div className=" rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Silabus / Modul</h3>
        <Button size="sm" onClick={onAdd}>
          <PlusIcon /> Tambah
        </Button>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {modules.length === 0 ? (
          <div className="text-sm  text-center py-6 italic border-dashed rounded-md border p-4">
            Belum ada modul
          </div>
        ) : (
          modules.map((mod: any, idx: number) => (
            <div
              key={mod.id}
              className="flex items-center justify-between gap-3 p-3 rounded-md border group hover:bg-muted/40 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/5 text-primary text-sm font-semibold">
                  {idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {mod.title}
                    </span>
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {mod.type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="mr-1  hidden sm:inline">
                  {getIcon(mod.type)}
                </span>
                <Button variant="ghost" size="icon" onClick={() => onEdit(mod)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(mod.id)}
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
                <div className="cursor-grab px-1  hidden sm:flex">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Small inline icon component used above */
function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className="mr-1"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
