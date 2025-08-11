"use client";

import { useState } from "react";
import { useReviewStore } from "@/store/review";
import { useImageStore } from "@/store/images";

export default function ReviewCreatePage() {
  const { create } = useReviewStore();
  const { uploadMultiple } = useImageStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <h1>후기 작성</h1>
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />
      <label>
        공개 여부
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button
        onClick={async () => {
          let photos: string[] = [];
          if (files && files.length > 0) {
            const up = await uploadMultiple(Array.from(files));
            photos = up.imageUrls ?? [];
          }
          await create({ title, content, isPublic, photos });
          alert("작성 완료");
        }}
      >
        작성
      </button>
    </div>
  );
}
