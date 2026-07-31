"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; // Import style default Quill

// Import ReactQuill secara dynamic agar tidak error saat SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"], // Fitur media
    ["code-block"], // Penting untuk LMS coding
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tulis konten di sini..."}
        className="h-[300px] mb-12" // mb-12 untuk memberi ruang toolbar bawah
      />
    </div>
  );
}
