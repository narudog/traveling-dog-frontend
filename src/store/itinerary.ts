import { create } from "zustand";
import axios from "@/lib/axios";

export interface ItineraryActivityDTO {
  id: number;
  itineraryId: number;
  title: string;
  description?: string;
  locationName?: string;
  cost?: string;
  orderIndex: number;
}

export interface ItineraryActivityCreateRequest {
  itineraryId: number;
  title: string;
  description?: string;
  locationName: string;
  cost?: string;
}

export interface ItineraryActivityUpdateRequest {
  title: string;
  description?: string;
  locationName: string;
  cost?: string;
}

interface ItineraryState {
  loading: boolean;
  error: string | null;
  optimisticActivities: Record<number, ItineraryActivityDTO[]>; // itineraryId -> activities
}

interface ItineraryActions {
  getOne: (id: number) => Promise<ItineraryActivityDTO>;
  listByItinerary: (itineraryId: number) => Promise<ItineraryActivityDTO[]>;
  create: (
    payload: ItineraryActivityCreateRequest
  ) => Promise<ItineraryActivityDTO>;
  update: (
    id: number,
    payload: ItineraryActivityUpdateRequest
  ) => Promise<ItineraryActivityDTO>;
  remove: (id: number) => Promise<void>;
  moveUp: (id: number) => Promise<ItineraryActivityDTO>;
  moveDown: (id: number) => Promise<ItineraryActivityDTO>;
  moveToTop: (id: number) => Promise<ItineraryActivityDTO>;
  moveToBottom: (id: number) => Promise<ItineraryActivityDTO>;
  moveToPosition: (
    id: number,
    position: number
  ) => Promise<ItineraryActivityDTO>;
  // 낙관적 업데이트를 위한 액션들
  setOptimisticActivities: (
    itineraryId: number,
    activities: ItineraryActivityDTO[]
  ) => void;
  getOptimisticActivities: (
    itineraryId: number
  ) => ItineraryActivityDTO[] | null;
  moveToPositionOptimistic: (
    itineraryId: number,
    activityId: number,
    newPosition: number
  ) => Promise<void>;
}

export const useItineraryStore = create<ItineraryState & ItineraryActions>(
  (set, get) => ({
    loading: false,
    error: null,
    optimisticActivities: {},

    getOne: async (id) => {
      const { data } = await axios.get(`/itinerary/activities/${id}`);
      return data as ItineraryActivityDTO;
    },

    listByItinerary: async (itineraryId) => {
      const { data } = await axios.get(
        `/itinerary/activities/itinerary/${itineraryId}`
      );
      return data as ItineraryActivityDTO[];
    },

    create: async (payload) => {
      const { data } = await axios.post(`/itinerary/activities`, payload);
      return data as ItineraryActivityDTO;
    },

    update: async (id, payload) => {
      const { data } = await axios.put(`/itinerary/activities/${id}`, payload);
      return data as ItineraryActivityDTO;
    },

    remove: async (id) => {
      await axios.delete(`/itinerary/activities/${id}`);
    },

    moveUp: async (id) => {
      const { data } = await axios.put(`/itinerary/activities/${id}/move-up`);
      return data as ItineraryActivityDTO;
    },

    moveDown: async (id) => {
      const { data } = await axios.put(`/itinerary/activities/${id}/move-down`);
      return data as ItineraryActivityDTO;
    },

    moveToTop: async (id) => {
      const { data } = await axios.put(
        `/itinerary/activities/${id}/move-to-top`
      );
      return data as ItineraryActivityDTO;
    },

    moveToBottom: async (id) => {
      const { data } = await axios.put(
        `/itinerary/activities/${id}/move-to-bottom`
      );
      return data as ItineraryActivityDTO;
    },

    moveToPosition: async (id, position) => {
      const { data } = await axios.put(
        `/itinerary/activities/${id}/move-to-position/${position}`
      );
      return data as ItineraryActivityDTO;
    },

    // 낙관적 업데이트 메서드들
    setOptimisticActivities: (itineraryId, activities) => {
      set((state) => ({
        optimisticActivities: {
          ...state.optimisticActivities,
          [itineraryId]: activities,
        },
      }));
    },

    getOptimisticActivities: (itineraryId) => {
      const state = get();
      return state.optimisticActivities[itineraryId] || null;
    },

    moveToPositionOptimistic: async (itineraryId, activityId, newPosition) => {
      const state = get();
      const currentActivities = state.optimisticActivities[itineraryId];

      if (!currentActivities) return;

      // 현재 위치 찾기
      const currentIndex = currentActivities.findIndex(
        (a) => a.id === activityId
      );
      if (currentIndex === -1) return;

      // 낙관적 업데이트: 배열에서 요소를 새 위치로 이동
      const newActivities = [...currentActivities];
      const [movedActivity] = newActivities.splice(currentIndex, 1);
      newActivities.splice(newPosition, 0, movedActivity);

      // position 값을 업데이트 (0부터 시작)
      const updatedActivities = newActivities.map((activity, index) => ({
        ...activity,
        position: index,
      }));

      // 낙관적 업데이트 적용
      set((state) => ({
        optimisticActivities: {
          ...state.optimisticActivities,
          [itineraryId]: updatedActivities,
        },
      }));

      try {
        // 서버에 실제 업데이트 요청
        await axios.put(
          `/itinerary/activities/${activityId}/move-to-position/${newPosition}`
        );
      } catch (error) {
        // 실패 시 원래 상태로 복원
        set((state) => ({
          optimisticActivities: {
            ...state.optimisticActivities,
            [itineraryId]: currentActivities,
          },
        }));
        throw error;
      }
    },
  })
);
