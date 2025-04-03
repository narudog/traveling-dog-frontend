"use client";
import styles from "./page.module.scss";
import { usePlanStore } from "@/store/plan";
import { useEffect } from "react";
import PlanList from "@/components/travelPlan/PlanList";
import { useAuthStore } from "@/store/auth";
const TravelPlanList = () => {
  const { planList, getPlanList, setPlanList } = usePlanStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      getPlanList();
    } else {
      setPlanList(JSON.parse(localStorage.getItem("planList") || "[]"));
    }
  }, [user, getPlanList]);

  return (
    <div className={styles["travel-plan-list"]}>
      <h1 className={styles["travel-plan-list__title"]}>여행 계획 목록</h1>

      <PlanList planList={planList} />
    </div>
  );
};

export default TravelPlanList;
