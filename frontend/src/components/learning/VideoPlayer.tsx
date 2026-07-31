"use client";

export default function VideoPlayer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const videoUrl = content?.includes("http")
    ? content.replace("watch?v=", "embed/")
    : "";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allowFullScreen
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 bg-slate-900">
            <p>URL Video tidak valid atau kosong</p>
          </div>
        )}
      </div>
    </div>
  );
}
