"use client";

import dynamic from "next/dynamic";
import HtmlContent from "@/components/shared/HtmlContent";

// Load BlockNoteViewer secara dynamic
const BlockNoteViewer = dynamic(
  () => import("@/components/shared/BlockNoteViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 bg-slate-100 animate-pulse rounded-lg" />
    ),
  }
);

export default function ArticleViewer({ content }: { content: string }) {
  const isBlockNote =
    content && typeof content === "string" && content.trim().startsWith("[");

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border shadow-sm min-h-[50vh]">
      {isBlockNote ? (
        <BlockNoteViewer content={content || "[]"} />
      ) : (
        <HtmlContent content={content || ""} />
      )}
    </div>
  );
}
