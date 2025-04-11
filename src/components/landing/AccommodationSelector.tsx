// src/components/booking/AccommodationSelector.tsx
import { useState, useEffect } from "react";
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
}

export default function AccommodationSelector({
  city,
  startDate,
  endDate,
  onSelect,
}: AccommodationSelectorProps) {
  const { searchHotelsDestination, searchHotels, loading } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(startDate);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<SelectedHotelByDate[]>(
    []
  );
  const [destId, setDestId] = useState("");
  const [searchingDestId, setSearchingDestId] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 날짜 범위 계산
  const dateRange = Array.from(
    { length: differenceInDays(new Date(endDate), new Date(startDate)) + 1 },
    (_, i) => format(addDays(new Date(startDate), i), "yyyy-MM-dd")
  );

  // 다음 날짜로 이동
  const goToNextDate = () => {
    const currentIndex = dateRange.indexOf(currentDate);
    if (currentIndex < dateRange.length - 1) {
      setCurrentDate(dateRange[currentIndex + 1]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 이전 날짜로 이동
  const goToPrevDate = () => {
    const currentIndex = dateRange.indexOf(currentDate);
    if (currentIndex > 0) {
      setCurrentDate(dateRange[currentIndex - 1]);
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 호텔 선택 핸들러
  const selectHotel = (hotel: Hotel) => {
    setSelectedHotels((prev) => [
      ...prev,
      {
        date: currentDate,
        accommodation: hotel.name,
      },
    ]);

    // 마지막 날짜가 아니면 자동으로 다음 날짜로 이동
    if (currentDate !== dateRange[dateRange.length - 1]) {
      goToNextDate();
    } else {
      // 모든 날짜에 대한 호텔 선택이 완료되면 부모 컴포넌트에 전달
      onSelect(selectedHotels);
    }
  };

  // 목적지 ID 조회
  useEffect(() => {
    const fetchDestId = async () => {
      if (!city) return;

      setSearchingDestId(true);
      try {
        const id = await searchHotelsDestination({ city });
        setDestId(id);
      } catch (error) {
        console.error("목적지 ID 조회 실패:", error);
      } finally {
        setSearchingDestId(false);
      }
    };

    fetchDestId();
  }, [city, searchHotelsDestination]);

  // 호텔 검색
  useEffect(() => {
    const fetchHotels = async () => {
      if (!destId || !currentDate) return;

      try {
        // 체크인 날짜는 현재 선택된 날짜
        // 체크아웃 날짜는 다음 날짜 (1박 2일 기준)
        const nextDay = format(addDays(new Date(currentDate), 1), "yyyy-MM-dd");

        const results = await searchHotels({
          destId,
          checkInDate: currentDate,
          checkOutDate: nextDay,
          adults: 2,
        });

        setHotels(results);
      } catch (error) {
        console.error("호텔 검색 실패:", error);
      }
    };

    if (destId && !searchingDestId) {
      fetchHotels();
    }
  }, [destId, currentDate, searchHotels, searchingDestId]);

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
                  (selectedHotel) => selectedHotel.accommodation === hotel.name
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

      {/* 완료 버튼 */}
      <div className={styles.actionButtons}>
        <button
          type="button"
          className={styles.completeButton}
          disabled={Object.keys(selectedHotels).length !== dateRange.length}
          onClick={() => onSelect(selectedHotels)}
        >
          숙소 선택 완료 ({Object.keys(selectedHotels).length}/
          {dateRange.length})
        </button>
      </div>
    </div>
  );
}
