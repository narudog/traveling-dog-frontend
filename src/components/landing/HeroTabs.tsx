"use client";

import { useEffect, useState } from "react";
import SearchSection from "@/components/landing/SearchSection";
import TodayActivityPanel from "@/components/landing/TodayActivityPanel";
import styles from "./HeroTabs.module.scss";
import { useSearchParams } from "next/navigation";

export default function HeroTabs() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "today" ? "today" : "planner";
  const [active, setActive] = useState<"planner" | "today">(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "today" || tab === "planner") {
      setActive(tab);
    }
  }, [searchParams]);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabHeaders}>
        <button
          className={`${styles.tabButton} ${active === "planner" ? styles.active : ""}`}
          onClick={() => setActive("planner")}
        >
          AI 일정 만들기
        </button>
        <button
          className={`${styles.tabButton} ${active === "today" ? styles.active : ""}`}
          onClick={() => setActive("today")}
        >
          오늘 할만한 활동 추천
        </button>
      </div>

      <div className={styles.panel}>
        {active === "planner" ? <SearchSection /> : <TodayActivityPanel />}
      </div>
    </div>
  );
}
