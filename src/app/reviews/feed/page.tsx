"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useReviewStore } from "@/store/review";
import styles from "./page.module.scss";

export default function ReviewFeedPage() {
  const { feed } = useReviewStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadReviews = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const res = await feed({
          sortBy: "popular",
          page: pageNum,
          size: 12,
        });

        const newItems = res.content ?? [];

        if (reset) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        // 더 이상 로드할 데이터가 없는지 확인
        const isLastPage = res.page >= res.totalPages - 1;
        setHasMore(!isLastPage && newItems.length > 0);
      } catch (e: any) {
        setError(e?.message || "후기 로딩 실패");
      } finally {
        setLoading(false);
        if (initialLoading) setInitialLoading(false);
      }
    },
    [feed, loading, initialLoading]
  );

  // 초기 로드
  useEffect(() => {
    loadReviews(0, true);
  }, []);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadReviews(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page, loadReviews]);

  if (initialLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>여행 후기</h1>
        </div>
        <div className={styles.loading}>후기를 불러오는 중...</div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>여행 후기</h1>
        </div>
        <div className={styles.error}>오류: {error}</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>여행 후기</h1>
        </div>
        <div className={styles.empty}>아직 후기가 없어요</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>여행 후기</h1>
        <p className={styles.subtitle}>
          다른 여행자들의 생생한 후기를 확인해보세요
        </p>
      </div>

      <div className={styles.grid}>
        {items.map((review) => (
          <Link
            key={review.id}
            href={`/reviews/${review.id}`}
            className={styles.card}
          >
            <div className={styles.thumbnail}>
              {review.imageUrls.length ? (
                <img
                  src={review.imageUrls[0]}
                  alt={review.title}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <span>📷</span>
                </div>
              )}
            </div>

            <div className={styles.content}>
              <h3 className={styles.reviewTitle}>{review.title}</h3>
              <div className={styles.meta}>
                <span className={styles.likes}>❤️ {review.likeCount}</span>
                <span className={styles.views}>👀 {review.viewCount}</span>
              </div>

              {review.tags && review.tags.length > 0 && (
                <div className={styles.tags}>
                  {review.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingMore}>
          <div className={styles.spinner}></div>
          <span>더 많은 후기를 불러오는 중...</span>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className={styles.endMessage}>모든 후기를 확인했습니다 ✨</div>
      )}

      {error && items.length > 0 && (
        <div className={styles.errorMessage}>
          추가 후기를 불러오는데 실패했습니다. 다시 시도해주세요.
        </div>
      )}
    </div>
  );
}
