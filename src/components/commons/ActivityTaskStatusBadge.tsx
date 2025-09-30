"use client";

import styles from "./TaskStatusBadge.module.scss";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useTodayActivityStore } from "@/store/todayActivity";
import { useRouter } from "next/navigation";

const ActivityTaskStatusBadge = () => {
  const router = useRouter();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    taskStatus,
    polling,
    startPolling,
    stopPolling,
    clearTaskStatus,
    initializeActivityPollingFromLocalStorage,
  } = useTodayActivityStore();

  useEffect(() => {
    initializeActivityPollingFromLocalStorage();
  }, [initializeActivityPollingFromLocalStorage]);

  useEffect(() => {
    if (taskStatus?.status === "PROCESSING" && !polling && taskStatus?.taskId) {
      startPolling(taskStatus.taskId);
    }
    if (taskStatus && taskStatus.status !== "PROCESSING" && polling) {
      stopPolling();
    }
  }, [taskStatus, polling, startPolling, stopPolling]);

  const shareUrl = useMemo(() => {
    if (!taskStatus) return "";
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    if (taskStatus.taskId) {
      return `${origin}/qr-redirect?taskId=${encodeURIComponent(taskStatus.taskId)}&type=activity`;
    }
    return "";
  }, [taskStatus?.taskId, taskStatus?.status]);

  useEffect(() => {
    if (!isQrOpen) return;
    if (!shareUrl) {
      setError("유효한 QR 링크가 없습니다.");
      return;
    }
    QRCode.toDataURL(shareUrl, { margin: 2, scale: 6 })
      .then((url) => {
        setQrDataUrl(url);
        setError(null);
      })
      .catch(() => setError("QR 생성에 실패했습니다."));
  }, [isQrOpen, shareUrl]);

  if (!taskStatus) return null;

  const status = taskStatus.status;
  const fabClassName =
    status === "PROCESSING"
      ? `${styles.activityFab} ${styles.processing}`
      : status === "COMPLETED"
        ? `${styles.activityFab} ${styles.completed}`
        : `${styles.activityFab} ${styles.failed}`;

  const hasQr = Boolean(taskStatus.taskId);

  const targetHref = status === "COMPLETED";

  return (
    <div className={styles.activityFloating}>
      <div className={styles.wrapper}>
        <div
          className={fabClassName}
          role="status"
          aria-live="polite"
          onClick={() => {
            if (targetHref) router.push("/?tab=today");
          }}
        >
          {status === "PROCESSING" && <span className={styles.spinner} />}
          {status === "COMPLETED" && (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
          {status === "FAILED" && (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 9L9 15M9 9l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {hasQr && (
          <>
            <button
              className={styles.qrBtn}
              aria-label="앱에서 이어하기 QR 열기"
              onClick={(e) => {
                e.stopPropagation();
                setIsQrOpen(true);
              }}
              title="앱에서 이어하기"
            >
              QR
            </button>
            <span className={styles.qrTooltip} role="tooltip">
              QR을 스캔하면 앱에서 볼 수 있어요.
            </span>
          </>
        )}
        <button
          className={styles.closeBtn}
          aria-label="close"
          onClick={(e) => {
            e.stopPropagation();
            clearTaskStatus();
          }}
          title="닫기"
        >
          ×
        </button>
      </div>

      {isQrOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setIsQrOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: 8 }}>앱에서 이어하기</h3>
            <p style={{ marginTop: 0, color: "#6b7280" }}>
              이 QR을 스캔하면 앱으로 이동해 작업을 이어볼 수 있어요.
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", padding: 12 }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="activity task QR"
                  width={240}
                  height={240}
                />
              ) : (
                <span className={styles.spinner} aria-label="로딩중" />
              )}
            </div>
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            <div className={styles.actionRow}>
              <button
                className={styles.actionBtn}
                onClick={async () => {
                  if (!shareUrl) return;
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("링크가 복사되었습니다.");
                  } catch {}
                }}
              >
                링크 복사
              </button>
              <button
                className={styles.actionBtnSecondary}
                onClick={() => setIsQrOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTaskStatusBadge;
