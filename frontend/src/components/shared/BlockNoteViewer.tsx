"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";

interface ViewerProps {
  content: string; // JSON String dari DB
}

export default function BlockNoteViewer({ content }: ViewerProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  // Parsing konten
  const initialBlocks = useMemo(() => {
    try {
      return content ? (JSON.parse(content) as PartialBlock[]) : undefined;
    } catch (e) {
      return undefined;
    }
  }, [content]);

  // Inisialisasi Editor Mode Baca (Read-Only)
  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  if (!editor) return null;

  return (
    <div className="bn-viewer-wrapper">
      {/* bn-viewer-wrapper bisa kita styling di global css jika perlu margin tambahan */}
      <BlockNoteView
        editor={editor}
        editable={false} // <--- KUNCI: Read Only
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
