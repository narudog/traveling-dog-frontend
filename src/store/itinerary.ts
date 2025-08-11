import { create } from "zustand";
import axios from "@/lib/axios";

export interface ItineraryActivityDTO {
  id: number;
  itineraryId: number;
  title: string;
  description?: string;
  locationName?: string;
  position: number;
}

export interface ItineraryActivityCreateRequest {
  itineraryId: number;
  title: string;
  description?: string;
  locationName?: string;
}

export interface ItineraryActivityUpdateRequest {
  title?: string;
  description?: string;
  locationName?: string;
}

interface ItineraryState {
  loading: boolean;
  error: string | null;
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
}

export const useItineraryStore = create<ItineraryState & ItineraryActions>(
  (set) => ({
    loading: false,
    error: null,

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
  })
);
