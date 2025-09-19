"use client";

import { useEffect, useMemo, useState } from "react";
import Carousel from "@/components/carousel/Carousel";
import { useDraftPlanStore } from "@/store/draftPlan";
import { DraftTravelPlan } from "@/types/plan";
import styles from "./PreviewCarousel.module.scss";
import feedStyles from "@/components/reviews/HomeFeed.module.scss";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function PreviewCarousel() {
  const router = useRouter();
  const { draftPreview, isLoadingPreview, error, getDraftPreview } =
    useDraftPlanStore();

  const [slidesToShow, setSlidesToShow] = useState<number>(3);

  // 헤더 타이틀: "9월(이번달) ~ 10월(다음달) 다른 여행 계획 보기"
  const headingText = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1~12
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    return `${currentMonth}월 ~ ${nextMonth}월 다른 여행 계획 보기`;
  }, []);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 640) return setSlidesToShow(1);
      if (width < 1024) return setSlidesToShow(2);
      return setSlidesToShow(3);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  useEffect(() => {
    if (!draftPreview || draftPreview.length === 0) {
      getDraftPreview().catch(() => {});
    }
  }, [draftPreview, getDraftPreview]);

  const items: DraftTravelPlan[] = useMemo(
    () => draftPreview || [],
    [draftPreview]
  );

  if (isLoadingPreview) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>미리보기를 불러오지 못했어요.</div>;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={feedStyles.feedContainer}>
      <div className={feedStyles.header}>
        <h2 className={feedStyles.sectionTitle}>{headingText}</h2>
      </div>
      <div className={styles.previewCarouselContainer}>
        <Carousel
          slidesToShow={slidesToShow}
          showDots
          showArrows
          autoplay
          autoplaySpeed={4000}
        >
          {items.map((plan) => (
            <div
              key={plan.id}
              className={feedStyles.carouselItem}
              onClick={() => router.push(`/draft-plan/${plan.id}`)}
            >
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.location}>
                    {plan.country} · {plan.city}
                  </div>
                  <h3 className={styles.title}>{plan.title}</h3>
                  <div className={styles.date}>
                    {format(new Date(plan.startDate), "yyyy.MM.dd")} -{" "}
                    {format(new Date(plan.endDate), "yyyy.MM.dd")}
                  </div>
                  <div className={styles.tags}>
                    {plan.travelStyles?.map((s) => (
                      <span key={s.id} className={styles.tag}>
                        #{s.name}
                      </span>
                    ))}
                    {plan.interests?.map((i) => (
                      <span key={i.id} className={styles.tag}>
                        #{i.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
