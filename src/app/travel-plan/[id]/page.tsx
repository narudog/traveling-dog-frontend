"use client";

import PolylineMap from "@/components/map/PolylineMap";
import { usePlanStore } from "@/store/plan";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { Itinerary, Location, TravelPlan } from "@/types/plan";
import { useAuthStore } from "@/store/auth";

const TravelPlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { plan, getPlanDetail, setPlan } = usePlanStore();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary>();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      getPlanDetail(id);
    } else {
      setPlan(
        JSON.parse(localStorage.getItem("planList") || "[]").find(
          (plan: TravelPlan) => plan.id === Number(id)
        )
      );
    }
  }, [id, getPlanDetail, user, setPlan]);

  const onClickItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
  };

  useEffect(() => {
    if (plan) {
      setSelectedItinerary(plan.itineraries[0]);
    }
  }, [plan]);

  if (!plan) {
    return <TravelPlanDetailSkeleton />;
  }

  return (
    <div className={styles.planDetail}>
      <header className={styles.planDetail__header}>
        <div className={styles.planDetail__titleArea}>
          <h1 className={styles.planDetail__title}>{plan.title}</h1>
          <span className={styles.planDetail__location}>
            {plan.country} - {plan.city}
          </span>
          <span className={styles.planDetail__date}>
            {format(new Date(plan.startDate), "yyyy.MM.dd")} ~{" "}
            {format(new Date(plan.endDate), "yyyy.MM.dd")}
          </span>
          <div className={styles.planDetail__stats}>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>조회수</span>
              <span className={styles.planDetail__statsValue}>
                {plan.viewCount}
              </span>
            </div>
            <div className={styles.planDetail__divider}>|</div>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>좋아요</span>
              <span className={styles.planDetail__statsValue}>
                {plan.likeCount}
              </span>
            </div>
            <div className={styles.planDetail__divider}>|</div>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>작성자</span>
              <span className={styles.planDetail__statsValue}>
                {plan.nickname}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.planDetail__locations}>
        <h2 className={styles.planDetail__sectionTitle}>여행 장소</h2>
        <div className={styles.planDetail__locationList}>
          {plan.itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className={`${styles.planDetail__locationItem} ${
                selectedItinerary?.id === itinerary.id
                  ? styles.planDetail__locationItemActive
                  : ""
              }`}
              onClick={() => onClickItinerary(itinerary)}
            >
              <div className={styles.planDetail__locationHeader}>
                <h3 className={styles.planDetail__locationName}>
                  {itinerary.date}일차 / {itinerary.location}
                </h3>
              </div>
              <p className={styles.planDetail__locationDesc}>
                {itinerary.activities
                  .map((activity) => activity.title)
                  .join(", ")}
              </p>
              <div className={styles.planDetail__locationOrder}>
                <span>순서: {itinerary.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.planDetail__map}>
        <PolylineMap
          locationNames={selectedItinerary?.activities.map(
            (activity) => activity.locationName
          )}
        />
      </section>
    </div>
  );
};

export default TravelPlanDetailPage;

const TravelPlanDetailSkeleton = () => {
  return (
    <div className={styles.planDetail}>
      <header className={`${styles.planDetail__header} ${styles.skeleton}`}>
        <div className={styles.planDetail__titleArea}>
          <div
            className={`${styles.planDetail__title} ${styles.skeleton__title}`}
          ></div>
          <div
            className={`${styles.planDetail__location} ${styles.skeleton__text}`}
          ></div>
          <div
            className={`${styles.planDetail__date} ${styles.skeleton__text}`}
          ></div>
          <div className={styles.planDetail__stats}>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>조회수</span>
              <span
                className={`${styles.planDetail__statsValue} ${styles.skeleton__text}`}
              ></span>
            </div>
            <div className={styles.planDetail__divider}>|</div>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>좋아요</span>
              <span
                className={`${styles.planDetail__statsValue} ${styles.skeleton__text}`}
              ></span>
            </div>
            <div className={styles.planDetail__divider}>|</div>
            <div className={styles.planDetail__statsItem}>
              <span className={styles.planDetail__statsLabel}>작성자</span>
              <span
                className={`${styles.planDetail__statsValue} ${styles.skeleton__text}`}
              ></span>
            </div>
          </div>
        </div>
      </header>

      <section className={`${styles.planDetail__locations} ${styles.skeleton}`}>
        <h2 className={styles.planDetail__sectionTitle}>여행 장소</h2>
        <div className={styles.planDetail__locationList}>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`${styles.planDetail__locationItem} ${styles.skeleton__item}`}
            >
              <div className={styles.planDetail__locationHeader}>
                <div
                  className={`${styles.planDetail__locationName} ${styles.skeleton__text}`}
                ></div>
              </div>
              <div
                className={`${styles.planDetail__locationDesc} ${styles.skeleton__text}`}
              ></div>
              <div
                className={`${styles.planDetail__locationOrder} ${styles.skeleton__text}`}
              ></div>
            </div>
          ))}
        </div>
      </section>
      <section
        className={`${styles.planDetail__map} ${styles.skeleton__map}`}
      ></section>
    </div>
  );
};
