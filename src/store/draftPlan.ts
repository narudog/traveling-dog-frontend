import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import {
  TravelPlan,
  PlanUpdateRequest,
  TravelPlanCreateRequest,
  TravelPlanSearchRequest,
  TravelPlanSearchResponse,
  DraftTravelPlan,
} from "@/types/plan";

// 인터페이스 정의
interface DraftPlanState {
  draftPlan: DraftTravelPlan | null;
  isLoading: boolean;
  error: string | null;
}

// 액션 인터페이스
interface DraftPlanActions {
  createDraftPlan: (plan: TravelPlanCreateRequest) => Promise<DraftTravelPlan>;
  getDraftPlan: (id: string) => Promise<DraftTravelPlan>;
}

// 스토어 생성
export const useDraftPlanStore = create<DraftPlanState & DraftPlanActions>(
  (set) => ({
    // 초기 상태
    draftPlan: null,
    isLoading: false,
    error: null,

    createDraftPlan: async (plan: TravelPlanCreateRequest) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await axiosInstance.post("/travel/plan/draft", plan);
        set({ draftPlan: data, isLoading: false, error: null });
        return data;
      } catch (error: any) {
        set({ isLoading: false, error: error?.message || "플랜 생성 실패" });
        throw error;
      }
    },
    getDraftPlan: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await axiosInstance.get(`/travel/plan/draft/${id}`);
        set({ draftPlan: data, isLoading: false, error: null });
        return data;
      } catch (error: any) {
        set({ isLoading: false, error: error?.message || "플랜 생성 실패" });
        throw error;
      }
    },
  })
);
