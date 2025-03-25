"use client";
import styles from "./page.module.scss";
import { usePlanStore } from "@/store/plan";
import { useEffect } from "react";
import PlanList from "@/components/travelPlan/PlanList";

const TravelPlanList = () => {
  const { planList, getPlanList } = usePlanStore();

  useEffect(() => {
    getPlanList();
  }, []);

  return (
    <div className={styles["travel-plan-list"]}>
      <h1 className={styles["travel-plan-list__title"]}>여행 계획 목록</h1>

      <PlanList planList={planList} />
    </div>
  );
};

export default TravelPlanList;
