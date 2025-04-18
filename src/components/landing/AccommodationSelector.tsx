// src/components/booking/AccommodationSelector.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useBookingStore } from "@/store/booking";
import { Hotel } from "@/types/booking";
import { format, addDays, differenceInDays } from "date-fns";
import styles from "./AccommodationSelector.module.scss";
import { SelectedHotelByDate } from "@/types/plan";

interface AccommodationSelectorProps {
  city: string;
  startDate: string;
  endDate: string;
  onSelect: (selectedHotels: SelectedHotelByDate[]) => void;
  hotels: Hotel[];
  destId: string;
  dateRange: string[];
}

export default function AccommodationSelector({
  startDate,
  onSelect,
  hotels,
  dateRange,
}: AccommodationSelectorProps) {
  const { loading } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(startDate);
  const [selectedHotels, setSelectedHotels] = useState<SelectedHotelByDate[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState(0);
  const selectedHotelsRef = useRef<SelectedHotelByDate[]>([]);

  // 선택된 호텔 정보가 변경될 때마다 ref 업데이트
  useEffect(() => {
    selectedHotelsRef.current = selectedHotels;
  }, [selectedHotels]);

  // 다음 날짜로 이동
  const goToNextDate = useCallback(() => {
    const currentIndex = dateRange.indexOf(currentDate);
    if (currentIndex < dateRange.length - 1) {
      setCurrentDate(dateRange[currentIndex + 1]);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentDate, dateRange]);

  // 이전 날짜로 이동
  const goToPrevDate = useCallback(() => {
    const currentIndex = dateRange.indexOf(currentDate);
    if (currentIndex > 0) {
      setCurrentDate(dateRange[currentIndex - 1]);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentDate, dateRange]);

  // 호텔 선택 핸들러
  const selectHotel = useCallback(
    (hotel: Hotel) => {
      setSelectedHotels((prev) => {
        // 이미 같은 날짜에 다른 호텔이 선택되어 있다면 해당 항목 제거
        const filtered = prev.filter((item) => item.date !== currentDate);
        // 새로운 호텔 선택 추가
        return [
          ...filtered,
          {
            date: currentDate,
            accommodation: hotel.name,
          },
        ];
      });

      // 마지막 날짜가 아니면, 자동으로 다음 날짜로 이동
      if (currentDate !== dateRange[dateRange.length - 1]) {
        goToNextDate();
      }
    },
    [currentDate, dateRange, goToNextDate]
  );

  // 선택된 호텔이 변경될 때마다 부모에게 알림
  useEffect(() => {
    // 최초 마운트시에는 호출하지 않음
    if (selectedHotels.length > 0) {
      onSelect(selectedHotels);
    }
  }, [selectedHotels, onSelect]);

  // 선택된 호텔 수 계산
  const selectedDatesCount = selectedHotels.length;
  const allDatesSelected = selectedDatesCount === dateRange.length;

  // 진행 상태 표시
  const progress = ((currentStep + 1) / dateRange.length) * 100;

  return (
    <div className={styles.accommodationSelector}>
      <h2 className={styles.title}>숙소 선택하기</h2>

      {/* 진행 상태 바 */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={styles.progressText}>
          {currentStep + 1} / {dateRange.length} 일차
        </div>
      </div>

      {/* 현재 날짜 표시 */}
      <div className={styles.dateNavigation}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToPrevDate}
          disabled={currentDate === dateRange[0] || loading}
        >
          이전 날짜
        </button>
        <div className={styles.currentDate}>
          <span className={styles.dateLabel}>숙박일:</span>
          <span className={styles.date}>
            {format(new Date(currentDate), "yyyy년 MM월 dd일")}
          </span>
        </div>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToNextDate}
          disabled={currentDate === dateRange[dateRange.length - 1] || loading}
        >
          다음 날짜
        </button>
      </div>

      {/* 호텔 목록 */}
      <div className={styles.hotelsList}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>호텔을 검색 중입니다...</p>
          </div>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel.id}
              className={`${styles.hotelCard} ${
                selectedHotels.find(
                  (selectedHotel) =>
                    selectedHotel.date === currentDate &&
                    selectedHotel.accommodation === hotel.name
                )
                  ? styles.selected
                  : ""
              }`}
              onClick={() => selectHotel(hotel)}
            >
              <div className={styles.hotelImage}>
                <img src={hotel.photoUrls[0]} alt={hotel.name} />
              </div>
              <div className={styles.hotelInfo}>
                <h3 className={styles.hotelName}>{hotel.name}</h3>
                <div className={styles.ratingContainer}>
                  <span className={styles.rating}>
                    {hotel.reviewScore.toFixed(1)}
                  </span>
                  <span className={styles.reviewCount}>
                    ({hotel.reviewCount}개 리뷰)
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>이 날짜에 이용 가능한 호텔이 없습니다.</p>
            <p>다른 날짜를 선택하거나 나중에 다시 시도해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
