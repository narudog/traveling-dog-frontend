"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReviewStore } from "@/store/review";
import styles from "./HomeFeed.module.scss";

export default function HomeFeed() {
  const { feed } = useReviewStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await feed({ sortBy: "popular", page: 0, size: 8 });
        setItems(res.content ?? []);
      } catch (e: any) {
        setError(e?.message || "피드 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [feed]);

  if (loading) return <div className={styles.state}>후기 불러오는 중...</div>;
  if (error) return <div className={styles.state}>오류: {error}</div>;
  if (!items.length)
    return <div className={styles.state}>아직 후기가 없어요</div>;

  return (
    <ul className={styles.grid}>
      {items.map((r) => (
        <li key={r.id} className={styles.card}>
          <Link href={`/reviews/${r.id}`} className={styles.link}>
            <div className={styles.thumbnail}>
              {/* 첫 사진이 있으면 썸네일로 */}
              {r.imageUrls.length ? (
                <img src={r.imageUrls[0]} alt={r.title} />
              ) : (
                <div className={styles.placeholder}>No Image</div>
              )}
            </div>
            <div className={styles.body}>
              <h3 className={styles.title}>{r.title}</h3>
              <div className={styles.meta}>
                <span>좋아요 {r.likeCount}</span>
                <span>조회 {r.viewCount}</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
