"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReviewStore } from "@/store/review";
import { useSocialStore } from "@/store/social";

export default function ReviewDetailPage() {
  const params = useParams<{ reviewId: string }>();
  const id = Number(params.reviewId);
  const { getOne, like, unlike } = useReviewStore();
  const { reviewComments, createComment } = useSocialStore();
  const [review, setReview] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const run = async () => {
      const r = await getOne(id);
      setReview(r);
      const c = await reviewComments(id, { page: 0, size: 10 });
      setComments(c.content ?? []);
    };
    run();
  }, [id, getOne, reviewComments]);

  if (!review) return <div style={{ padding: 16 }}>로딩 중…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>{review.title}</h1>
      <div style={{ whiteSpace: "pre-wrap" }}>{review.content}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => like(id)}>좋아요</button>
        <button onClick={() => unlike(id)}>좋아요 취소</button>
      </div>
      <h3 style={{ marginTop: 24 }}>댓글</h3>
      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {comments.map((c) => (
          <li key={c.id} style={{ border: "1px solid #eee", padding: 8 }}>
            <div style={{ fontWeight: 600 }}>{c.authorNickname}</div>
            <div>{c.content}</div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button
          onClick={async () => {
            if (!commentInput.trim()) return;
            await createComment(id, { content: commentInput });
            const c = await reviewComments(id, { page: 0, size: 10 });
            setComments(c.content ?? []);
            setCommentInput("");
          }}
        >
          등록
        </button>
      </div>
    </div>
  );
}
