"use client";

import PolylineMap from "@/components/map/PolylineMap";
import { usePlanStore } from "@/store/plan";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { Itinerary, Activity, TravelPlan } from "@/types/plan";
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
import { ItineraryActivityCreateRequest } from "@/store/itinerary";

// 평점 정보를 포함한 액티비티 타입
interface ActivityWithRating extends Activity {
  rating?: number;
  totalRatings?: number;
  photos?: any;
  reviews?: any;
}

// 타입 변환 유틸리티 함수들
const locationToItineraryActivity = (
  location: Activity,
  itineraryId: number
): ItineraryActivityDTO => ({
  id: location.id,
  itineraryId,
  title: location.title,
  description: location.description,
  locationName: location.locationName,
  cost: location.cost,
  orderIndex: location.orderIndex,
});

const itineraryActivityToLocation = (
  activity: ItineraryActivityDTO
): Activity => ({
  id: activity.id,
  title: activity.title,
  description: activity.description || "",
  locationName: activity.locationName || "",
  cost: activity.cost,
  orderIndex: activity.orderIndex,
});

const TravelPlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { plan, getPlanDetail, setPlan, likePlan, unlikePlan, getLikeStatus } =
    usePlanStore();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary>();
  const { user } = useAuthStore();
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [activitiesWithRatings, setActivitiesWithRatings] = useState<
    Record<number, ActivityWithRating>
  >({});
  const [liked, setLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [isAnyDragging, setIsAnyDragging] = useState<boolean>(false); // 전역 드래그 상태

  // 액티비티 추가 관련 상태 (각 itinerary별로 독립적)
  const [newActivities, setNewActivities] = useState<{
    [itineraryId: number]: {
      title: string;
      description: string;
      locationName: string;
      cost: string;
    };
  }>({});
  const [submittingItineraries, setSubmittingItineraries] = useState<{
    [itineraryId: number]: boolean;
  }>({});

  // 액티비티 편집 관련 상태
  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null
  );
  const [editingActivity, setEditingActivity] = useState<{
    title: string;
    description: string;
    locationName: string;
    cost: string;
  }>({
    title: "",
    description: "",
    locationName: "",
    cost: "",
  });
  const [isUpdatingActivity, setIsUpdatingActivity] = useState<boolean>(false);

  // 액티비티 삭제 관련 상태
  const [deletingActivityId, setDeletingActivityId] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Itinerary store 훅
  const {
    setOptimisticActivities,
    getOptimisticActivities,
    moveToPositionOptimistic,
    create,
    update,
    remove,
  } = useItineraryStore();

  // 각 itinerary별 activity 상태를 가져오는 헬퍼 함수
  const getActivityForItinerary = (itineraryId: number) => {
    return (
      newActivities[itineraryId] || {
        title: "",
        description: "",
        locationName: "",
        cost: "",
      }
    );
  };

  // 각 itinerary별 activity 상태를 업데이트하는 헬퍼 함수
  const updateActivityForItinerary = (
    itineraryId: number,
    updates: Partial<{
      title: string;
      description: string;
      locationName: string;
      cost: string;
    }>
  ) => {
    setNewActivities((prev) => ({
      ...prev,
      [itineraryId]: {
        ...getActivityForItinerary(itineraryId),
        ...updates,
      },
    }));
  };

  // DnD 센서 설정 (Carousel과의 충돌 방지)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 활성화
      },
    })
  );

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        await getPlanDetail(id);
      } catch (e) {
        const local = JSON.parse(localStorage.getItem("planList") || "[]").find(
          (p: TravelPlan) => p.id === Number(id)
        );
        if (local) setPlan(local);
      }
    };
    if (plan) return;
    fetchPlan();
  }, [id, getPlanDetail, setPlan]);

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

  // 장소 클릭 처리 함수
  const handlePlaceClick = (activity: Activity) => {
    if (!plan) return;

    // 구글 맵에서 장소 검색 (locationName + city 조합)
    const searchQuery = `${activity.locationName}, ${plan.city}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`,
      "_blank"
    );
  };

  // 액티비티 편집 모드 시작
  const handleStartEditActivity = (activity: Activity) => {
    if (!user || !plan || plan.userId !== user.id) return;

    setEditingActivityId(activity.id);
    setEditingActivity({
      title: activity.title,
      description: activity.description,
      locationName: activity.locationName,
      cost: activity.cost || "",
    });
  };

  // 액티비티 삭제 확인 모달 열기
  const handleStartDeleteActivity = (activity: Activity) => {
    if (!user || !plan || plan.userId !== user.id) return;
    setDeletingActivityId(activity.id);
  };

  // 액티비티 삭제 취소
  const handleCancelDeleteActivity = () => {
    setDeletingActivityId(null);
  };

  // 액티비티 삭제 처리
  const handleDeleteActivity = async () => {
    if (!deletingActivityId || !plan) return;

    setIsDeleting(true);
    try {
      await remove(deletingActivityId);

      // Plan state에서 액티비티 제거
      const updatedPlan = { ...plan };
      const targetItinerary = updatedPlan.itineraries.find((itinerary) =>
        itinerary.activities.some(
          (activity) => activity.id === deletingActivityId
        )
      );

      if (targetItinerary) {
        targetItinerary.activities = targetItinerary.activities.filter(
          (activity) => activity.id !== deletingActivityId
        );

        setPlan(updatedPlan);

        // 낙관적 업데이트에서도 제거
        const currentOptimisticActivities =
          getOptimisticActivities(targetItinerary.id) || [];
        const updatedOptimisticActivities = currentOptimisticActivities.filter(
          (activity) => activity.id !== deletingActivityId
        );
        setOptimisticActivities(
          targetItinerary.id,
          updatedOptimisticActivities
        );
      }

      handleCancelDeleteActivity();
    } catch (error) {
      console.error("액티비티 삭제 실패:", error);
      alert("액티비티 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 액티비티 편집 취소
  const handleCancelEditActivity = () => {
    setEditingActivityId(null);
    setEditingActivity({
      title: "",
      description: "",
      locationName: "",
      cost: "",
    });
  };

  // 액티비티 업데이트 처리
  const handleUpdateActivity = async () => {
    if (
      !editingActivityId ||
      !editingActivity.title.trim() ||
      !editingActivity.locationName.trim()
    )
      return;

    setIsUpdatingActivity(true);
    try {
      const updateRequest = {
        title: editingActivity.title.trim(),
        description: editingActivity.description.trim() || undefined,
        locationName: editingActivity.locationName.trim(),
        cost: editingActivity.cost.trim() || undefined,
      };

      const updatedActivity = await update(editingActivityId, updateRequest);

      // Plan state 업데이트
      if (plan) {
        const updatedPlan = { ...plan };
        const targetItinerary = updatedPlan.itineraries.find((itinerary) =>
          itinerary.activities.some(
            (activity) => activity.id === editingActivityId
          )
        );

        if (targetItinerary) {
          const activityIndex = targetItinerary.activities.findIndex(
            (activity) => activity.id === editingActivityId
          );

          if (activityIndex !== -1) {
            targetItinerary.activities[activityIndex] = {
              id: updatedActivity.id,
              title: updatedActivity.title,
              description: updatedActivity.description || "",
              locationName: updatedActivity.locationName || "",
              cost: updatedActivity.cost || "",
              orderIndex: updatedActivity.orderIndex,
            };

            setPlan(updatedPlan);

            // 낙관적 업데이트도 업데이트
            const currentOptimisticActivities =
              getOptimisticActivities(targetItinerary.id) || [];
            const optimisticActivityIndex =
              currentOptimisticActivities.findIndex(
                (activity) => activity.id === editingActivityId
              );

            if (optimisticActivityIndex !== -1) {
              const updatedOptimisticActivities = [
                ...currentOptimisticActivities,
              ];
              updatedOptimisticActivities[optimisticActivityIndex] =
                updatedActivity;
              setOptimisticActivities(
                targetItinerary.id,
                updatedOptimisticActivities
              );
            }
          }
        }
      }

      handleCancelEditActivity();
    } catch (error) {
      console.error("액티비티 업데이트 실패:", error);
      alert("액티비티 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdatingActivity(false);
    }
  };

  // 액티비티 추가 취소
  const handleCancelAddActivity = (itineraryId: number) => {
    setNewActivities((prev) => ({
      ...prev,
      [itineraryId]: {
        title: "",
        description: "",
        locationName: "",
        cost: "",
      },
    }));
  };

  // 액티비티 추가 처리
  const handleAddActivity = async (itineraryId: number) => {
    const activity = getActivityForItinerary(itineraryId);
    if (!activity.title.trim() || !activity.locationName.trim()) return;

    setSubmittingItineraries((prev) => ({ ...prev, [itineraryId]: true }));
    try {
      const createRequest: ItineraryActivityCreateRequest = {
        itineraryId,
        title: activity.title.trim(),
        description: activity.description.trim() || undefined,
        locationName: activity.locationName.trim(),
        cost: activity.cost.trim() || undefined,
      };

      const createdActivity = await create(createRequest);

      // Plan state 업데이트
      if (plan) {
        const updatedPlan = { ...plan };
        const targetItinerary = updatedPlan.itineraries.find(
          (it) => it.id === createdActivity.itineraryId
        );

        if (targetItinerary) {
          const newActivity: Activity = {
            id: createdActivity.id,
            title: createdActivity.title,
            description: createdActivity.description || "",
            locationName: createdActivity.locationName || "",
            cost: createdActivity.cost,
            orderIndex: createdActivity.orderIndex,
          };

          targetItinerary.activities.push(newActivity);
          setPlan(updatedPlan);

          // 낙관적 업데이트도 업데이트
          const currentOptimisticActivities =
            getOptimisticActivities(createdActivity.itineraryId) || [];
          const newOptimisticActivity = locationToItineraryActivity(
            newActivity,
            createdActivity.itineraryId
          );
          setOptimisticActivities(createdActivity.itineraryId, [
            ...currentOptimisticActivities,
            newOptimisticActivity,
          ]);
        }
      }

      handleCancelAddActivity(itineraryId);
    } catch (error) {
      console.error("액티비티 추가 실패:", error);
      alert("액티비티 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmittingItineraries((prev) => ({ ...prev, [itineraryId]: false }));
    }
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
    if (plan) {
      setSelectedItinerary(plan.itineraries[0]);

      // 낙관적 업데이트를 위해 각 itinerary의 activities를 스토어에 설정
      plan.itineraries.forEach((itinerary) => {
        const sortedActivities = [...itinerary.activities]
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((activity) =>
            locationToItineraryActivity(activity, itinerary.id)
          );
        setOptimisticActivities(itinerary.id, sortedActivities);
      });
    }
  }, [plan, setOptimisticActivities]);

  useEffect(() => {
    const fetchLike = async () => {
      if (!user) {
        setLiked(false);
        return;
      }
      try {
        const status = await getLikeStatus(Number(id));
        setLiked(Boolean(status));
      } catch (e) {
        setLiked(false);
      }
    };
    fetchLike();
  }, [user, id]);

  // 모든 itinerary의 위치 정보를 하나의 배열로 변환
  const allItineraryLocations = useMemo(() => {
    if (!plan) return [];

    return plan.itineraries.map((itinerary, index) => {
      // 각 itinerary에 대한 색상 생성 (다른 색상을 사용하기 위해)
      const colors = [
        "#FF3D00", // 심홍색
        "#FF9100", // 주황
        "#00B0FF", // 하늘색
        "#D500F9", // 밝은 보라
        "#304FFE", // 어두운 파랑
        "#FF1744", // 밝은 빨강
        "#7C4DFF", // 진한 보라
        "#FF6D00", // 진한 주황,
        "#F50057", // 분홍
        "#AA00FF", // 보라
      ];
      const color = colors[index % colors.length];

      return {
        locations: itinerary.activities.map((activity) => ({
          name: activity.locationName,
          region: plan.city + ", " + plan.country,
        })),
        color: color,
        dayNumber: index + 1,
        activityIds: itinerary.activities.map((a) => a.id),
      };
    });
  }, [plan]);

  if (!plan) {
    return <TravelPlanDetailSkeleton />;
  }

  // 별점 렌더링 함수
  const renderStars = (rating?: number) => {
    if (!rating) return "평점 없음";

    return <span className={styles.stars}>{` ${rating.toFixed(1)}`} / 5</span>;
  };

  return (
    <div className={styles.planDetail}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{plan.title}</h1>
          <span className={styles.location}>
            {plan.country} - {plan.city}
          </span>
          <span className={styles.date}>
            {format(new Date(plan.startDate), "yyyy.MM.dd")} ~{" "}
            {format(new Date(plan.endDate), "yyyy.MM.dd")}
          </span>
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>조회수</span>
              <span className={styles.statsValue}>{plan.viewCount}</span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>좋아요</span>
              <span className={styles.statsValue}>
                {plan.likeCount + (liked ? 1 : 0)}
              </span>
            </div>
            <div className={styles.divider}>|</div>
            <button
              className={styles.likeButton}
              disabled={likeLoading || !user}
              onClick={async () => {
                if (!user) return;
                setLikeLoading(true);
                try {
                  if (!liked) {
                    const added = await likePlan(Number(id));
                    if (added) setLiked(true);
                  } else {
                    await unlikePlan(Number(id));
                    setLiked(false);
                  }
                } finally {
                  setLikeLoading(false);
                }
              }}
            >
              {liked ? "좋아요 취소" : "좋아요"}
            </button>
          </div>
        </div>
      </header>

      <section className={styles.locations}>
        <h2 className={styles.sectionTitle}>여행 일정</h2>
        <Carousel
          slidesToShow={slidesToShow}
          autoplay={false}
          showDots={true}
          showArrows={true}
          disableDrag={isAnyDragging}
        >
          {plan.itineraries.map((itinerary) => (
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
                    ).map((activity, index) => {
                      const locationActivity =
                        itineraryActivityToLocation(activity);

                      // 편집 모드인 경우 편집 카드 렌더링
                      if (editingActivityId === activity.id) {
                        return (
                          <div
                            key={activity.id}
                            className={styles.editActivityCard}
                          >
                            <div className={styles.activityNumber}>
                              {index + 1}
                            </div>
                            <div className={styles.addActivityForm}>
                              <div className={styles.inputRow}>
                                <input
                                  type="text"
                                  placeholder="제목 *"
                                  value={editingActivity.title}
                                  onChange={(e) =>
                                    setEditingActivity((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                  className={styles.titleInput}
                                />
                                <input
                                  type="text"
                                  placeholder="장소명 * (구글맵 검색 가능한 정확한 이름)"
                                  value={editingActivity.locationName}
                                  onChange={(e) =>
                                    setEditingActivity((prev) => ({
                                      ...prev,
                                      locationName: e.target.value,
                                    }))
                                  }
                                  className={styles.locationInput}
                                />
                              </div>
                              <div className={styles.inputRow}>
                                <textarea
                                  placeholder="설명"
                                  value={editingActivity.description}
                                  onChange={(e) =>
                                    setEditingActivity((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  className={styles.descriptionInput}
                                  rows={2}
                                />
                                <input
                                  type="text"
                                  placeholder="예상 비용 (예: 15,000원)"
                                  value={editingActivity.cost}
                                  onChange={(e) =>
                                    setEditingActivity((prev) => ({
                                      ...prev,
                                      cost: e.target.value,
                                    }))
                                  }
                                  className={styles.costInput}
                                />
                              </div>
                              <div className={styles.formActions}>
                                <button
                                  className={styles.cancelButton}
                                  onClick={handleCancelEditActivity}
                                  type="button"
                                  disabled={isUpdatingActivity}
                                >
                                  취소
                                </button>
                                <button
                                  className={styles.submitButton}
                                  onClick={handleUpdateActivity}
                                  type="button"
                                  disabled={
                                    isUpdatingActivity ||
                                    !editingActivity.title.trim() ||
                                    !editingActivity.locationName.trim()
                                  }
                                >
                                  {isUpdatingActivity ? "저장 중..." : "저장"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 일반 모드: 상세 페이지에서는 드래그 활성화
                      return (
                        <DraggableActivity
                          key={activity.id}
                          activity={locationActivity}
                          index={index}
                          onPlaceClick={handlePlaceClick}
                          onEditClick={handleStartEditActivity}
                          onDeleteClick={handleStartDeleteActivity}
                          isEditable={!!(user && plan.userId === user.id)}
                        />
                      );
                    })}
                    {user && plan.userId === user.id && (
                      <div className={styles.addActivityCard}>
                        <div className={styles.activityNumber}>+</div>
                        <div className={styles.addActivityForm}>
                          <div className={styles.inputRow}>
                            <input
                              type="text"
                              placeholder="제목 *"
                              value={
                                getActivityForItinerary(itinerary.id).title
                              }
                              onChange={(e) =>
                                updateActivityForItinerary(itinerary.id, {
                                  title: e.target.value,
                                })
                              }
                              className={styles.titleInput}
                            />
                            <input
                              type="text"
                              placeholder="장소명 * (구글맵 검색 가능한 정확한 이름)"
                              value={
                                getActivityForItinerary(itinerary.id)
                                  .locationName
                              }
                              onChange={(e) =>
                                updateActivityForItinerary(itinerary.id, {
                                  locationName: e.target.value,
                                })
                              }
                              className={styles.locationInput}
                            />
                          </div>
                          <div className={styles.inputRow}>
                            <textarea
                              placeholder="설명"
                              value={
                                getActivityForItinerary(itinerary.id)
                                  .description
                              }
                              onChange={(e) =>
                                updateActivityForItinerary(itinerary.id, {
                                  description: e.target.value,
                                })
                              }
                              className={styles.descriptionInput}
                              rows={2}
                            />
                            <input
                              type="text"
                              placeholder="예상 비용 (예: 15,000원)"
                              value={getActivityForItinerary(itinerary.id).cost}
                              onChange={(e) =>
                                updateActivityForItinerary(itinerary.id, {
                                  cost: e.target.value,
                                })
                              }
                              className={styles.costInput}
                            />
                          </div>
                          <div className={styles.formActions}>
                            <button
                              className={styles.cancelButton}
                              onClick={() =>
                                handleCancelAddActivity(itinerary.id)
                              }
                              type="button"
                              disabled={submittingItineraries[itinerary.id]}
                            >
                              취소
                            </button>
                            <button
                              className={styles.submitButton}
                              onClick={() => handleAddActivity(itinerary.id)}
                              type="button"
                              disabled={
                                submittingItineraries[itinerary.id] ||
                                !getActivityForItinerary(
                                  itinerary.id
                                ).title.trim() ||
                                !getActivityForItinerary(
                                  itinerary.id
                                ).locationName.trim()
                              }
                            >
                              {submittingItineraries[itinerary.id]
                                ? "추가 중..."
                                : "추가하기"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* 삭제 확인 모달 */}
      {deletingActivityId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>액티비티 삭제</h3>
            </div>
            <div className={styles.modalBody}>
              <p>이 액티비티를 정말 삭제하시겠습니까?</p>
              <p className={styles.modalWarning}>
                삭제된 액티비티는 복구할 수 없습니다.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDeleteActivity}
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                className={styles.deleteButton}
                onClick={handleDeleteActivity}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <section className={styles.map}>
        <PolylineMap
          allItineraryLocations={allItineraryLocations}
          selectedDayNumber={
            selectedItinerary
              ? plan.itineraries.findIndex(
                  (i) => i.id === selectedItinerary.id
                ) + 1
              : 1
          }
          onPlaceDetailsChange={handlePlaceDetailsChange}
        />
      </section> */}
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
                  <div key={actIndex} className={styles.skeletonActivityCard}>
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
