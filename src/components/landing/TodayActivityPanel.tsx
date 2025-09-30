"use client";

import { useState } from "react";
import styles from "./TodayActivityPanel.module.scss";
import { useTodayActivityStore } from "@/store/todayActivity";

export default function TodayActivityPanel() {
  const { recommend, isLoading, save, result, taskStatus } =
    useTodayActivityStore();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await recommend({ location, category });
    } catch (err: any) {
      setError(err?.message || "추천 실패");
    }
  };

  const handleLocationClick = (locationName: string, cityName: string) => {
    const searchQuery = encodeURIComponent(`${locationName} ${cityName}`);
    // 검색할 위치 정보 구성 (장소명 + 검색 위치)

    // 기본: 구글 일반 검색으로 열기
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchUrl, "_blank");
  };

  const handleSaveActivity = async (activity: any) => {
    const activityKey = activity.locationName;
    setSavingStates((prev) => ({ ...prev, [activityKey]: true }));

    try {
      // activityId로 locationName을 사용 (백엔드 API 설계에 따라 조정 필요)
      await save({
        locationName: activity.locationName,
        category: activity.category,
        savedLocation: result?.location,
      });
      // 저장 성공 표시 (옵션)
      alert("활동이 저장되었습니다!");
    } catch (error) {
      console.error("활동 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSavingStates((prev) => ({ ...prev, [activityKey]: false }));
    }
  };

  const isBusy = isLoading || taskStatus?.status === "PROCESSING";

  return (
    <div>
      <form
        className={`${isBusy ? styles.disabled : ""}`}
        onSubmit={onSubmit}
        data-testid="today-activity-form"
        aria-disabled={isBusy}
      >
        <fieldset className={styles.form} disabled={isBusy} aria-busy={isBusy}>
          <div className={styles.row}>
            <input
              className={styles.input}
              placeholder="도시(예: 서울, 부산, 제주)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <select
              className={styles.select}
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || undefined)}
            >
              <option value="">카테고리(선택)</option>
              <option value="맛집">맛집</option>
              <option value="명소">명소</option>
              <option value="카페">카페</option>
              <option value="자연">자연</option>
              <option value="체험">체험</option>
            </select>
          </div>
          <button className={styles.submit}>
            {isLoading ? "추천 중..." : "추천 받기"}
          </button>
        </fieldset>
      </form>

      {error && <div className={styles.state}>오류: {error}</div>}
      {result && (
        <div className={styles.resultCard}>
          <h3 className={styles.resultTitle}>{result.location}</h3>
          {result.activities.map((activity) => (
            <div key={activity.locationName} className={styles.activityItem}>
              <h4>{activity.locationName}</h4>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.mapButton}
                  onClick={() =>
                    handleLocationClick(
                      activity.locationName,
                      result.location || ""
                    )
                  }
                >
                  🗺️ 검색하기
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => handleSaveActivity(activity)}
                  disabled={savingStates[activity.locationName]}
                >
                  {savingStates[activity.locationName]
                    ? "저장중..."
                    : "💾 저장"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
