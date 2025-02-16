"use client";

import { useState } from "react";
import styles from "@/styles/landing/SearchSection.module.scss";

export default function SearchSection() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // 만약 종료일이 새로운 시작일보다 이전이면 종료일을 리셋
        if (endDate && endDate < newStartDate) {
            setEndDate("");
        }
    };

    return (
        <div className={styles.searchSection}>
            <div className={styles.searchBox} data-testid="search-box">
                <input type="text" placeholder="여행지를 입력하세요 (예: 제주도, 부산)" className={styles.destinationInput} />
                <input type="date" className={styles.dateInput} placeholder="출발일" value={startDate} onChange={handleStartDateChange} min={new Date().toISOString().split("T")[0]} />
                <input type="date" className={styles.dateInput} placeholder="도착일" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split("T")[0]} disabled={!startDate} />
                <button className={styles.searchButton} disabled={!startDate || !endDate}>
                    일정 만들기
                </button>
            </div>
        </div>
    );
}
