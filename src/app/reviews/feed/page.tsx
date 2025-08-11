"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReviewStore } from "@/store/review";

export default function ReviewFeedPage() {
  const { feed } = useReviewStore();
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "views">(
    "latest"
  );
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const run = async () => {
      const res = await feed({ sortBy, page, size });
      setItems(res.content);
      setTotalPages(res.totalPages);
    };
    run();
  }, [sortBy, page, size, feed]);

  return (
    <div style={{ padding: 16 }}>
      <h1>후기 피드</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["latest", "popular", "views"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setSortBy(k)}
            style={{ fontWeight: sortBy === k ? 700 : 400 }}
          >
            {k}
          </button>
        ))}
        <Link href="/reviews/create">작성하기</Link>
      </div>
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {items.map((r) => (
          <li key={r.id} style={{ border: "1px solid #eee", padding: 12 }}>
            <Link href={`/reviews/${r.id}`}>{r.title}</Link>
            <div style={{ fontSize: 12, color: "#666" }}>
              좋아요 {r.likeCount} · 조회 {r.viewCount}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
          이전
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
