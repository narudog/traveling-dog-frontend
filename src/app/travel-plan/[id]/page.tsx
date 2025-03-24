'use client'

import { TravelPlan, PlanStatus } from '@/types/plan';
import styles from './page.module.scss';
import { format } from 'date-fns';
import PolylineMap from '@/components/map/PolylineMap';
import { redirect, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { usePlanStore } from '@/store/plan';

const TravelPlanDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { plan, getPlanDetail } = usePlanStore();

    useEffect(() => {
        getPlanDetail(id);
    }, [id]);

    if (!plan) {
        return null;
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
                        {format(new Date(plan.startDate), 'yyyy.MM.dd')} ~ {format(new Date(plan.endDate), 'yyyy.MM.dd')}
                    </span>
                    <div className={styles.planDetail__stats}>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>조회수</span>
                            <span className={styles.planDetail__statsValue}>{plan.viewCount}</span>
                        </div>
                        <div className={styles.planDetail__divider}>|</div>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>좋아요</span>
                            <span className={styles.planDetail__statsValue}>{plan.likeCount}</span>
                        </div>
                        <div className={styles.planDetail__divider}>|</div>
                        <div className={styles.planDetail__statsItem}>
                            <span className={styles.planDetail__statsLabel}>작성자</span>
                            <span className={styles.planDetail__statsValue}>{plan.nickname}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles.planDetail__locations}>
                <h2 className={styles.planDetail__sectionTitle}>여행 장소</h2>
                <div className={styles.planDetail__locationList}>
                    {plan.travelLocations.map((location) => (
                        <div key={location.id} className={styles.planDetail__locationItem}>
                            <div className={styles.planDetail__locationHeader}>
                                <h3 className={styles.planDetail__locationName}>
                                    {location.placeName}
                                </h3>
                            </div>
                            <p className={styles.planDetail__locationDesc}>
                                {location.description}
                            </p>
                            <div className={styles.planDetail__locationOrder}>
                                <span>순서: {location.locationOrder}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.planDetail__map}>
                <PolylineMap positions={plan.travelLocations.map((location) => ({
                    lat: location.latitude,
                    lng: location.longitude
                }))} />
            </section>
        </div>
    );
};

export default TravelPlanDetailPage;


