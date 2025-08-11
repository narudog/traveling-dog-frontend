"use client";

import { useEffect, useState } from "react";
import { useTodayActivityStore } from "@/store/todayActivity";
import type { SavedActivityResponseDTO } from "@/types/todayActivity";
import styles from "./page.module.scss";

export default function SavedActivitiesPage() {
  const { listSaved, listSavedByCategory, removeSaved } =
    useTodayActivityStore();
  const [activities, setActivities] = useState<SavedActivityResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  // 카테고리 목록
  const categories = [
    { value: "all", label: "전체" },
    { value: "맛집", label: "🍽️ 맛집" },
    { value: "명소", label: "🏛️ 명소" },
    { value: "카페", label: "☕ 카페" },
    { value: "자연", label: "🌳 자연" },
    { value: "체험", label: "🎨 체험" },
  ];

  const loadActivities = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      let data: SavedActivityResponseDTO[];
      if (category && category !== "all") {
        data = await listSavedByCategory(category);
      } else {
        data = await listSaved();
      }
      setActivities(data);
    } catch (err: any) {
      setError(err?.message || "저장된 활동을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRemoveActivity = async (activityId: string) => {
    if (removingIds.has(activityId)) return;

    if (!confirm("정말로 이 활동을 삭제하시겠습니까?")) return;

    setRemovingIds((prev) => new Set(prev).add(activityId));
    try {
      await removeSaved(activityId);
      // 삭제 후 현재 카테고리로 다시 로드
      await loadActivities(selectedCategory);
    } catch (err: any) {
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to remove activity:", err);
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    }
  };

  const handleLocationClick = (locationName: string, cityName: string) => {
    const searchQuery = encodeURIComponent(`${locationName} ${cityName}`);
    const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
    window.open(googleMapsUrl, "_blank");
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

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      맛집: "🍽️",
      명소: "🏛️",
      카페: "☕",
      자연: "🌳",
      체험: "🎨",
    };
    return iconMap[category] || "📍";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>저장된 활동</h1>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>저장된 활동을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>저장된 활동</h1>
        </div>
        <div className={styles.error}>
          <h2>😔 오류가 발생했습니다</h2>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => loadActivities(selectedCategory)}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>저장된 활동</h1>
        <p className={styles.subtitle}>
          내가 저장한 여행 활동들을 확인하고 관리해보세요
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category.value}
              className={`${styles.categoryTab} ${
                selectedCategory === category.value ? styles.active : ""
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stats}>
        <span className={styles.count}>
          총 {activities.length}개의 활동이 저장되어 있습니다
        </span>
      </div>

      {activities.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>저장된 활동이 없습니다</h3>
          <p>
            {selectedCategory === "all"
              ? "아직 저장된 활동이 없어요. 오늘 할만한 활동을 추천받고 저장해보세요!"
              : `${categories.find((c) => c.value === selectedCategory)?.label} 카테고리에 저장된 활동이 없어요.`}
          </p>
        </div>
      ) : (
        <div className={styles.activitiesList}>
          {activities.map((savedActivity) => (
            <div key={savedActivity.id} className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <div className={styles.activityInfo}>
                  <span className={styles.categoryIcon}>
                    {getCategoryIcon(savedActivity.category)}
                  </span>
                  <h3 className={styles.activityName}>
                    {savedActivity.locationName}
                  </h3>
                </div>
                <span className={styles.categoryBadge}>
                  {savedActivity.category}
                </span>
              </div>

              {savedActivity.savedLocation && (
                <div className={styles.savedLocationInfo}>
                  📍 {savedActivity.savedLocation}
                </div>
              )}

              <div className={styles.savedDate}>
                💾 {formatDate(savedActivity.createdAt)}
              </div>

              <div className={styles.activityActions}>
                <button
                  className={styles.mapButton}
                  onClick={() =>
                    handleLocationClick(
                      savedActivity.locationName,
                      savedActivity.savedLocation || ""
                    )
                  }
                >
                  🗺️ 지도보기
                </button>
                <button
                  className={styles.removeButton}
                  onClick={() =>
                    handleRemoveActivity(savedActivity.id.toString())
                  }
                  disabled={removingIds.has(savedActivity.id.toString())}
                >
                  {removingIds.has(savedActivity.id.toString())
                    ? "삭제 중..."
                    : "🗑️ 삭제"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
