"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./SearchSection.module.scss";
import { useForm } from "react-hook-form";
import { usePlanStore } from "@/store/plan";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import AccommodationSelector from "./AccommodationSelector";
import { Hotel } from "@/types/booking";
import { SelectedHotelByDate } from "@/types/plan";
import { useBookingStore } from "@/store/booking";
import { differenceInDays, format, addDays } from "date-fns";
import { useDraftPlanStore } from "@/store/draftPlan";

type SearchFormInputs = {
  city: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  interests: string;
};

// 선택된 호텔 인터페이스 정의

// 태그 옵션 데이터
const travelStyleOptions = [
  { value: "힐링", label: "힐링" },
  { value: "맛집 탐방", label: "맛집 탐방" },
  { value: "명소 방문", label: "명소 방문" },
  { value: "지역 축제", label: "지역 축제" },
  { value: "모험", label: "모험/액티비티" },
];

const interestsOptions = [
  { value: "문화", label: "문화/역사" },
  { value: "쇼핑", label: "쇼핑" },
  { value: "카페 방문", label: "카페/술집" },
  { value: "자연", label: "자연/야외활동" },
  { value: "예술", label: "예술/박물관" },
];

export default function SearchSection() {
  const { createDraftPlan, taskStatus } = useDraftPlanStore();
  const { searchHotelsDestination, searchHotels } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const router = useRouter();

  // 숙소 선택 관련 상태
  const [selectedHotels, setSelectedHotels] = useState<SelectedHotelByDate[]>(
    []
  );
  const [showAccommodationSelector, setShowAccommodationSelector] =
    useState(false);
  const [destId, setDestId] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [dateRange, setDateRange] = useState<string[]>([]);

  // 선택된 태그 상태 관리 (다중 선택을 위해 배열로 변경)
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(
    []
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
    trigger,
  } = useForm<SearchFormInputs>({
    mode: "onChange",
    defaultValues: {
      city: "",
      startDate: "",
      endDate: "",
      travelStyle: "",
      interests: "",
    },
  });

  // 시작일 값 감시
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const city = watch("city");

  // 태그 선택 핸들러 (다중 선택 지원)
  const handleTagSelect = (field: keyof SearchFormInputs, value: string) => {
    switch (field) {
      case "travelStyle":
        setSelectedTravelStyles((prev) => {
          let newValues;
          if (prev.includes(value)) {
            // 이미 선택된 값이면 제거
            newValues = prev.filter((item) => item !== value);
          } else {
            // 새로운 값이면 추가
            newValues = [...prev, value];
          }
          setValue(field, newValues.join(", "));
          if (newValues.length > 0) {
            clearErrors(field);
          }
          return newValues;
        });
        trigger(field);
        break;
      case "interests":
        setSelectedInterests((prev) => {
          let newValues;
          if (prev.includes(value)) {
            newValues = prev.filter((item) => item !== value);
          } else {
            newValues = [...prev, value];
          }
          setValue(field, newValues.join(", "));
          if (newValues.length > 0) {
            clearErrors(field);
          }
          return newValues;
        });
        trigger(field);
        break;
    }
  };

  // 단계별 진행
  const nextStep = async () => {
    // 현재 단계의 필드들 유효성 검사
    const isStepValid = await validateCurrentStep();

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 현재 단계의 필드 유효성 검사
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await trigger(["city", "startDate", "endDate"]);
      case 2:
        return await trigger(["travelStyle", "interests"]);
      default:
        return true;
    }
  };

  // 시작일이 변경될 때 종료일 검증
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;

    // 종료일이 새 시작일보다 이전이면 종료일 리셋
    const currentEndDate = watch("endDate");
    if (currentEndDate && currentEndDate < newStartDate) {
      setValue("endDate", "");
    }
  };

  // 호텔 선택 처리 함수
  const handleHotelSelection = useCallback((hotels: SelectedHotelByDate[]) => {
    setSelectedHotels(hotels);
    console.log("선택된 호텔:", hotels);
  }, []);

  // 목적지 ID 및 호텔 검색
  useEffect(() => {
    let isMounted = true;

    const searchDestinationAndHotels = async () => {
      if (!city || !startDate || !endDate) return;

      // 날짜가 변경되면 선택된 호텔 초기화
      setSelectedHotels([]);
      setIsSearchingHotels(true);

      try {
        // 1. 먼저 목적지 ID 검색
        const destinationId = await searchHotelsDestination({ city });
        if (!isMounted) return;

        setDestId(destinationId);

        if (!destinationId) {
          return;
        }

        // 2. 전체 기간에 대한 호텔 정보 한 번에 검색
        const results = await searchHotels({
          destId: destinationId,
          checkInDate: startDate,
          checkOutDate: endDate,
          adults: 2,
        });

        if (!isMounted) return;

        // 날짜 범위 계산
        const dates = Array.from(
          {
            length:
              differenceInDays(new Date(endDate), new Date(startDate)) + 1,
          },
          (_, i) => format(addDays(new Date(startDate), i), "yyyy-MM-dd")
        );

        setDateRange(dates);
        setHotels(results);
      } catch (error) {
        console.error("호텔 검색 실패:", error);
      } finally {
        if (isMounted) {
          setIsSearchingHotels(false);
        }
      }
    };

    searchDestinationAndHotels();

    return () => {
      isMounted = false;
    };
  }, [city, startDate, endDate, searchHotelsDestination, searchHotels]);

  // 숙소 선택기 토글 시 리셋
  useEffect(() => {
    if (!showAccommodationSelector) {
      // 선택 창이 닫힐 때는 기존 선택 유지
      return;
    }

    // 처음 열릴 때 숙소 선택 창 초기화
    if (hotels.length === 0) {
      // 호텔 데이터가 없으면 초기화
      setSelectedHotels([]);
    }
  }, [showAccommodationSelector, hotels]);

  // 실제 일정 생성 함수
  const executePlanCreation = async (data: SearchFormInputs) => {
    console.log("일정 만들기:", data);

    // 선택된 호텔 정보도 함께 기록
    if (Object.keys(selectedHotels).length > 0) {
      console.log("선택된 숙소 정보:", selectedHotels);
    }

    try {
      setIsLoading(true);
      const status = await createDraftPlan({
        city: data.city,
        startDate: data.startDate,
        endDate: data.endDate,
        travelStyle: data.travelStyle,
        interests: data.interests,
        userSpecifiedAccommodations: selectedHotels,
      });
      // 폴링 전환 이후에는 즉시 이동하지 않고, 상단 배지에서 진행 현황을 표시합니다.
    } catch (error) {
      console.error("일정 만들기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SearchFormInputs) => {
    const isStepValid = await validateCurrentStep();
    if (!isStepValid) {
      return;
    }

    // 인증된 사용자인 경우 바로 일정 생성
    await executePlanCreation(data);
  };

  return (
    <div className={styles.searchSection}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.searchBox}
        data-testid="search-box"
      >
        {/* 진행 표시기 */}
        <div className={styles.stepsIndicator}>
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`${styles.step} ${currentStep > index + 1 ? styles.completed : currentStep === index + 1 ? styles.active : ""}`}
            >
              {currentStep <= index + 1 && index + 1}
            </div>
          ))}
        </div>

        {/* 단계 1: 목적지 */}
        <div
          className={`${styles.formStep} ${currentStep === 1 ? styles.active : ""}`}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="city">여행 목적지</label>
            <input
              id="city"
              type="text"
              placeholder="여행 도시(예: 서울, 파리)"
              className={`${styles.textInput} ${errors.city ? styles.inputError : ""}`}
              {...register("city", { required: true })}
            />
            <div className={styles.inputHint}>
              떠나고 싶은 도시를 입력하세요
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="startDate">여행 시작일</label>
            <input
              id="startDate"
              type="date"
              className={`${styles.dateInput} ${errors.startDate ? styles.inputError : ""}`}
              min={new Date().toISOString().split("T")[0]}
              {...register("startDate", {
                required: true,
                onChange: handleStartDateChange,
              })}
              onFocus={(e) => {
                e.target.showPicker && e.target.showPicker();
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="endDate">여행 종료일</label>
            <input
              id="endDate"
              type="date"
              className={`${styles.dateInput} ${errors.endDate ? styles.inputError : ""}`}
              min={startDate || new Date().toISOString().split("T")[0]}
              max={
                startDate
                  ? new Date(
                      new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              disabled={!startDate}
              {...register("endDate", { required: true })}
              onFocus={(e) => {
                e.target.showPicker && e.target.showPicker();
              }}
            />
            <div className={styles.inputHint}>
              최대 7일까지 일정을 만들 수 있어요
            </div>
          </div>
        </div>

        {/* 단계 2: 여행 스타일 */}
        <div
          className={`${styles.formStep} ${currentStep === 2 ? styles.active : ""}`}
        >
          <div className={styles.inputGroup}>
            <RenderTagGroup
              options={travelStyleOptions}
              field="travelStyle"
              selectedValues={selectedTravelStyles}
              errorState={!!errors.travelStyle}
              handleTagSelect={handleTagSelect}
            />
            {errors.travelStyle && (
              <div className={styles.errorMessage}>
                {errors.travelStyle.message}
              </div>
            )}
            <div className={styles.inputHint}>
              원하는 여행 스타일을 모두 선택해주세요
            </div>
          </div>

          <div className={styles.inputGroup}>
            <RenderTagGroup
              options={interestsOptions}
              field="interests"
              selectedValues={selectedInterests}
              errorState={!!errors.interests}
              handleTagSelect={handleTagSelect}
            />
            {errors.interests && (
              <div className={styles.errorMessage}>
                {errors.interests.message}
              </div>
            )}
            <div className={styles.inputHint}>
              관심 있는 활동을 모두 선택해주세요
            </div>
          </div>
        </div>

        {/* 단계 3: 선호사항 */}
        {/* <div
          className={`${styles.formStep} ${currentStep === 3 ? styles.active : ""}`}
        > */}
        {/* 숙소 선택 섹션 */}
        {/* <div className={styles.accommodationSelectorContainer}>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() =>
                setShowAccommodationSelector(!showAccommodationSelector)
              }
              disabled={
                isSearchingHotels ||
                !city ||
                !startDate ||
                !endDate ||
                hotels.length === 0
              }
            >
              {isSearchingHotels
                ? "호텔 정보 로딩 중..."
                : showAccommodationSelector
                  ? "숙소 선택 닫기"
                  : "날짜별 숙소 선택하기"}
            </button>

            {showAccommodationSelector && city && startDate && endDate && (
              <AccommodationSelector
                city={city}
                startDate={startDate}
                endDate={endDate}
                onSelect={handleHotelSelection}
                hotels={hotels}
                destId={destId}
                dateRange={dateRange}
              />
            )}
          </div>
        </div> */}

        {/* 단계별 버튼 */}
        <div className={styles.buttonContainer}>
          {currentStep > 1 && (
            <button
              type="button"
              className={styles.prevButton}
              onClick={prevStep}
            >
              이전
            </button>
          )}

          {currentStep < totalSteps && (
            <button
              type="button"
              className={styles.nextButton}
              onClick={nextStep}
            >
              다음
            </button>
          )}
          {currentStep === totalSteps && (
            <button
              type="submit"
              className={styles.searchButton}
              disabled={
                !isValid || isLoading || taskStatus?.status === "PROCESSING"
              }
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                "일정 만들기"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// 태그 그룹 렌더링 함수 (다중 선택용으로 수정)
function RenderTagGroup({
  options,
  field,
  selectedValues,
  errorState,
  handleTagSelect,
}: {
  options: { value: string; label: string }[];
  field: keyof SearchFormInputs;
  selectedValues: string[];
  errorState: boolean;
  handleTagSelect: (field: keyof SearchFormInputs, value: string) => void;
}) {
  return (
    <>
      <div
        className={`${styles.tagGroup} ${errorState ? styles.tagGroupError : ""}`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`${styles.tagItem} ${selectedValues.includes(option.value) ? styles.selected : ""}`}
            onClick={() => handleTagSelect(field, option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </>
  );
}
