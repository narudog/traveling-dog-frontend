import { create } from "zustand";
import axios from "@/lib/axios";
import {
  TripReviewCreateRequest,
  TripReviewFeedSort,
  TripReviewPage,
  TripReviewResponseDTO,
  TripReviewUpdateRequest,
} from "@/types/review";

interface ReviewState {
  loading: boolean;
  error: string | null;
}

interface ReviewActions {
  create: (payload: TripReviewCreateRequest) => Promise<TripReviewResponseDTO>;
  update: (
    reviewId: number,
    payload: TripReviewUpdateRequest
  ) => Promise<TripReviewResponseDTO>;
  remove: (reviewId: number) => Promise<void>;
  getOne: (reviewId: number) => Promise<TripReviewResponseDTO>;
  feed: (params: {
    sortBy?: TripReviewFeedSort;
    page?: number;
    size?: number;
  }) => Promise<TripReviewPage>;
  followingFeed: (params: {
    page?: number;
    size?: number;
  }) => Promise<TripReviewPage>;
  userReviews: (
    userId: number,
    params: { publicOnly?: boolean; page?: number; size?: number }
  ) => Promise<TripReviewPage>;
  searchByKeyword: (
    keyword: string,
    params?: { page?: number; size?: number }
  ) => Promise<TripReviewPage>;
  searchByTag: (
    tag: string,
    params?: { page?: number; size?: number }
  ) => Promise<TripReviewPage>;
  searchByLocation: (
    location: string,
    params?: { page?: number; size?: number }
  ) => Promise<TripReviewPage>;
  like: (reviewId: number) => Promise<void>;
  unlike: (reviewId: number) => Promise<void>;
  liked: (params: { page?: number; size?: number }) => Promise<TripReviewPage>;
  tagsPopular: (limit?: number) => Promise<string[]>;
}

export const useReviewStore = create<ReviewState & ReviewActions>((set) => ({
  loading: false,
  error: null,

  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/reviews", payload);
      set({ loading: false });
      return data as TripReviewResponseDTO;
    } catch (error: any) {
      set({ loading: false, error: error?.message || "후기 작성 실패" });
      throw error;
    }
  },

  update: async (reviewId, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(`/reviews/${reviewId}`, payload);
      set({ loading: false });
      return data as TripReviewResponseDTO;
    } catch (error: any) {
      set({ loading: false, error: error?.message || "후기 수정 실패" });
      throw error;
    }
  },

  remove: async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
    } catch (error) {
      throw error;
    }
  },

  getOne: async (reviewId) => {
    try {
      const { data } = await axios.get(`/reviews/${reviewId}`);
      return data as TripReviewResponseDTO;
    } catch (error) {
      throw error;
    }
  },

  feed: async ({ sortBy, page, size }) => {
    try {
      const { data } = await axios.get(`/reviews/feed`, {
        params: { sortBy, page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  followingFeed: async ({ page, size }) => {
    try {
      const { data } = await axios.get(`/reviews/following`, {
        params: { page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  userReviews: async (userId, { publicOnly = true, page, size }) => {
    try {
      const { data } = await axios.get(`/reviews/user/${userId}`, {
        params: { publicOnly, page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  searchByKeyword: async (keyword, { page, size } = {}) => {
    try {
      const { data } = await axios.get(`/reviews/search`, {
        params: { keyword, page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  searchByTag: async (tag, { page, size } = {}) => {
    try {
      const { data } = await axios.get(`/reviews/search/tag`, {
        params: { tag, page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  searchByLocation: async (location, { page, size } = {}) => {
    try {
      const { data } = await axios.get(`/reviews/search/location`, {
        params: { location, page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  like: async (reviewId) => {
    await axios.post(`/reviews/${reviewId}/like`);
  },

  unlike: async (reviewId) => {
    await axios.delete(`/reviews/${reviewId}/like`);
  },

  liked: async ({ page, size }) => {
    try {
      const { data } = await axios.get(`/reviews/liked`, {
        params: { page, size },
      });
      return data as TripReviewPage;
    } catch (error) {
      throw error;
    }
  },

  tagsPopular: async (limit) => {
    try {
      const { data } = await axios.get(`/reviews/tags/popular`, {
        params: { limit },
      });
      return data as string[];
    } catch (error) {
      throw error;
    }
  },
}));
