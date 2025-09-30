import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import {
  TravelPlan,
  PlanUpdateRequest,
  TravelPlanCreateRequest,
  TravelPlanSearchRequest,
  TravelPlanSearchResponse,
  DraftTravelPlan,
  PlanTaskStatus,
} from "@/types/plan";

// 인터페이스 정의
interface DraftPlanState {
  draftPlan: DraftTravelPlan | null;
  draftPreview: DraftTravelPlan[];
  taskStatus: PlanTaskStatus | null;
  isLoading: boolean;
  isLoadingPreview: boolean;
  error: string | null;
  previewError: string | null;
  polling: boolean;
  pollingIntervalId?: number | null;
}

// 액션 인터페이스
interface DraftPlanActions {
  createDraftPlan: (plan: TravelPlanCreateRequest) => Promise<PlanTaskStatus>;
  startPolling: (taskId: string, intervalMs?: number) => void;
  stopPolling: () => void;
  initializePlanPollingFromLocalStorage: () => void;
  clearTaskStatus: () => void;
  getDraftPlan: (id: string) => Promise<DraftTravelPlan>;
  getDraftPreview: () => Promise<DraftTravelPlan[]>;
}

// 스토어 생성
export const useDraftPlanStore = create<DraftPlanState & DraftPlanActions>(
  (set, get) => ({
    // 초기 상태
    draftPlan: null,
    draftPreview: [],
    taskStatus: null,
    isLoading: false,
    isLoadingPreview: false,
    error: null,
    previewError: null,
    polling: false,
    pollingIntervalId: null,

    createDraftPlan: async (plan: TravelPlanCreateRequest) => {
      // 진행 중이면 차단
      const currentStatus = get().taskStatus;
      if (currentStatus?.status === "PROCESSING") {
        const errorMessage = "이전 생성이 진행 중입니다.";
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
      set({ isLoading: true, error: null });
      try {
        const { data } = await axiosInstance.post("/trip/draft", plan);
        localStorage.setItem("planTaskStatus", JSON.stringify(data));
        set({ taskStatus: data, isLoading: false, error: null });
        // PROCESSING 상태면 폴링 시작
        if (data?.status === "PROCESSING" && data?.taskId) {
          get().startPolling(data.taskId);
        }
        return data;
      } catch (error: any) {
        set({ isLoading: false, error: error?.message });
        throw error;
      }
    },

    startPolling: (taskId: string, intervalMs = 10000) => {
      set((state) => {
        if (state.polling) return {} as Partial<DraftPlanState>;
        const intervalId = window.setInterval(async () => {
          try {
            const { data } = await axiosInstance.get(
              `/trip/draft/polling/status/${taskId}`
            );
            localStorage.setItem("planTaskStatus", JSON.stringify(data));
            set({ taskStatus: data });
            if (data?.status !== "PROCESSING") {
              window.clearInterval(intervalId);
              set({ polling: false, pollingIntervalId: null });
            }
          } catch (e: any) {
            set({ error: e?.message });
          }
        }, intervalMs);
        return { polling: true, pollingIntervalId: intervalId };
      });
    },
    stopPolling: () => {
      set((state) => {
        if (state.pollingIntervalId) {
          window.clearInterval(state.pollingIntervalId);
        }
        return { polling: false, pollingIntervalId: null };
      });
    },
    initializePlanPollingFromLocalStorage: () => {
      try {
        const raw = localStorage.getItem("planTaskStatus");
        if (!raw) return;
        const parsed: PlanTaskStatus = JSON.parse(raw);
        set({ taskStatus: parsed });
        if (parsed.status === "PROCESSING" && parsed.taskId) {
          // 앱 전역에서 폴링 재개
          get().startPolling(parsed.taskId);
        }
      } catch (e: any) {
        set({ error: e?.message });
      }
    },
    clearTaskStatus: () => {
      localStorage.removeItem("planTaskStatus");
      set({ taskStatus: null });
    },

    getDraftPreview: async () => {
      set({ isLoadingPreview: true, previewError: null });
      try {
        const { data } = await axiosInstance.get(`/trip/draft/preview`);
        set({ draftPreview: data, previewError: null });
        return data;
      } catch (error: any) {
        set({ previewError: error?.message });
        throw error;
      } finally {
        set({ isLoadingPreview: false });
      }
    },
    getDraftPlan: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await axiosInstance.get(`/trip/draft/${id}`);
        set({ draftPlan: data, isLoading: false, error: null });
        return data;
      } catch (error: any) {
        set({ isLoading: false, error: error?.message });
        throw error;
      }
    },
  })
);
