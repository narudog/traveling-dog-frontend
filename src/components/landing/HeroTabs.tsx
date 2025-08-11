"use client";

import { useState } from "react";
import SearchSection from "@/components/landing/SearchSection";
import TodayActivityPanel from "@/components/landing/TodayActivityPanel";
import styles from "./HeroTabs.module.scss";

export default function HeroTabs() {
  const [active, setActive] = useState<"planner" | "today">("planner");
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
