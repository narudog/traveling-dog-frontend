"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReviewStore } from "@/store/review";
import { useImageStore } from "@/store/images";
import styles from "./page.module.scss";

export default function ReviewCreatePage() {
  const router = useRouter();
  const { create } = useReviewStore();
  const { uploadMultiple } = useImageStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    // 이미지 미리보기 생성
    if (selectedFiles) {
      const previews: string[] = [];
      Array.from(selectedFiles).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              previews.push(e.target.result as string);
              setPreviewImages([...previews]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      setPreviewImages([]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      let photos: string[] = [];
      if (files && files.length > 0) {
        const up = await uploadMultiple(Array.from(files));
        photos = up.imageUrls ?? [];
      }

      await create({
        title,
        content,
        isPublic,
        photos,
        tags,
      });

      alert("후기가 성공적으로 작성되었습니다!");
      router.push("/reviews/feed");
    } catch (error) {
      alert("후기 작성에 실패했습니다. 다시 시도해주세요.");
      console.error("Error creating review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>여행 후기 작성</h1>
        <p className={styles.subtitle}>멋진 여행의 추억을 공유해보세요</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.section}>
          <label className={styles.label}>제목</label>
          <input
            className={styles.input}
            placeholder="후기 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}>내용</label>
          <textarea
            className={styles.textarea}
            placeholder="여행의 생생한 경험을 자세히 적어주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}>태그</label>
          <div className={styles.tagInput}>
            <input
              className={styles.input}
              placeholder="태그를 입력하고 엔터를 누르세요"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              className={styles.addTagButton}
              onClick={addTag}
            >
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                  <button
                    type="button"
                    className={styles.removeTag}
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <label className={styles.label}>사진</label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" className={styles.fileInputLabel}>
              📷 사진 선택 ({files?.length || 0}개)
            </label>
          </div>

          {previewImages.length > 0 && (
            <div className={styles.imagePreview}>
              {previewImages.map((src, index) => (
                <div key={index} className={styles.previewItem}>
                  <img src={src} alt={`미리보기 ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>후기를 공개합니다</span>
          </label>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.back()}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "작성 중..." : "후기 작성"}
          </button>
        </div>
      </form>
    </div>
  );
}
