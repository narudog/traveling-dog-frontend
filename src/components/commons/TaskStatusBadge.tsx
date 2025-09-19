"use client";

import styles from "./TaskStatusBadge.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDraftPlanStore } from "@/store/draftPlan";

const TaskStatusBadge = () => {
  const router = useRouter();
  const {
    taskStatus,
    polling,
    startPolling,
    stopPolling,
    clearTaskStatus,
    initializeFromLocalStorage,
  } = useDraftPlanStore();

  useEffect(() => {
    initializeFromLocalStorage();
  }, [initializeFromLocalStorage]);

  useEffect(() => {
    if (taskStatus?.status === "PROCESSING" && !polling && taskStatus?.taskId) {
      startPolling(taskStatus.taskId);
    }
    if (taskStatus && taskStatus.status !== "PROCESSING" && polling) {
      stopPolling();
    }
  }, [taskStatus, polling, startPolling, stopPolling]);

  if (!taskStatus) return null;

  const status = taskStatus.status;
  const isCompleted = status === "COMPLETED";
  const hasSavedId = true; //Boolean(taskStatus.savedPlanId);
  const targetHref =
    isCompleted && hasSavedId
      ? taskStatus.userId
        ? `/travel-plan/${taskStatus.savedPlanId}`
        : `/draft-plan/${taskStatus.savedPlanId}`
      : undefined;
  const className =
    status === "PROCESSING"
      ? `${styles.fab} ${styles.processing}`
      : status === "COMPLETED"
        ? `${styles.fab} ${styles.completed}`
        : `${styles.fab} ${styles.failed}`;

  return (
    <div className={styles.floating}>
      <div
        className={className}
        role={targetHref ? "button" : undefined}
        tabIndex={targetHref ? 0 : undefined}
        onClick={() => {
          if (targetHref) router.push(targetHref);
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && targetHref) {
            router.push(targetHref);
          }
        }}
      >
        {status === "PROCESSING" && <span className={styles.spinner}></span>}
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
      </div>
      <button
        className={styles.closeBtn}
        aria-label="close"
        onClick={(e) => {
          e.stopPropagation();
          clearTaskStatus();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default TaskStatusBadge;
