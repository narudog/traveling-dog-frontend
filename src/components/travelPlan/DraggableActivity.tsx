"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Location } from "@/types/plan";
import styles from "../../app/travel-plan/[id]/page.module.scss";

interface DraggableActivityProps {
  activity: Location;
  index: number;
  onPlaceClick: (activity: Location) => void;
  onEditClick?: (activity: Location) => void;
  onDeleteClick?: (activity: Location) => void;
  isEditable?: boolean;
}

const DraggableActivity: React.FC<DraggableActivityProps> = ({
  activity,
  index,
  onPlaceClick,
  onEditClick,
  onDeleteClick,
  isEditable = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${styles.activityCard} ${isDragging ? styles.dragging : ""}`}
    >
      {/* 우측 상단 아이콘들 */}
      <div className={styles.activityIcons}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={(e) => {
            e.stopPropagation();
            onPlaceClick(activity);
          }}
          title={`${activity.locationName}에서 구글 지도 검색`}
          aria-label={`${activity.locationName}를 구글 지도에서 검색`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
        {isEditable && (
          <>
            <button
              type="button"
              className={styles.iconButton}
              onClick={(e) => {
                e.stopPropagation();
                onEditClick && onEditClick(activity);
              }}
              title="클릭하여 편집"
              aria-label="활동 편집"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L10 17l-4 1 1-4L18.5 2.5z" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick && onDeleteClick(activity);
              }}
              title="클릭하여 삭제"
              aria-label="활동 삭제"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className={styles.activityNumber}>{index + 1}</div>
      <div className={styles.activityContent}>
        <div className={styles.activityTitleRow}>
          <div className={styles.activityTitle}>{activity.title}</div>
        </div>
        {activity.description && (
          <div className={styles.activityDescription}>
            {activity.description}
          </div>
        )}
        {activity.cost && (
          <div className={styles.activityCost}>💰 {activity.cost}</div>
        )}
      </div>
      <div
        className={styles.dragHandle}
        {...listeners}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        title="드래그하여 순서 변경"
        aria-label="드래그하여 순서를 변경"
        aria-grabbed={isDragging}
        role="button"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    </div>
  );
};

export default DraggableActivity;
