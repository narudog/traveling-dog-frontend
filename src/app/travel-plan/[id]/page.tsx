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
            setPlan(JSON.parse(localStorage.getItem("planList") || "[]").find((plan: TravelPlan) => plan.id === Number(id)));
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
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>{plan.title}</h1>
                    <span className={styles.location}>
                        {plan.country} - {plan.city}
                    </span>
                    <span className={styles.date}>
                        {format(new Date(plan.startDate), "yyyy.MM.dd")} ~ {format(new Date(plan.endDate), "yyyy.MM.dd")}
                    </span>
                    <div className={styles.stats}>
                        <div className={styles.statsItem}>
                            <span className={styles.statsLabel}>조회수</span>
                            <span className={styles.statsValue}>{plan.viewCount}</span>
                        </div>
                        <div className={styles.divider}>|</div>
                        <div className={styles.statsItem}>
                            <span className={styles.statsLabel}>좋아요</span>
                            <span className={styles.statsValue}>{plan.likeCount}</span>
                        </div>
                        <div className={styles.divider}>|</div>
                        <div className={styles.statsItem}>
                            <span className={styles.statsLabel}>작성자</span>
                            <span className={styles.statsValue}>{plan.nickname}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles.locations}>
                <h2 className={styles.sectionTitle}>여행 장소</h2>
                <div className={styles.locationList}>
                    {plan.itineraries.map((itinerary) => (
                        <div key={itinerary.id} className={`${styles.locationItem} ${selectedItinerary?.id === itinerary.id ? styles.locationItemActive : ""}`} onClick={() => onClickItinerary(itinerary)}>
                            <div className={styles.locationHeader}>
                                <h3 className={styles.locationName}>
                                    {itinerary.date}일차 / {itinerary.location}
                                </h3>
                            </div>
                            <p className={styles.locationDesc}>{itinerary.activities.map((activity) => activity.title).join(", ")}</p>
                            <div className={styles.locationOrder}>
                                <span>순서: {itinerary.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.map}>
                <PolylineMap locationNames={selectedItinerary?.activities.map((activity) => activity.locationName)} />
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
                <h2 className={styles.sectionTitle}>여행 장소</h2>
                <div className={styles.locationList}>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={`${styles.locationItem} ${styles.item}`}>
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
