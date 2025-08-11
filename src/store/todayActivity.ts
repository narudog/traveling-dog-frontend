import { create } from "zustand";
import axios from "@/lib/axios";
import {
  TodayActivityRequestDTO,
  TodayActivityResponseDTO,
  SaveActivityRequestDTO,
  SavedActivityResponseDTO,
} from "@/types/todayActivity";

interface TodayActivityState {
  loading: boolean;
  error: string | null;
  saved: SavedActivityResponseDTO[];
}

interface TodayActivityActions {
  recommend: (
    payload: TodayActivityRequestDTO
  ) => Promise<TodayActivityResponseDTO>;
  save: (payload: SaveActivityRequestDTO) => Promise<SavedActivityResponseDTO>;
  listSaved: () => Promise<SavedActivityResponseDTO[]>;
  listSavedByCategory: (
    category: string
  ) => Promise<SavedActivityResponseDTO[]>;
  removeSaved: (activityId: string) => Promise<void>;
  countSaved: () => Promise<number>;
  health: () => Promise<string>;
}

export const useTodayActivityStore = create<
  TodayActivityState & TodayActivityActions
>((set) => ({
  loading: false,
  error: null,
  saved: [],

  recommend: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/today-activity/recommend", payload);
      set({ loading: false });
      return data as TodayActivityResponseDTO;
    } catch (error: any) {
      set({ loading: false, error: error?.message || "추천 실패" });
      throw error;
    }
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
