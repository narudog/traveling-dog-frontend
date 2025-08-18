"use client";

import PolylineMap from "@/components/map/PolylineMap";
import { usePlanStore } from "@/store/plan";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { Itinerary, Location, TravelPlan } from "@/types/plan";
import { useAuthStore } from "@/store/auth";
import Carousel from "@/components/carousel/Carousel";
import { PlaceWithRating } from "@/types/plan";

// 평점 정보를 포함한 액티비티 타입
interface ActivityWithRating extends Location {
  rating?: number;
  totalRatings?: number;
  photos?: any;
  reviews?: any;
}

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
  const handlePlaceClick = (activity: ActivityWithRating) => {
    // // 구글 맵에서 장소 검색
    // window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.locationName)}`, "_blank");
  };

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
    }
  }, [plan]);

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
  }, [user, id, getLikeStatus]);

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
            <div className={styles.statsItem}>
              <span className={styles.statsLabel}>작성자</span>
              <span className={styles.statsValue}>{plan.nickname}</span>
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
        <Carousel
          slidesToShow={slidesToShow}
          autoplay={false}
          showDots={true}
          showArrows={true}
        >
          {plan.itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className={`${styles.locationItem} ${selectedItinerary?.id === itinerary.id ? styles.locationItemActive : ""}`}
              onClick={() => onClickItinerary(itinerary)}
            >
              <div className={styles.locationHeader}>
                <h3 className={styles.locationName}>
                  {itinerary.date}일차 / {itinerary.location}
                </h3>
              </div>
              <ul className={styles.locationDesc}>
                {itinerary.activities.map((activity, index) => (
                  <li
                    key={activity.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaceClick(activity);
                    }}
                    className={styles.activityItem}
                  >
                    <div className={styles.activityTitle}>
                      {index + 1}. {activity.title}
                    </div>
                    {/* <div className={styles.activityRating}>
                      {activitiesWithRatings[activity.id]?.rating
                        ? renderStars(activitiesWithRatings[activity.id].rating)
                        : "로딩중..."}
                    </div> */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Carousel>
      </section>
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
        <h2 className={styles.sectionTitle}>여행 장소</h2>
        <div className={styles.carouselSkeleton}>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`${styles.locationItem} ${styles.item}`}
            >
              <div className={styles.locationHeader}>
                <div className={`${styles.locationName} ${styles.text}`}></div>
              </div>
              <div className={`${styles.locationDesc} ${styles.text}`}></div>
              <div className={`${styles.locationOrder} ${styles.text}`}></div>
            </div>
          ))}
        </div>
      </section>
      <section className={`${styles.map} ${styles.map}`}></section>
    </div>
  );
};
