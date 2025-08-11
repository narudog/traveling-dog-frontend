"use client";

import { useState } from "react";
import { useImageStore } from "@/store/images";

export default function ImageUploadTestPage() {
  const { upload, uploadMultiple, delete: del, guide } = useImageStore();
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <h1>이미지 업로드 테스트</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={async () => alert(JSON.stringify(await guide(), null, 2))}
        >
          가이드 확인
        </button>
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={async () => {
            if (!file) return;
            const res = await upload(file);
            setUploaded((u) => [...u, res.imageUrl]);
          }}
        >
          단일 업로드
        </button>
      </div>
      <div>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <button
          onClick={async () => {
            if (!files || files.length === 0) return;
            const res = await uploadMultiple(Array.from(files));
            setUploaded((u) => [...u, ...(res.imageUrls || [])]);
          }}
        >
          다중 업로드
        </button>
      </div>
      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {uploaded.map((url) => (
          <li key={url} style={{ border: "1px solid #eee", padding: 8 }}>
            <img src={url} style={{ maxWidth: 200 }} />
            <button onClick={async () => await del(url)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
