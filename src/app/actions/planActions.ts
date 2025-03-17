'use server'

import axiosInstance from "@/lib/axios";

export async function getPlanList() {
    try {
        const { data } = await axiosInstance.get("/travel/plans");

        if (!data) {
            throw new Error('플랜 목록 조회 실패');
        }

        return data;
    } catch (error) {
        console.error('플랜 목록 조회 중 오류 발생:', error);
        throw error;
    }
}

export async function getPlanDetail(planId: string) {
    try {
        const { data } = await axiosInstance.get(`/travel/plan/${planId}`);

        if (!data) {
            throw new Error('플랜 상세 조회 실패');
        }

        return data;
    } catch (error) {
        console.error('플랜 상세 조회 중 오류 발생:', error);
        throw error;
    }
}