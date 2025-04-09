"use client";

import { useEffect, useState } from "react";
import styles from "./SearchSection.module.scss";
import { useForm } from "react-hook-form";
import { usePlanStore } from "@/store/plan";
import { useRouter } from "next/navigation";
import AccommodationSelector from "./AccommodationSelector";
import { Hotel } from "@/types/booking";

type SearchFormInputs = {
  city: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  accommodation: string;
  interests: string;
  transportation: string;
};

// 선택된 호텔 인터페이스 정의
interface SelectedHotelsByDate {
  [date: string]: Hotel;
}

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

const accommodationOptions = [
  { value: "호텔", label: "호텔" },
  { value: "모텔", label: "모텔" },
  { value: "펜션", label: "펜션" },
  { value: "게스트하우스", label: "게스트하우스" },
  { value: "에어비앤비", label: "에어비앤비" },
];

const transportationOptions = [
  { value: "비행기", label: "비행기" },
  { value: "기차", label: "기차" },
  { value: "지하철", label: "지하철" },
  { value: "버스", label: "버스" },
  { value: "자동차", label: "자동차" },
  { value: "자전거", label: "자전거" },
  { value: "도보", label: "도보" },
];

export default function SearchSection() {
  const { createPlan } = usePlanStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();

  // 숙소 선택 관련 상태
  const [selectedHotels, setSelectedHotels] = useState<SelectedHotelsByDate>(
    {}
  );
  const [showAccommodationSelector, setShowAccommodationSelector] =
    useState(false);

  // 선택된 태그 상태 관리 (다중 선택을 위해 배열로 변경)
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(
    []
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState<
    string[]
  >([]);
  const [selectedTransportations, setSelectedTransportations] = useState<
    string[]
  >([]);

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
      budget: "",
      travelStyle: "",
      accommodation: "",
      interests: "",
      transportation: "",
    },
  });

  // 시작일 값 감시
  const startDate = watch("startDate");

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
      case "accommodation":
        setSelectedAccommodations((prev) => {
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
      case "transportation":
        setSelectedTransportations((prev) => {
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
        return await trigger(["city", "budget"]);
      case 2:
        return await trigger(["startDate", "endDate"]);
      case 3:
        // 태그 선택 검증
        let isValid = true;
        if (selectedTravelStyles.length === 0) {
          setError("travelStyle", {
            type: "required",
            message: "최소 하나의 여행 스타일을 선택해주세요",
          });
          isValid = false;
        }
        if (selectedInterests.length === 0) {
          setError("interests", {
            type: "required",
            message: "최소 하나의 관심사를 선택해주세요",
          });
          isValid = false;
        }
        return isValid && (await trigger(["travelStyle", "interests"]));
      case 4:
        // 태그 선택 검증
        let isStepValid = true;
        if (selectedAccommodations.length === 0) {
          setError("accommodation", {
            type: "required",
            message: "최소 하나의 숙박 유형을 선택해주세요",
          });
          isStepValid = false;
        }
        if (selectedTransportations.length === 0) {
          setError("transportation", {
            type: "required",
            message: "최소 하나의 교통수단을 선택해주세요",
          });
          isStepValid = false;
        }
        return (
          isStepValid && (await trigger(["accommodation", "transportation"]))
        );
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
  const handleHotelSelection = (hotels: SelectedHotelsByDate) => {
    setSelectedHotels(hotels);
    console.log("선택된 호텔:", hotels);
    // 여기서 선택된 호텔 정보를 필요에 따라 활용할 수 있습니다
  };

  const onSubmit = async (data: SearchFormInputs) => {
    const isStepValid = await validateCurrentStep();
    if (!isStepValid) {
      return;
    }
    const planList = JSON.parse(localStorage.getItem("planList") || "[]");
    console.log("일정 만들기:", data);

    // 선택된 호텔 정보도 함께 기록
    if (Object.keys(selectedHotels).length > 0) {
      console.log("선택된 숙소 정보:", selectedHotels);
    }

    try {
      setIsLoading(true);
      const plan = await createPlan({
        city: data.city,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        travelStyle: data.travelStyle,
        accommodation: data.accommodation,
        interests: data.interests,
        transportation: data.transportation,
      });
      // 여기에 일정 만들기 로직 구현
      planList.push(plan);
      localStorage.setItem("planList", JSON.stringify(planList));
      router.push(`/travel-plan/${plan.id}`);
    } catch (error) {
      console.error("일정 만들기 오류:", error);
    } finally {
      setIsLoading(false);
    }
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
              className={`${styles.step} ${
                currentStep > index + 1
                  ? styles.completed
                  : currentStep === index + 1
                    ? styles.active
                    : ""
              }`}
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
            <input
              id="budget"
              type="text"
              className={`${styles.textInput} ${errors.budget ? styles.inputError : ""}`}
              placeholder="예산(예: 100만원)"
              {...register("budget", { required: true })}
            />
            <div className={styles.inputHint}>
              예산에 맞는 일정을 추천해 드립니다
            </div>
          </div>
        </div>

        {/* 단계 2: 날짜 */}
        <div
          className={`${styles.formStep} ${currentStep === 2 ? styles.active : ""}`}
        >
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

        {/* 단계 3: 예산 및 여행 스타일 */}
        <div
          className={`${styles.formStep} ${currentStep === 3 ? styles.active : ""}`}
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

        {/* 단계 4: 선호사항 */}
        <div
          className={`${styles.formStep} ${currentStep === 4 ? styles.active : ""}`}
        >
          <div className={styles.inputGroup}>
            <RenderTagGroup
              options={accommodationOptions}
              field="accommodation"
              selectedValues={selectedAccommodations}
              errorState={!!errors.accommodation}
              handleTagSelect={handleTagSelect}
            />
            {errors.accommodation && (
              <div className={styles.errorMessage}>
                {errors.accommodation.message}
              </div>
            )}
            <div className={styles.inputHint}>
              원하는 숙박 유형을 모두 선택해주세요
            </div>
          </div>

          <div className={styles.inputGroup}>
            <RenderTagGroup
              options={transportationOptions}
              field="transportation"
              selectedValues={selectedTransportations}
              errorState={!!errors.transportation}
              handleTagSelect={handleTagSelect}
            />
            {errors.transportation && (
              <div className={styles.errorMessage}>
                {errors.transportation.message}
              </div>
            )}
            <div className={styles.inputHint}>
              이용하고 싶은 교통수단을 모두 선택해주세요
            </div>
          </div>

          {/* 숙소 선택 섹션 */}
          <div className={styles.accommodationSelectorContainer}>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() =>
                setShowAccommodationSelector(!showAccommodationSelector)
              }
            >
              {showAccommodationSelector
                ? "숙소 선택 닫기"
                : "날짜별 숙소 선택하기"}
            </button>

            {showAccommodationSelector &&
              watch("startDate") &&
              watch("endDate") && (
                <AccommodationSelector
                  city={watch("city")}
                  startDate={watch("startDate")}
                  endDate={watch("endDate")}
                  onSelect={handleHotelSelection}
                />
              )}
          </div>
        </div>

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
              disabled={!isValid || isLoading}
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
            className={`${styles.tagItem} ${
              selectedValues.includes(option.value) ? styles.selected : ""
            }`}
            onClick={() => handleTagSelect(field, option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </>
  );
}
