// src/store/booking.ts
import { create } from "zustand";
import bookingApi from "@/lib/bookingApi";
import {
  HotelSearchParams,
  Hotel,
  HotelDetailsResponse,
  BookingRequest,
} from "@/types/booking";

interface BookingState {
  hotels: Hotel[];
  selectedHotel: HotelDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

interface BookingActions {
  searchHotelsDestination: (params: { city: string }) => Promise<string>;
  searchHotels: (params: HotelSearchParams) => Promise<Hotel[]>;
  getHotelDetails: (hotelId: string) => Promise<HotelDetailsResponse>;
  createBooking: (bookingData: BookingRequest) => Promise<any>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,

  searchHotelsDestination: async (params: { city: string }) => {
    try {
      const { data } = await bookingApi.get("/hotels/searchDestination", {
        params: {
          query: params.city,
        },
      });

      return data.data.find(
        (item: any) => item.dest_type === "city" && item.search_type === "city"
      )?.dest_id;
    } catch (error: any) {
      throw error;
    }
  },

  searchHotels: async (params: HotelSearchParams) => {
    try {
      const { data } = await bookingApi.get("/hotels/searchHotels", {
        params: {
          dest_id: params.destId, // dest_id 필수
          search_type: "city", // search_type 필수
          arrival_date: params.checkInDate, // arrival_date 필수
          departure_date: params.checkOutDate, // departure_date 필수
          adults: params.adults || 2,
          children: params.children || 0,
          room_qty: params.roomCount || 1,
          currency_code: params.currency || "KRW",
        },
      });

      return data.data.hotels.map(
        (hotel: { property: Hotel }) => hotel.property
      );
    } catch (error: any) {
      throw error;
    }
  },

  getHotelDetails: async (hotelId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bookingApi.get(`/hotels/getHotelDetails`, {
        params: { hotel_id: hotelId },
      });

      set({ selectedHotel: data, loading: false });
      return data;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || "호텔 상세 정보 조회 실패",
      });
      throw error;
    }
  },

  createBooking: async (bookingData: BookingRequest) => {
    set({ loading: true, error: null });
    try {
      const { data } = await bookingApi.post(
        "/bookings/createBooking",
        bookingData
      );
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({ loading: false, error: error?.message || "예약 생성 실패" });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
