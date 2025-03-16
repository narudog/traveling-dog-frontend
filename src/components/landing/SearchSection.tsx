"use client";

import { useState } from "react";
import styles from "@/styles/landing/SearchSection.module.scss";
import { useForm } from "react-hook-form";
import { usePlanStore } from "@/store/plan";
type SearchFormInputs = {
    country: string;
    city: string;
    startDate: string;
    endDate: string;
};

export default function SearchSection() {
    const { createPlan } = usePlanStore();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<SearchFormInputs>({
        mode: "onChange",
        defaultValues: {
            country: "",
            city: "",
            startDate: "",
            endDate: "",
        },
    });

    // 시작일 값 감시
    const startDate = watch("startDate");

    // 시작일이 변경될 때 종료일 검증
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;

        // 종료일이 새 시작일보다 이전이면 종료일 리셋
        const currentEndDate = watch("endDate");
        if (currentEndDate && currentEndDate < newStartDate) {
            setValue("endDate", "");
        }
    };

    const onSubmit = (data: SearchFormInputs) => {
        console.log("일정 만들기:", data);
        createPlan({
            title: data.country + " / " + data.city,
            country: data.country,
            city: data.city,
            startDate: data.startDate,
            endDate: data.endDate,
        });
        // 여기에 일정 만들기 로직 구현
    };

    return (
        <div className={styles.searchSection}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.searchBox} data-testid="search-box">
                <input type="text" placeholder="여행 국가를 입력하세요 (예: 미국, 일본)" className={`${styles.destinationInput} ${errors.country ? styles.inputError : ""}`} {...register("country", { required: true })} />
                {errors.country && <p className={styles.errorText}>여행 국가를 입력해주세요</p>}
                <input type="text" placeholder="여행 도시를 입력하세요 (예: 서울, 파리)" className={`${styles.destinationInput} ${errors.city ? styles.inputError : ""}`} {...register("city", { required: true })} />
                {errors.city && <p className={styles.errorText}>여행 도시를 입력해주세요</p>}

                <input
                    type="date"
                    className={`${styles.dateInput} ${errors.startDate ? styles.inputError : ""}`}
                    placeholder="출발일"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("startDate", {
                        required: true,
                        onChange: handleStartDateChange,
                    })}
                />
                {errors.startDate && <p className={styles.errorText}>출발일을 선택해주세요</p>}

                <input type="date" className={`${styles.dateInput} ${errors.endDate ? styles.inputError : ""}`} placeholder="도착일" min={startDate || new Date().toISOString().split("T")[0]} disabled={!startDate} {...register("endDate", { required: true })} />
                {errors.endDate && <p className={styles.errorText}>도착일을 선택해주세요</p>}

                <button type="submit" className={styles.searchButton} disabled={!isValid}>
                    일정 만들기
                </button>
            </form>
        </div>
    );
}
