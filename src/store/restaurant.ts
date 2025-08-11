import { create } from "zustand";
import axios from "@/lib/axios";
import {
  RestaurantRecommendationRequestDTO,
  RestaurantRecommendationResponseDTO,
} from "@/types/restaurant";

interface RestaurantState {
  loading: boolean;
  error: string | null;
}

interface RestaurantActions {
  getDefault: (planId: number) => Promise<RestaurantRecommendationResponseDTO>;
  getWithOptions: (
    planId: number,
    payload: RestaurantRecommendationRequestDTO | null
  ) => Promise<RestaurantRecommendationResponseDTO>;
}

export const useRestaurantStore = create<RestaurantState & RestaurantActions>(
  (set) => ({
    loading: false,
    error: null,

    getDefault: async (planId) => {
      const { data } = await axios.get(`/travel/plan/${planId}/restaurants`);
      return data as RestaurantRecommendationResponseDTO;
    },

    getWithOptions: async (planId, payload) => {
      const { data } = await axios.post(
        `/travel/plan/${planId}/restaurants`,
        payload
      );
      return data as RestaurantRecommendationResponseDTO;
    },
  })
);
