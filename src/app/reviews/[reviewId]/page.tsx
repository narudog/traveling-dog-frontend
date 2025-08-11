"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReviewStore } from "@/store/review";
import { useSocialStore } from "@/store/social";
import Carousel from "@/components/carousel/Carousel";
import styles from "./page.module.scss";

export default function ReviewDetailPage() {
  const params = useParams<{ reviewId: string }>();
  const router = useRouter();
  const id = Number(params.reviewId);
  const { getOne, like, unlike } = useReviewStore();
  const { reviewComments, createComment } = useSocialStore();
  const [review, setReview] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await getOne(id);
        setReview(r);
        setLikeCount(r.likeCount || 0);

        const c = await reviewComments(id, { page: 0, size: 50 });
        setComments(c.content ?? []);
      } catch (err: any) {
        setError(err?.message || "후기를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlike(id);
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await like(id);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      await createComment(id, { content: commentInput });
      const c = await reviewComments(id, { page: 0, size: 50 });
      setComments(c.content ?? []);
      setCommentInput("");
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>후기를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>😔 오류가 발생했습니다</h2>
          <p>{error}</p>
          <button className={styles.backButton} onClick={() => router.back()}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← 목록으로
        </button>
      </div>

      <article className={styles.review}>
        <div className={styles.reviewHeader}>
          <h1 className={styles.title}>{review.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>✍️ {review.authorNickname}</span>
            <span className={styles.date}>
              📅 {formatDate(review.createdAt)}
            </span>
            <span className={styles.views}>👀 {review.viewCount || 0}</span>
          </div>
        </div>

        {review.imageUrls && review.imageUrls.length > 0 && (
          <div className={styles.imageCarousel}>
            <Carousel
              slidesToShow={1}
              showArrows={false}
              showDots={review.imageUrls.length > 1}
              autoplay={false}
            >
              {review.imageUrls.map((photo: string, index: number) => (
                <div key={index} className={styles.carouselImageItem}>
                  <img
                    src={photo}
                    alt={`후기 이미지 ${index + 1}`}
                    className={styles.carouselImage}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.text}>{review.content}</div>
        </div>

        {review.tags && review.tags.length > 0 && (
          <div className={styles.tags}>
            {review.tags.map((tag: string, index: number) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            {isLiked ? "❤️" : "🤍"} {likeCount}
          </button>
          <span className={styles.actionInfo}>
            {isLiked ? "좋아요를 눌렀습니다" : "좋아요"}
          </span>
        </div>
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>💬 댓글 ({comments.length})</h2>

        <div className={styles.commentForm}>
          <textarea
            className={styles.commentInput}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
          />
          <button
            className={styles.commentSubmitButton}
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim() || submittingComment}
          >
            {submittingComment ? "등록 중..." : "댓글 등록"}
          </button>
        </div>

        <div className={styles.commentsList}>
          {comments.length === 0 ? (
            <div className={styles.noComments}>
              아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요! 💭
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    👤 {comment.authorNickname}
                  </span>
                  <span className={styles.commentDate}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className={styles.commentContent}>{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
