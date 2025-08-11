"use client";

import { useState } from "react";
import styles from "./TodayActivityPanel.module.scss";
import { useTodayActivityStore } from "@/store/todayActivity";
import type { TodayActivityResponseDTO } from "@/types/todayActivity";

export default function TodayActivityPanel() {
  const { recommend, loading, save } = useTodayActivityStore();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<TodayActivityResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await recommend({ location, category });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "추천 실패");
    }
  };

  const handleLocationClick = (locationName: string, cityName: string) => {
    const searchQuery = encodeURIComponent(`${locationName} ${cityName}`);
    const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
    window.open(googleMapsUrl, "_blank");
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

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
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
        <button className={styles.submit} disabled={loading}>
          {loading ? "추천 중..." : "추천 받기"}
        </button>
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
                  🗺️ 지도보기
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
