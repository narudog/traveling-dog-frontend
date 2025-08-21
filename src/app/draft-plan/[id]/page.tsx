"use client";

import PolylineMap from "@/components/map/PolylineMap";
import { usePlanStore } from "@/store/plan";
import { format } from "date-fns";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { Itinerary, Location, TravelPlan } from "@/types/plan";
import { useAuthStore } from "@/store/auth";
import Carousel from "@/components/carousel/Carousel";
import { PlaceWithRating } from "@/types/plan";
import { useItineraryStore, ItineraryActivityDTO } from "@/store/itinerary";
import DraggableActivity from "@/components/travelPlan/DraggableActivity";
import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { useDraftPlanStore } from "@/store/draftPlan";

// 평점 정보를 포함한 액티비티 타입
interface ActivityWithRating extends Location {
  rating?: number;
  totalRatings?: number;
  photos?: any;
  reviews?: any;
}

// 타입 변환 유틸리티 함수들
const locationToItineraryActivity = (
  location: Location,
  itineraryId: number
): ItineraryActivityDTO => ({
  id: location.id,
  itineraryId,
  title: location.title,
  description: location.description,
  locationName: location.locationName,
  position: location.orderIndex,
});

const itineraryActivityToLocation = (
  activity: ItineraryActivityDTO
): Location => ({
  id: activity.id,
  title: activity.title,
  description: activity.description || "",
  locationName: activity.locationName || "",
  cost: undefined, // ItineraryActivityDTO에는 cost가 없음
  orderIndex: activity.position,
});

const TravelPlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveDraftPlan, isLoading } = usePlanStore();
  const {
    draftPlan,
    getDraftPlan,
    isLoading: isDraftPlanLoading,
  } = useDraftPlanStore();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary>();
  const { isAuthenticated } = useAuthStore();
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [activitiesWithRatings, setActivitiesWithRatings] = useState<
    Record<number, ActivityWithRating>
  >({});
  const [liked, setLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [isAnyDragging, setIsAnyDragging] = useState<boolean>(false); // 전역 드래그 상태

  useEffect(() => {
    const fetchDraftPlan = async () => {
      await getDraftPlan(id);
    };

    if (draftPlan) return;
    fetchDraftPlan();
  }, [id, getDraftPlan]);

  // Itinerary store 훅
  const {
    setOptimisticActivities,
    getOptimisticActivities,
    moveToPositionOptimistic,
  } = useItineraryStore();

  // DnD 센서 설정 (Carousel과의 충돌 방지)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 활성화
      },
    })
  );

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth < 768 ? 1 : 3);
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClickItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const onSave = useCallback(async () => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        "로그인이 필요한 기능입니다.\n로그인 페이지로 이동하시겠습니까?"
      );

      if (confirmLogin) {
        // 현재 페이지 정보를 저장하고 자동 저장 플래그 추가
        const callbackUrl = `/draft-plan/${id}?autoSave=true`;
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      return;
    }

    try {
      const tripPlan = await saveDraftPlan({
        title: draftPlan?.title || "",
        startDate: draftPlan?.startDate || "",
        endDate: draftPlan?.endDate || "",
        draftTripPlanId: Number(draftPlan?.id),
      });
      router.push(`/travel-plan/${tripPlan.id}`);
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [isAuthenticated, id, router, saveDraftPlan, draftPlan]);

  // 장소 클릭 처리 함수
  const handlePlaceClick = (activity: Location) => {
    if (!draftPlan) return;

    // 구글 맵에서 장소 검색 (locationName + city 조합)
    const searchQuery = `${activity.locationName}, ${draftPlan.city}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
  };

  // 드래그 시작 핸들러
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsAnyDragging(true);
  }, []);

  // 드래그 앤 드롭으로 액티비티 순서 변경
  const handleDragEnd = useCallback(
    async (event: DragEndEvent, itineraryId: number) => {
      setIsAnyDragging(false); // 드래그 종료

      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const optimisticActivities = getOptimisticActivities(itineraryId);
      if (!optimisticActivities) return;

      const oldIndex = optimisticActivities.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = optimisticActivities.findIndex(
        (item) => item.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // 낙관적 업데이트: 배열 순서 변경
        const newActivities = arrayMove(
          optimisticActivities,
          oldIndex,
          newIndex
        );

        // position 업데이트
        const updatedActivities = newActivities.map((activity, index) => ({
          ...activity,
          position: index,
        }));

        setOptimisticActivities(itineraryId, updatedActivities);

        try {
          // 서버에 실제 변경 요청
          await moveToPositionOptimistic(
            itineraryId,
            Number(active.id),
            newIndex
          );
        } catch (error) {
          console.error("Failed to move activity:", error);
          // 에러 발생 시 원래 상태로 복원 (moveToPositionOptimistic에서 처리됨)
        }
      }
    },
    [getOptimisticActivities, setOptimisticActivities, moveToPositionOptimistic]
  );

  // LocationProcessor에서 장소 상세 정보 수신 처리
  const handlePlaceDetailsChange = (places: PlaceWithRating[]) => {
    const newRatings: Record<number, ActivityWithRating> = {};

    places.forEach((place) => {
      if (place.id) {
        newRatings[place.id] = {
          ...(activitiesWithRatings[place.id] || {}),
          id: place.id,
          rating: place.rating,
          totalRatings: place.totalRatings,
          title: activitiesWithRatings[place.id]?.title || "",
          photos: place.photos,
          reviews: place.reviews,
          description: activitiesWithRatings[place.id]?.description || "",
        };
      }
    });

    setActivitiesWithRatings((prev) => ({ ...prev, ...newRatings }));
  };

  useEffect(() => {
    if (draftPlan) {
      setSelectedItinerary(draftPlan.itineraries[0]);

      // 낙관적 업데이트를 위해 각 itinerary의 activities를 스토어에 설정
      draftPlan.itineraries.forEach((itinerary) => {
        const sortedActivities = [...itinerary.activities]
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((activity) =>
            locationToItineraryActivity(activity, itinerary.id)
          );
        setOptimisticActivities(itinerary.id, sortedActivities);
      });
    }
  }, [draftPlan, setOptimisticActivities]);

  // 로그인 후 돌아왔을 때 자동 저장 처리
  useEffect(() => {
    const autoSave = searchParams.get("autoSave");

    if (autoSave === "true" && isAuthenticated && draftPlan) {
      // URL에서 autoSave 파라미터 제거
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      // 자동 저장 실행
      onSave();
    }
  }, [isAuthenticated, draftPlan, searchParams, onSave]);

  if (!draftPlan || isDraftPlanLoading) {
    return <TravelPlanDetailSkeleton />;
  }

  return (
    <div className={styles.planDetail}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{draftPlan.title}</h1>
          <span className={styles.location}>
            {draftPlan.country} - {draftPlan.city}
          </span>
          <span className={styles.date}>
            {format(new Date(draftPlan.startDate), "yyyy.MM.dd")} ~{" "}
            {format(new Date(draftPlan.endDate), "yyyy.MM.dd")}
          </span>
        </div>
      </header>

      <section className={styles.locations}>
        <div className={styles.draftPlanHeader}>
          <h2 className={styles.sectionTitle}>여행 일정</h2>
          <button
            type="button"
            className={`${styles.draftPlanButton} ${isLoading ? styles.loading : ""}`}
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                저장중...
              </>
            ) : (
              "저장하기"
            )}
          </button>
        </div>

        <Carousel
          slidesToShow={slidesToShow}
          autoplay={false}
          showDots={true}
          showArrows={true}
          disableDrag={isAnyDragging}
        >
          {draftPlan.itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className={`${styles.itineraryCard} ${selectedItinerary?.id === itinerary.id ? styles.itineraryCardActive : ""}`}
              onClick={() => onClickItinerary(itinerary)}
            >
              <div className={styles.itineraryHeader}>
                <div className={styles.dayBadge}>DAY {itinerary.date}</div>
                <h3 className={styles.itineraryLocation}>
                  {itinerary.location}
                </h3>
                <span className={styles.activityCount}>
                  {itinerary.activities.length}개 장소
                </span>
              </div>

              <div className={styles.activitiesList}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={(event) => handleDragEnd(event, itinerary.id)}
                >
                  <SortableContext
                    items={(
                      getOptimisticActivities(itinerary.id) ||
                      itinerary.activities.map((activity) =>
                        locationToItineraryActivity(activity, itinerary.id)
                      )
                    ).map((activity) => activity.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(
                      getOptimisticActivities(itinerary.id) ||
                      itinerary.activities.map((activity) =>
                        locationToItineraryActivity(activity, itinerary.id)
                      )
                    ).map((activity, index) => (
                      <DraggableActivity
                        key={activity.id}
                        activity={itineraryActivityToLocation(activity)}
                        index={index}
                        onPlaceClick={handlePlaceClick}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default TravelPlanDetailPage;

const TravelPlanDetailSkeleton = () => {
  return (
    <div className={styles.planDetail}>
      <header className={`${styles.header} ${styles.skeleton}`}>
        <div className={styles.titleArea}>
          <div className={`${styles.title} ${styles.title}`}></div>
          <div className={`${styles.location} ${styles.text}`}></div>
          <div className={`${styles.date} ${styles.text}`}></div>
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>조회수</span>
              <span className={`${styles.statsValue} ${styles.text}`}></span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>좋아요</span>
              <span className={`${styles.statsValue} ${styles.text}`}></span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>작성자</span>
              <span className={`${styles.statsValue} ${styles.text}`}></span>
            </div>
          </div>
        </div>
      </header>

      <section className={`${styles.locations} ${styles.skeleton}`}>
        <div className={`${styles.sectionTitle} ${styles.skeletonTitle}`}></div>
        <div className={styles.carouselSkeleton}>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`${styles.itineraryCard} ${styles.skeletonItineraryCard}`}
            >
              <div className={styles.itineraryHeader}>
                <div
                  className={`${styles.dayBadge} ${styles.skeletonDayBadge}`}
                ></div>
                <div
                  className={`${styles.itineraryLocation} ${styles.skeletonItineraryLocation}`}
                ></div>
                <div
                  className={`${styles.activityCount} ${styles.skeletonActivityCount}`}
                ></div>
              </div>

              <div className={styles.activitiesList}>
                {[...Array(3)].map((_, actIndex) => (
                  <div
                    key={actIndex}
                    className={`${styles.activityCard} ${styles.skeletonActivityCard}`}
                  >
                    <div
                      className={`${styles.activityNumber} ${styles.skeletonActivityNumber}`}
                    ></div>
                    <div className={styles.activityContent}>
                      <div
                        className={`${styles.activityTitle} ${styles.skeletonActivityTitle}`}
                      ></div>
                      <div
                        className={`${styles.activityLocation} ${styles.skeletonActivityLocation}`}
                      ></div>
                      <div
                        className={`${styles.activityDescription} ${styles.skeletonActivityDescription}`}
                      ></div>
                      <div
                        className={`${styles.activityCost} ${styles.skeletonActivityCost}`}
                      ></div>
                    </div>
                    <div
                      className={`${styles.clickIndicator} ${styles.skeletonClickIndicator}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={`${styles.map} ${styles.map}`}></section>
    </div>
  );
};
