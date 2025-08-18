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
}

const DraggableActivity: React.FC<DraggableActivityProps> = ({
  activity,
  index,
  onPlaceClick,
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
      onClick={(e) => {
        e.stopPropagation();
        onPlaceClick(activity);
      }}
      className={`${styles.activityCard} ${isDragging ? styles.dragging : ""}`}
      title={`${activity.locationName}에서 구글 맵 검색 | 드래그하여 순서 변경`}
    >
      <div className={styles.activityNumber}>{index + 1}</div>
      <div className={styles.activityContent}>
        <div className={styles.activityTitle}>{activity.title}</div>
        <div className={styles.activityLocation}>
          📍 {activity.locationName}
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
      >
        ⠿
      </div>
    </div>
  );
};

export default DraggableActivity;
