import { create } from "zustand";
import axios from "@/lib/axios";
import {
  TodayActivityRequestDTO,
  TodayActivityResponseDTO,
  SaveActivityRequestDTO,
  SavedActivityResponseDTO,
  ActivityTaskStatus,
} from "@/types/todayActivity";

interface TodayActivityState {
  isLoading: boolean;
  polling: boolean;
  pollingIntervalId: number | null;
  error: string | null;
  saved: SavedActivityResponseDTO[];
  taskStatus: ActivityTaskStatus | null;
  result: TodayActivityResponseDTO | null;
}

interface TodayActivityActions {
  recommend: (payload: TodayActivityRequestDTO) => Promise<ActivityTaskStatus>;
  save: (payload: SaveActivityRequestDTO) => Promise<SavedActivityResponseDTO>;
  listSaved: () => Promise<SavedActivityResponseDTO[]>;
  listSavedByCategory: (
    category: string
  ) => Promise<SavedActivityResponseDTO[]>;
  removeSaved: (activityId: string) => Promise<void>;
  countSaved: () => Promise<number>;
  health: () => Promise<string>;
  startPolling: (taskId: string, intervalMs?: number) => void;
  stopPolling: () => void;
  initializeActivityPollingFromLocalStorage: () => void;
  clearTaskStatus: () => void;
}

export const useTodayActivityStore = create<
  TodayActivityState & TodayActivityActions
>((set, get) => ({
  isLoading: false,
  polling: false,
  pollingIntervalId: null,
  error: null,
  saved: [],
  taskStatus: null,
  result: null,
  recommend: async (payload: TodayActivityRequestDTO) => {
    // 진행 중이면 차단
    const currentStatus = get().taskStatus;
    if (currentStatus?.status === "PROCESSING") {
      const errorMessage = "이전 생성이 진행 중입니다.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
    set({ isLoading: true, error: null });
    try {
      const { data }: { data: ActivityTaskStatus } = await axios.post(
        "/today-activity/recommend",
        payload
      );
      localStorage.setItem("activityTaskStatus", JSON.stringify(data));
      set({ taskStatus: data, isLoading: false, error: null });
      // PROCESSING 상태면 폴링 시작
      if (data.status === "PROCESSING" && data.taskId) {
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
      if (state.polling) return {} as Partial<TodayActivityState>;
      const intervalId = window.setInterval(async () => {
        try {
          const { data }: { data: ActivityTaskStatus } = await axios.get(
            `/today-activity/polling/status/${taskId}`
          );
          localStorage.setItem("activityTaskStatus", JSON.stringify(data));
          set({ taskStatus: data });
          if (data.status !== "PROCESSING") {
            window.clearInterval(intervalId);
            set({ polling: false, pollingIntervalId: null });
          }
          if (data.status === "COMPLETED") {
            set({ result: data.result });
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
  initializeActivityPollingFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem("activityTaskStatus");
      if (!raw) return;
      const parsed: ActivityTaskStatus = JSON.parse(raw);
      set({ taskStatus: parsed });
      if (parsed.status === "PROCESSING" && parsed.taskId) {
        // 앱 전역에서 폴링 재개
        get().startPolling(parsed.taskId);
      }
      if (parsed.status === "COMPLETED") {
        set({ result: parsed.result });
      }
    } catch (e: any) {
      set({ error: e?.message });
    }
  },
  clearTaskStatus: () => {
    localStorage.removeItem("activityTaskStatus");
    set({ taskStatus: null });
  },

  save: async (payload) => {
    try {
      const { data } = await axios.post("/today-activity/save", payload);
      return data as SavedActivityResponseDTO;
    } catch (error) {
      throw error;
    }
  },

  listSaved: async () => {
    try {
      const { data } = await axios.get("/today-activity/saved");
      set({ saved: data });
      return data as SavedActivityResponseDTO[];
    } catch (error) {
      throw error;
    }
  },

  listSavedByCategory: async (category: string) => {
    try {
      const { data } = await axios.get(
        `/today-activity/saved/category/${encodeURIComponent(category)}`
      );
      return data as SavedActivityResponseDTO[];
    } catch (error) {
      throw error;
    }
  },

  removeSaved: async (activityId: string) => {
    try {
      await axios.delete(`/today-activity/saved/${activityId}`);
    } catch (error) {
      throw error;
    }
  },

  countSaved: async () => {
    try {
      const { data } = await axios.get("/today-activity/saved/count");
      return Number(data);
    } catch (error) {
      throw error;
    }
  },

  health: async () => {
    try {
      const { data } = await axios.get("/today-activity/health");
      return String(data);
    } catch (error) {
      throw error;
    }
  },
}));
