import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import {
  TravelPlan,
  PlanUpdateRequest,
  TravelPlanCreateRequest,
} from "@/types/plan";

// 인터페이스 정의
interface PlanState {
  plan: TravelPlan | null;
  planList: TravelPlan[];
  loading: boolean;
  error: string | null;
}

// 액션 인터페이스
interface PlanActions {
  createPlan: (plan: TravelPlanCreateRequest) => Promise<TravelPlan>;
  getPlanList: () => Promise<void>;
  getPlanDetail: (planId: string) => Promise<TravelPlan>;
  updatePlan: (planId: string, plan: PlanUpdateRequest) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  setPlanList: (planList: TravelPlan[]) => void;
  setPlan: (plan: TravelPlan) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 스토어 생성
export const usePlanStore = create<PlanState & PlanActions>((set) => ({
  // 초기 상태
  plan: null,
  planList: [],
  loading: false,
  error: null,
  createPlan: async (plan: TravelPlanCreateRequest) => {
    set({ loading: true, error: null });
    try {
      // 헤더 정보는 세 번째 인자로 전달
      const { data } = await axiosInstance.post("/travel/plan", plan);
      // 성공 시 결과 저장
      set({ plan: data, loading: false, error: null });
      return data;
    } catch (error: any) {
      // 실패 시 에러 업데이트
      set((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || "플랜 생성 실패",
      }));
      throw error;
    }
  },

  getPlanList: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/travel/plan/list");
      set({ planList: data, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error?.message || "플랜 목록 조회 실패" });
      throw error;
    }
  },

  getPlanDetail: async (planId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/travel/plan/${planId}`);
      set({ plan: data, loading: false, error: null });
      return data;
    } catch (error: any) {
      set({ loading: false, error: error?.message || "플랜 상세 조회 실패" });
      throw error;
    }
  },

  updatePlan: async (planId: string, plan: PlanUpdateRequest) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/travel/plan/${planId}`, plan);
      set({ plan: data, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error?.message || "플랜 수정 실패" });
      throw error;
    }
  },

  deletePlan: async (planId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.delete(`/travel/plan/${planId}`);
      set({ loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error?.message || "플랜 삭제 실패" });
      throw error;
    }
  },

  setPlanList: (planList: TravelPlan[]) => {
    set({ planList });
  },
  setPlan: (plan: TravelPlan) => {
    set({ plan });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
