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
      // 최초 1회만 가져오고, 필요시 강제 갱신은 별도에서 force=true로 호출
      getPlanList();
    } else {
      setPlanList(JSON.parse(localStorage.getItem("planList") || "[]"));
    }
  }, [user]);

  return (
    <div className={styles["travel-plan-list"]}>
      <PlanList planList={planList} />
    </div>
  );
};

export default TravelPlanList;
