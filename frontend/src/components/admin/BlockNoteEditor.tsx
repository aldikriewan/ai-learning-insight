"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";

/**
 * Improved BlockNote wrapper:
 * - safe initial load (clones blocks)
 * - debounced onChange
 * - avoid replaceBlocks race while user is editing
 */

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string; // JSON string from DB (array of blocks)
  editable?: boolean;
  debounceMs?: number;
}

export default function BlockEditor({
  onChange,
  initialContent,
  editable = true,
  debounceMs = 400,
}: EditorProps) {
  // refs to avoid re-creating fns / to store timers
  const lastInitialRef = useRef<string | undefined>(undefined);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingInitialRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Update onChange ref when it changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // utility: safe deep clone
  const deepClone = useCallback((v: any) => {
    if (typeof structuredClone === "function") return structuredClone(v);
    return JSON.parse(JSON.stringify(v));
  }, []);

  // Parse initial content only once
  const parsedInitialContent = useRef<PartialBlock[] | null>(null);

  const { theme, systemTheme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

const resolvedTheme =
  theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (!initialContent || parsedInitialContent.current !== null) return;

    try {
      const parsed = JSON.parse(initialContent);
      if (Array.isArray(parsed)) {
        parsedInitialContent.current = deepClone(parsed);
      }
    } catch (err) {
      console.error("Failed to parse initialContent", err);
      parsedInitialContent.current = [];
    }
  }, [initialContent, deepClone]);

  // create editor once with initial content
  const editor = useCreateBlockNote({
    initialContent: parsedInitialContent.current || undefined,
    uploadFile: async (file) => {
      // replace with real upload in production
      return URL.createObjectURL(file);
    },
  });

  // Debounced onChange handler
  const handleChange = useCallback(() => {
    if (!editor) return;
    if (isLoadingInitialRef.current) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      try {
        const json = editor.document;
        const str = JSON.stringify(json);
        onChangeRef.current(str);
      } catch (err) {
        console.error("Failed to serialize BlockNote document", err);
      }
    }, debounceMs);
  }, [editor, debounceMs]);

  // Handle external content updates (when initialContent prop changes)
  useEffect(() => {
    if (!editor) return;
    if (!initialContent) return;

    // Only update if content actually changed
    if (initialContent === lastInitialRef.current) return;

    // Don't update if user is actively editing
    const currentContent = JSON.stringify(editor.document);
    if (lastInitialRef.current && currentContent !== lastInitialRef.current) {
      // Content has diverged - user made changes, don't overwrite
      console.log("Skipping external update - user has made changes");
      return;
    }

    async function updateContent() {
      try {
        const parsed: PartialBlock[] = JSON.parse(initialContent);
        if (!Array.isArray(parsed)) {
          console.warn("Initial content is not an array of blocks");
          return;
        }

        isLoadingInitialRef.current = true;

        // Clone to avoid reference issues
        const cloneBlocks = deepClone(parsed);

        // Replace blocks
        await editor.replaceBlocks(editor.document, cloneBlocks);

        lastInitialRef.current = initialContent;
      } catch (err) {
        console.error("Failed to update content", err);
      } finally {
        // Wait a bit before allowing onChange to fire
        setTimeout(() => {
          isLoadingInitialRef.current = false;
        }, 100);
      }
    }

    updateContent();
  }, [initialContent, editor, deepClone]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!editor) {
    return (
      <div className="p-4 rounded-lg">
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        editable ? "min-h-[300px]" : ""
      }`}
    >
      <BlockNoteView
        editor={editor}
        editable={editable}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleChange}
        className="py-4"
      />
    </div>
  );
}
