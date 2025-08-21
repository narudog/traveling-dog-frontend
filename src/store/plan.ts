import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import {
  TravelPlan,
  PlanUpdateRequest,
  TravelPlanCreateRequest,
  TravelPlanSearchRequest,
  TravelPlanSearchResponse,
  DraftTravelPlan,
  DraftTravelPlanSaveRequest,
} from "@/types/plan";

// 인터페이스 정의
interface PlanState {
  plan: TravelPlan | null;
  planList: TravelPlan[];
  isLoading: boolean;
  error: string | null;
}

// 액션 인터페이스
interface PlanActions {
  createPlan: (plan: TravelPlanCreateRequest) => Promise<TravelPlan>;
  saveDraftPlan: (plan: DraftTravelPlanSaveRequest) => Promise<TravelPlan>;
  getPlanList: () => Promise<void>;
  getPlanDetail: (planId: string) => Promise<TravelPlan>;
  updatePlan: (planId: string, plan: PlanUpdateRequest) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  searchPlans: (
    criteria: TravelPlanSearchRequest
  ) => Promise<TravelPlanSearchResponse>;
  likePlan: (planId: number) => Promise<boolean>;
  unlikePlan: (planId: number) => Promise<void>;
  getLikeStatus: (planId: number) => Promise<boolean>;
  getLikedPlans: () => Promise<TravelPlan[]>;
  setPlanList: (planList: TravelPlan[]) => void;
  setPlan: (plan: TravelPlan) => void;
}

// 스토어 생성
export const usePlanStore = create<PlanState & PlanActions>((set) => ({
  // 초기 상태
  plan: null,
  planList: [],
  isLoading: false,
  error: null,
  createPlan: async (plan: TravelPlanCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      // 헤더 정보는 세 번째 인자로 전달
      const { data } = await axiosInstance.post("/travel/plan", plan);
      // 성공 시 결과 저장
      set({ plan: data, isLoading: false, error: null });
      return data;
    } catch (error: any) {
      // 실패 시 에러 업데이트
      set((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || "플랜 생성 실패",
      }));
      throw error;
    }
  },

  saveDraftPlan: async (plan: DraftTravelPlanSaveRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/travel/plan/save", plan);
      set({ plan: data, isLoading: false, error: null });
      return data;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 저장 실패" });
      throw error;
    }
  },

  getPlanList: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/travel/plan/list");
      set({ planList: data, isLoading: false, error: null });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 목록 조회 실패" });
      throw error;
    }
  },

  getPlanDetail: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/travel/plan/${planId}`);
      set({ plan: data, isLoading: false, error: null });
      return data;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 상세 조회 실패" });
      throw error;
    }
  },

  updatePlan: async (planId: string, plan: PlanUpdateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/travel/plan/${planId}`, plan);
      set({ plan: data, isLoading: false, error: null });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 수정 실패" });
      throw error;
    }
  },

  deletePlan: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.delete(`/travel/plan/${planId}`);
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 삭제 실패" });
      throw error;
    }
  },

  searchPlans: async (criteria: TravelPlanSearchRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post(
        "/travel/plan/search",
        criteria ?? {}
      );
      set({ isLoading: false });
      return data as TravelPlanSearchResponse;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "플랜 검색 실패" });
      throw error;
    }
  },

  likePlan: async (planId: number) => {
    try {
      const { data } = await axiosInstance.post(`/travel/plan/${planId}/like`);
      return Boolean(data);
    } catch (error) {
      throw error;
    }
  },

  unlikePlan: async (planId: number) => {
    try {
      await axiosInstance.delete(`/travel/plan/${planId}/like`);
    } catch (error) {
      throw error;
    }
  },

  getLikeStatus: async (planId: number) => {
    try {
      const { data } = await axiosInstance.get(
        `/travel/plan/${planId}/like/status`
      );
      return Boolean(data);
    } catch (error) {
      throw error;
    }
  },

  getLikedPlans: async () => {
    try {
      const { data } = await axiosInstance.get(`/travel/plan/like`);
      return data as TravelPlan[];
    } catch (error) {
      throw error;
    }
  },

  setPlanList: (planList: TravelPlan[]) => {
    set({ planList });
  },
  setPlan: (plan: TravelPlan) => {
    set({ plan });
  },
}));
